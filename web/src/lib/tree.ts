export const Cell = {
	Empty: 'empty',
	Pass: 'pass',
	Branch: 'branch',
	LastBranch: 'last-branch'
} as const;
export type Cell = (typeof Cell)[keyof typeof Cell];

export const RowKind = { Node: 'node', Gap: 'gap' } as const;

export type TreeRow<T> =
	| { kind: typeof RowKind.Node; item: T; cells: Cell[]; lineAbove: boolean; lineBelow: boolean }
	| { kind: typeof RowKind.Gap; cells: Cell[]; betweenRoots: boolean };

const cellsBelow = (cells: Cell[]): Cell[] =>
	cells.map((cell) =>
		cell === Cell.Branch ? Cell.Pass : cell === Cell.LastBranch ? Cell.Empty : cell
	);

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
