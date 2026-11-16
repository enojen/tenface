import { describe, expect, it } from 'vitest';
import { type PlanNode, PlanSign, type PlanTree } from './api/types.ts';
import {
	type DiffPair,
	diffCount,
	diffDepth,
	diffPairs,
	HunkKind,
	hunks,
	splitSource,
	wordDiff
} from './plan-diff.ts';

const node = (
	ref: string,
	sign: PlanSign | null,
	children: PlanNode[] = [],
	old: string | null = null
): PlanNode => ({ ref, title: `${ref} title`, sign, note: null, old, children });

const searchLane: PlanTree = {
	lane: 'search',
	isNew: false,
	waits: null,
	roots: [
		node('SAM-301', null, [
			node('SAM-302', null, [
				node('SAM-303', PlanSign.Changed, [], 'Old title'),
				node('SAM-311', PlanSign.Added),
				node('SAM-299', PlanSign.Removed),
				node('SAM-304', PlanSign.Moved)
			])
		])
	]
};

function draw(pairs: DiffPair[]) {
	const side = (line: DiffPair['left']) =>
		line ? `${line.number} ${line.kind} ${line.node.ref} ${line.cells.join(',')}` : '-';
	return pairs.map((pair) => `${side(pair.left)} | ${side(pair.right)}`);
}

describe('diffPairs', () => {
	it('pairs the old and the new tree of a lane row by row', () => {
		expect(draw(diffPairs(searchLane))).toEqual([
			'1 same SAM-301  | 1 same SAM-301 ',
			'2 same SAM-302  | 2 same SAM-302 ',
			'3 removed SAM-303 branch | 3 added SAM-303 branch',
			'- | 4 added SAM-311 last-branch',
			'4 removed SAM-299 branch | -',
			'5 removed SAM-304 last-branch | -'
		]);
	});

	it('puts every task of a new lane on the right side only', () => {
		const lane: PlanTree = {
			...searchLane,
			isNew: true,
			roots: [node('SAM-304', null, [node('SAM-305', null)])]
		};
		expect(draw(diffPairs(lane))).toEqual(['- | 1 added SAM-304 ', '- | 2 added SAM-305 ']);
	});

	it('counts the added and the removed lines', () => {
		expect(diffCount(diffPairs(searchLane))).toEqual({ added: 2, removed: 2, moved: 1 });
	});
});

describe('wordDiff', () => {
	it('marks only the words that changed', () => {
		expect(wordDiff('Search by customer name', 'Search by name and email')).toEqual({
			before: [
				{ text: 'Search by', changed: false },
				{ text: 'customer name', changed: true }
			],
			after: [
				{ text: 'Search by', changed: false },
				{ text: 'name and email', changed: true }
			]
		});
	});
});

describe('hunks', () => {
	const long: PlanTree = {
		...searchLane,
		roots: [
			node('SAM-1', null, [
				node('SAM-2', null, [
					node('SAM-3', null, [node('SAM-4', null, [node('SAM-5', PlanSign.Added)])])
				])
			])
		]
	};

	it('folds the unchanged tasks and keeps one task of context', () => {
		const parts = hunks(diffPairs(long)).map((hunk) => `${hunk.kind} ${hunk.pairs.length}`);
		expect(parts).toEqual([`${HunkKind.Folded} 3`, `${HunkKind.Shown} 2`]);
	});

	it('measures the tree column from the deepest line', () => {
		expect(diffDepth(diffPairs(searchLane))).toBe(2);
	});
});

describe('splitSource', () => {
	it('finds the lane a new lane takes its tasks from', () => {
		const fresh: PlanTree = {
			lane: 'search-index',
			isNew: true,
			waits: null,
			roots: [node('SAM-304', null)]
		};
		expect(splitSource([searchLane, fresh], fresh)).toBe('search');
	});
});

describe('tree lines', () => {
	it('links a task to its only child in the same column', () => {
		const chain: PlanTree = {
			...searchLane,
			isNew: true,
			roots: [node('SAM-304', null, [node('SAM-305', null, [node('SAM-306', null)])])]
		};
		const lines = diffPairs(chain).map((pair) => [pair.right?.lineAbove, pair.right?.lineBelow]);
		expect(lines).toEqual([
			[false, true],
			[true, true],
			[true, false]
		]);
	});
});
