<script lang="ts" module>
	export const SkeletonKind = { Tree: 'tree', Table: 'table', Card: 'card' } as const;
	export type SkeletonKind = (typeof SkeletonKind)[keyof typeof SkeletonKind];
</script>

<script lang="ts">
	let { kind, label, rows = 4 }: { kind: SkeletonKind; label: string; rows?: number } = $props();
	const lines = $derived(Array.from({ length: rows }, (_, index) => index));
</script>

<div class="skeleton" data-kind={kind} role="status" aria-label={label}>
	{#each lines as line (line)}
		<div class="row" aria-hidden="true">
			{#if kind === SkeletonKind.Tree}<span class="node"></span>{/if}
			<span class="lines">
				<span class="bar short"></span>
				{#if kind !== SkeletonKind.Table}<span class="bar"></span>{/if}
			</span>
			{#if kind === SkeletonKind.Table}<span class="bar cell"></span><span class="bar cell small"></span>{/if}
		</div>
	{/each}
</div>

<style>
	.skeleton {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 64px;
	}

	[data-kind="table"] .row {
		display: grid;
		grid-template-columns: var(--columns);
		min-height: 52px;
		padding: 0 4px;
		border-top: 1px solid var(--line);
	}

	[data-kind="table"] .cell {
		justify-self: center;
	}

	[data-kind="card"] .row {
		min-height: 48px;
	}

	.node {
		flex: none;
		width: 14px;
		height: 14px;
		margin-left: 2px;
		border-radius: 4px;
		background: var(--raised);
	}

	.lines {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.bar {
		display: block;
		height: 12px;
		width: 80%;
		border-radius: 4px;
		background: var(--raised);
	}

	.bar.short {
		width: 40%;
	}

	.bar.cell {
		width: 64px;
	}

	.bar.cell.small {
		width: 24px;
	}
</style>
