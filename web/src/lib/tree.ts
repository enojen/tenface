// Turns a tree into rows of 22 px cells. An only child stays in its parent's
// column; only a fork indents (the straight-chain rule of DESIGN.md).

/** What one cell left of a node draws. */
export const Cell = {
	/** Nothing. */
	Empty: 'empty',
	/** │ the line of a sibling further down passes through. */
	Pass: 'pass',
	/** ├ a branch to this node; more siblings follow. */
	Branch: 'branch',
	/** └ a branch to the last sibling. */
	LastBranch: 'last-branch'
} as const;
export type Cell = (typeof Cell)[keyof typeof Cell];

export const RowKind = { Node: 'node', Gap: 'gap' } as const;

export type TreeRow<T> =
	| { kind: typeof RowKind.Node; item: T; cells: Cell[]; lineAbove: boolean; lineBelow: boolean }
	| { kind: typeof RowKind.Gap; cells: Cell[]; betweenRoots: boolean };

/** The cells of the rows under a node: a branch goes on as a line, the last branch ends. */
const cellsBelow = (cells: Cell[]): Cell[] =>
	cells.map((cell) =>
		cell === Cell.Branch ? Cell.Pass : cell === Cell.LastBranch ? Cell.Empty : cell
	);

/** The rows to draw, depth first, in the order of the children. */
export function treeRows<T>(roots: T[], childrenOf: (item: T) => T[]): TreeRow<T>[] {
	const rows: TreeRow<T>[] = [];
	const addSubtree = (item: T, cells: Cell[], lineAbove: boolean) => {
		const children = childrenOf(item);
		rows.push({ kind: RowKind.Node, item, cells, lineAbove, lineBelow: children.length > 0 });
		const next = cellsBelow(cells);
		if (children.length === 1) {
			addSubtree(children[0], next, true);
			return;
		}
		children.forEach((child, index) => {
			if (index > 0)
				rows.push({ kind: RowKind.Gap, cells: [...next, Cell.Pass], betweenRoots: false });
			addSubtree(
				child,
				[...next, index === children.length - 1 ? Cell.LastBranch : Cell.Branch],
				false
			);
		});
	};
	roots.forEach((root, index) => {
		if (index > 0) rows.push({ kind: RowKind.Gap, cells: [], betweenRoots: true });
		addSubtree(root, [], false);
	});
	return rows;
}

/** A task whose parent is not in the list is a root. */
export function groupByParent<T extends { id: string; parent: string | null }>(items: T[]) {
	const ids = new Set(items.map((item) => item.id));
	const children = new Map<string | null, T[]>();
	for (const item of items) {
		const key = item.parent !== null && ids.has(item.parent) ? item.parent : null;
		children.set(key, [...(children.get(key) ?? []), item]);
	}
	return {
		roots: children.get(null) ?? [],
		childrenOf: (item: T) => children.get(item.id) ?? []
	};
}
