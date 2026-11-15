// Lays a tree out as rows of 22 px cells. An only child stays in its parent's
// column; only a fork indents (the straight-chain rule of DESIGN.md).

export type Cell = 'blank' | 'line' | 'tee' | 'corner';

export type TreeRow<T> =
	| { kind: 'node'; item: T; cells: Cell[]; top: boolean; bottom: boolean }
	| { kind: 'gap'; cells: Cell[]; root: boolean };

const below = (cells: Cell[]): Cell[] =>
	cells.map((cell) => (cell === 'tee' ? 'line' : cell === 'corner' ? 'blank' : cell));

export function layout<T>(roots: T[], childrenOf: (item: T) => T[]): TreeRow<T>[] {
	const rows: TreeRow<T>[] = [];
	const walk = (item: T, cells: Cell[], top: boolean) => {
		const children = childrenOf(item);
		rows.push({ kind: 'node', item, cells, top, bottom: children.length > 0 });
		const next = below(cells);
		if (children.length === 1) {
			walk(children[0], next, true);
			return;
		}
		children.forEach((child, index) => {
			if (index > 0) rows.push({ kind: 'gap', cells: [...next, 'line'], root: false });
			walk(child, [...next, index === children.length - 1 ? 'corner' : 'tee'], false);
		});
	};
	roots.forEach((root, index) => {
		if (index > 0) rows.push({ kind: 'gap', cells: [], root: true });
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
