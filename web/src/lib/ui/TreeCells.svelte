<script lang="ts">
	import type { Cell } from '#lib/tree.ts';

	let { cells }: { cells: Cell[] } = $props();
</script>

{#each cells as cell, index (index)}
	<span class="cell {cell}" aria-hidden="true"></span>
{/each}

<style>
	.cell {
		position: relative;
		width: var(--tree-cell, 22px);
		flex: none;
	}

	.pass::before,
	.branch::before,
	.branch::after,
	.last-branch::before {
		content: '';
		position: absolute;
		left: 6px;
	}

	.pass::before,
	.branch::before {
		top: 0;
		bottom: 0;
		width: 1px;
		background: var(--mark);
	}

	.branch::after {
		top: 15px;
		width: calc(var(--tree-cell, 22px) - 6px);
		height: 1px;
		background: var(--mark);
	}

	.last-branch::before {
		top: 0;
		width: calc(var(--tree-cell, 22px) - 6px);
		height: 16px;
		border-left: 1px solid var(--mark);
		border-bottom: 1px solid var(--mark);
	}
</style>
