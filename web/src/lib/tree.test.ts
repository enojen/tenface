import { describe, expect, it } from 'vitest';
import { groupByParent, RowKind, type TreeRow, treeRows } from './tree.ts';

const task = (id: string, parent: string | null = null) => ({ id, parent });

function draw(rows: TreeRow<{ id: string }>[]) {
	return rows.map((row) =>
		row.kind === RowKind.Gap
			? `gap ${row.cells.join(',')}`
			: `${row.item.id} ${row.cells.join(',')}${row.lineAbove ? ' above' : ''}${row.lineBelow ? ' below' : ''}`
	);
}

const rowsOf = (items: { id: string; parent: string | null }[]) => {
	const tree = groupByParent(items);
	return treeRows(tree.roots, tree.childrenOf);
};

describe('treeRows', () => {
	it('draws the api lane of the design', () => {
		const rows = rowsOf([
			task('SAM-101'),
			task('SAM-102', 'SAM-101'),
			task('SAM-103', 'SAM-101'),
			task('SAM-105', 'SAM-103'),
			task('SAM-106', 'SAM-103'),
			task('SAM-108', 'SAM-105'),
			task('SAM-112', 'SAM-108')
		]);
		expect(draw(rows)).toEqual([
			'SAM-101  below',
			'SAM-102 branch',
			'gap pass',
			'SAM-103 last-branch below',
			'SAM-105 empty,branch below',
			'SAM-108 empty,pass above below',
			'SAM-112 empty,pass above',
			'gap empty,pass',
			'SAM-106 empty,last-branch'
		]);
	});

	it('keeps a straight chain in one column', () => {
		expect(draw(rowsOf([task('a'), task('b', 'a'), task('c', 'b')]))).toEqual([
			'a  below',
			'b  above below',
			'c  above'
		]);
	});

	it('puts a gap between roots', () => {
		expect(rowsOf([task('a'), task('b')]).map((row) => row.kind)).toEqual([
			RowKind.Node,
			RowKind.Gap,
			RowKind.Node
		]);
	});
});

describe('groupByParent', () => {
	it('treats a parent outside the list as a root', () => {
		expect(groupByParent([task('a', 'elsewhere')]).roots.map((item) => item.id)).toEqual(['a']);
	});
});
