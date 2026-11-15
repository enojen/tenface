// Lays a tree out as rows of 22 px cells. An only child stays in its parent's
// column; only a fork indents (the straight-chain rule of DESIGN.md).

export const Cell = { Blank: 'blank', Line: 'line', Tee: 'tee', Corner: 'corner' } as const;
export type Cell = (typeof Cell)[keyof typeof Cell];

export const RowKind = { Node: 'node', Gap: 'gap' } as const;

export type TreeRow<T> =
	| { kind: typeof RowKind.Node; item: T; cells: Cell[]; top: boolean; bottom: boolean }
	| { kind: typeof RowKind.Gap; cells: Cell[]; root: boolean };

const below = (cells: Cell[]): Cell[] =>
	cells.map((cell) => (cell === Cell.Tee ? Cell.Line : cell === Cell.Corner ? Cell.Blank : cell));

export function layout<T>(roots: T[], childrenOf: (item: T) => T[]): TreeRow<T>[] {
	const rows: TreeRow<T>[] = [];
	const walk = (item: T, cells: Cell[], top: boolean) => {
		const children = childrenOf(item);
		rows.push({ kind: RowKind.Node, item, cells, top, bottom: children.length > 0 });
		const next = below(cells);
		if (children.length === 1) {
			walk(children[0], next, true);
			return;
		}
		children.forEach((child, index) => {
			if (index > 0) rows.push({ kind: RowKind.Gap, cells: [...next, Cell.Line], root: false });
			walk(child, [...next, index === children.length - 1 ? Cell.Corner : Cell.Tee], false);
		});
	};
	roots.forEach((root, index) => {
		if (index > 0) rows.push({ kind: RowKind.Gap, cells: [], root: true });
		walk(root, [], false);
	});
	return rows;
}

export function childrenMap<T extends { id: string; parent: string | null }>(items: T[]) {
	const ids = new Set(items.map((item) => item.id));
	const children = new Map<string | null, T[]>();
	for (const item of items) {
		const key = item.parent !== null && ids.has(item.parent) ? item.parent : null;
		children.set(key, [...(children.get(key) ?? []), item]);
	}
	return {
		roots: children.get(null) ?? [],
		of: (item: T) => children.get(item.id) ?? []
	};
}
