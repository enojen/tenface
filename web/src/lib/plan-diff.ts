import { type PlanNode, PlanSign, type PlanTree } from './api/types.ts';
import { type Cell, RowKind, treeRows } from './tree.ts';

export const Side = { Left: 'left', Right: 'right' } as const;
export type Side = (typeof Side)[keyof typeof Side];

export const LineKind = { Same: 'same', Added: 'added', Removed: 'removed' } as const;
export type LineKind = (typeof LineKind)[keyof typeof LineKind];

export interface Part {
	text: string;
	changed: boolean;
}

export interface DiffLine {
	node: PlanNode;
	kind: LineKind;
	number: number;
	cells: Cell[];
	lineAbove: boolean;
	lineBelow: boolean;
	title: Part[];
}

export interface DiffPair {
	left: DiffLine | null;
	right: DiffLine | null;
}

interface Kept {
	node: PlanNode;
	children: Kept[];
}

interface Place {
	number: number;
	cells: Cell[];
	lineAbove: boolean;
	lineBelow: boolean;
}

const LEAVES_BEFORE: ReadonlySet<PlanSign | null> = new Set([PlanSign.Added]);
const LEAVES_AFTER: ReadonlySet<PlanSign | null> = new Set([PlanSign.Removed, PlanSign.Moved]);

function keep(roots: PlanNode[], leaves: ReadonlySet<PlanSign | null>): Kept[] {
	return roots
		.filter((node) => !leaves.has(node.sign))
		.map((node) => ({ node, children: keep(node.children, leaves) }));
}

function places(roots: Kept[]): Map<PlanNode, Place> {
	const found = new Map<PlanNode, Place>();
	for (const row of treeRows(roots, (kept) => kept.children)) {
		if (row.kind === RowKind.Node)
			found.set(row.item.node, {
				number: found.size + 1,
				cells: row.cells,
				lineAbove: row.lineAbove,
				lineBelow: row.lineBelow
			});
	}
	return found;
}

function commonLength(a: string[], b: string[]): number {
	let length = 0;
	while (length < a.length && length < b.length && a[length] === b[length]) length += 1;
	return length;
}

function split(words: string[], head: number, tail: number): Part[] {
	const end = words.length - tail;
	return [
		{ text: words.slice(0, head).join(' '), changed: false },
		{ text: words.slice(head, end).join(' '), changed: true },
		{ text: words.slice(end).join(' '), changed: false }
	].filter((part) => part.text.length > 0);
}

export function wordDiff(before: string, after: string): { before: Part[]; after: Part[] } {
	const a = before.split(' ');
	const b = after.split(' ');
	const head = commonLength(a, b);
	const tail = commonLength(a.slice(head).reverse(), b.slice(head).reverse());
	return { before: split(a, head, tail), after: split(b, head, tail) };
}

const plain = (text: string): Part[] => [{ text, changed: false }];

function line(node: PlanNode, kind: LineKind, place: Place | undefined, title: Part[]) {
	return place ? { node, kind, title, ...place } : null;
}

function pairOf(
	node: PlanNode,
	before: Map<PlanNode, Place>,
	after: Map<PlanNode, Place>
): DiffPair {
	const left = before.get(node);
	const right = after.get(node);
	if (node.sign === PlanSign.Changed && node.old !== null) {
		const words = wordDiff(node.old, node.title);
		return {
			left: line(node, LineKind.Removed, left, words.before),
			right: line(node, LineKind.Added, right, words.after)
		};
	}
	const kind = node.sign === null ? LineKind.Same : LineKind.Added;
	return {
		left: line(
			node,
			node.sign === null ? LineKind.Same : LineKind.Removed,
			left,
			plain(node.title)
		),
		right: line(node, kind, right, plain(node.title))
	};
}

function walk(roots: PlanNode[]): PlanNode[] {
	return roots.flatMap((node) => [node, ...walk(node.children)]);
}

