import { describe, expect, it } from 'vitest';
import { childrenMap, layout, type TreeRow } from './tree.ts';

const task = (id: string, parent: string | null = null) => ({ id, parent });

function draw(rows: TreeRow<{ id: string }>[]) {
	return rows.map((row) =>
		row.kind === 'gap'
			? `gap ${row.cells.join(',')}`
			: `${row.item.id} ${row.cells.join(',')}${row.top ? ' top' : ''}${row.bottom ? ' bottom' : ''}`
	);
}

describe('layout', () => {
	it('draws the api lane of the design', () => {
		const tree = childrenMap([
			task('SAM-101'),
			task('SAM-102', 'SAM-101'),
			task('SAM-103', 'SAM-101'),
			task('SAM-105', 'SAM-103'),
			task('SAM-106', 'SAM-103'),
			task('SAM-108', 'SAM-105'),
			task('SAM-112', 'SAM-108')
		]);
		expect(draw(layout(tree.roots, tree.of))).toEqual([
			'SAM-101  bottom',
			'SAM-102 tee',
			'gap line',
			'SAM-103 corner bottom',
			'SAM-105 blank,tee bottom',
			'SAM-108 blank,line top bottom',
			'SAM-112 blank,line top',
			'gap blank,line',
			'SAM-106 blank,corner'
		]);
	});

	it('keeps a straight chain in one column', () => {
		const tree = childrenMap([task('a'), task('b', 'a'), task('c', 'b')]);
		expect(draw(layout(tree.roots, tree.of))).toEqual(['a  bottom', 'b  top bottom', 'c  top']);
	});

	it('puts a gap between roots', () => {
		const tree = childrenMap([task('a'), task('b')]);
		expect(layout(tree.roots, tree.of).map((row) => row.kind)).toEqual(['node', 'gap', 'node']);
	});

	it('treats a parent outside the list as a root', () => {
		const tree = childrenMap([task('a', 'elsewhere')]);
		expect(tree.roots.map((item) => item.id)).toEqual(['a']);
	});
});
