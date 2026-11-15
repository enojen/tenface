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
		width: 22px;
		flex: none;
	}

	.line::before,
	.tee::before,
	.tee::after,
	.corner::before {
		content: '';
		position: absolute;
		left: 10px;
	}

	.line::before,
	.tee::before {
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--mark);
	}

	.tee::after {
		top: 31px;
		width: 15px;
		height: 2px;
		background: var(--mark);
	}

	.corner::before {
		top: 0;
		width: 15px;
		height: 33px;
		border-left: 2px solid var(--mark);
		border-bottom: 2px solid var(--mark);
		border-bottom-left-radius: 8px;
	}
</style>