export function diffPairs(tree: PlanTree): DiffPair[] {
	const before = tree.isNew ? new Map<PlanNode, Place>() : places(keep(tree.roots, LEAVES_BEFORE));
	const after = places(keep(tree.roots, LEAVES_AFTER));
	return walk(tree.roots).map((node) =>
		tree.isNew
			? { left: null, right: line(node, LineKind.Added, after.get(node), plain(node.title)) }
			: pairOf(node, before, after)
	);
}

export interface DiffCount {
	added: number;
	removed: number;
	moved: number;
}

const isMoved = (line: DiffLine | null) => line?.node.sign === PlanSign.Moved;

export function diffCount(pairs: DiffPair[]): DiffCount {
	const lines = (side: Side, kind: LineKind) =>
		pairs.map((pair) => pair[side]).filter((line) => line?.kind === kind);
	const removed = lines(Side.Left, LineKind.Removed);
	return {
		added: lines(Side.Right, LineKind.Added).length,
		removed: removed.filter((line) => !isMoved(line)).length,
		moved: removed.filter(isMoved).length
	};
}

const isSame = (line: DiffLine | null) => line?.kind === LineKind.Same;

export const isChange = (pair: DiffPair) => !isSame(pair.left) || !isSame(pair.right);

export const HunkKind = { Shown: 'shown', Folded: 'folded' } as const;
export type HunkKind = (typeof HunkKind)[keyof typeof HunkKind];

export interface Hunk {
	kind: HunkKind;
	pairs: DiffPair[];
}

function nearChange(pairs: DiffPair[], index: number, context: number): boolean {
	return pairs.slice(Math.max(0, index - context), index + context + 1).some(isChange);
}

export function hunks(pairs: DiffPair[], context = 1): Hunk[] {
	const result: Hunk[] = [];
	pairs.forEach((pair, index) => {
		const kind = nearChange(pairs, index, context) ? HunkKind.Shown : HunkKind.Folded;
		const last = result.at(-1);
		if (last?.kind === kind) last.pairs.push(pair);
		else result.push({ kind, pairs: [pair] });
	});
	return result;
}

export function diffDepth(pairs: DiffPair[]): number {
	const lines = pairs.flatMap((pair) => [pair.left, pair.right]);
	return Math.max(0, ...lines.map((line) => line?.cells.length ?? 0)) + 1;
}

const refsOf = (tree: PlanTree) => new Set(walk(tree.roots).map((node) => node.ref));

export function laneOfRef(trees: PlanTree[], ref: string, isNew: boolean): string | null {
	return trees.find((tree) => tree.isNew === isNew && refsOf(tree).has(ref))?.lane ?? null;
}

export function splitSource(trees: PlanTree[], newLane: PlanTree): string | null {
	const refs = [...refsOf(newLane)];
	return (
		trees.find((tree) => !tree.isNew && refs.some((ref) => refsOf(tree).has(ref)))?.lane ?? null
	);
}

export interface LaneMove {
	to: string | null;
	count: number;
}

export interface LaneChange {
	lane: string;
	isNew: boolean;
	added: number;
	removed: number;
	moves: LaneMove[];
	source: string | null;
}

function movesOf(trees: PlanTree[], tree: PlanTree): LaneMove[] {
	const counts = new Map<string | null, number>();
	for (const node of walk(tree.roots).filter((item) => item.sign === PlanSign.Moved)) {
		const to = laneOfRef(trees, node.ref, true);
		counts.set(to, (counts.get(to) ?? 0) + 1);
	}
	return [...counts].map(([to, count]) => ({ to, count }));
}

function laneChange(trees: PlanTree[], tree: PlanTree): LaneChange {
	const count = diffCount(diffPairs(tree));
	return {
		lane: tree.lane,
		isNew: tree.isNew,
		added: count.added,
		removed: count.removed,
		moves: tree.isNew ? [] : movesOf(trees, tree),
		source: tree.isNew ? splitSource(trees, tree) : null
	};
}

export const laneChanges = (trees: PlanTree[]): LaneChange[] =>
	[...trees.filter((tree) => !tree.isNew), ...trees.filter((tree) => tree.isNew)].map((tree) =>
		laneChange(trees, tree)
	);
