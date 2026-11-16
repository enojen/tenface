<script lang="ts">
	import type { PlanTree } from '#lib/api/types.ts';
	import { diffDepth, diffPairs, Side } from '#lib/plan-diff.ts';
	import DiffLine from './DiffLine.svelte';

	let { tree, source }: { tree: PlanTree; source: string | null } = $props();

	const pairs = $derived(diffPairs(tree));
</script>

<div class="split-off">
	{#if source}
		<p class="joint"><span class="stem" aria-hidden="true"></span>Split off from lane <b>{source}</b></p>
	{/if}
	<section class="lane" id="new-lane-{tree.lane}" style:--depth={diffDepth(pairs)} aria-label="New lane {tree.lane}">
		<h3 class="bar">
			<span><span class="tag">NEW LANE</span>{tree.lane}</span>
			<span class="plus">+{pairs.length}</span>
		</h3>
		{#if tree.waits}<p class="waits">{tree.waits}</p>{/if}
		<ul>
			{#each pairs as pair, index (index)}
				<li>
					<DiffLine
						line={pair.right}
						side={Side.Right}
						note={index === 0 && source ? `← from ${source}` : null}
					/>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.joint {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		padding: 0 0 10px 22px;
		font-size: 13px;
		color: var(--muted);
	}

	.joint b {
		font-family: var(--mono);
		color: var(--ink);
	}

	.stem {
		width: 14px;
		height: 28px;
		margin-top: -14px;
		border-left: 1.5px dashed var(--mark);
		border-bottom: 1.5px dashed var(--mark);
		border-bottom-left-radius: 8px;
	}

	.lane {
		--tree-cell: 20px;
		--number: 34px;
		--sign: 14px;
		--step: 104px;
		container: single / inline-size;
		overflow: hidden;
		font-family: var(--sans);
		font-size: 13px;
		line-height: 22px;
		background: var(--tile);
		border: 1px solid var(--ink);
		border-radius: 12px;
		scroll-margin-top: 16px;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 4px 14px;
		margin: 0;
		padding: 8px 12px;
		font-size: 13px;
		font-weight: 600;
		background: var(--lift);
		border-bottom: 1px solid var(--line-strong);
	}

	.tag {
		display: inline-block;
		margin-right: 8px;
		padding: 0 8px;
		font-family: var(--sans);
		font-size: 11px;
		font-weight: 700;
		line-height: 18px;
		letter-spacing: 0.06em;
		border: 1px solid var(--ink);
		border-radius: 999px;
	}

	.plus {
		font-size: 12px;
		font-weight: 500;
		color: var(--diff-add-ink);
	}

	.waits {
		margin: 0;
		padding: 6px 12px;
		font-size: 12px;
		color: var(--muted);
		border-bottom: 1px solid var(--line);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
</style>
