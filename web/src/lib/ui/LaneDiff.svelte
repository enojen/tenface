<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { api } from '#lib/api/index.ts';
	import type { PlanTree, Task } from '#lib/api/types.ts';
	import { loadFor } from '#lib/load.svelte.ts';
	import {
		type DiffPair,
		diffCount,
		diffDepth,
		diffPairs,
		HunkKind,
		hunks,
		laneOfRef,
		Side
	} from '#lib/plan-diff.ts';
	import DiffLine from './DiffLine.svelte';

	let { projectId, tree, trees }: { projectId: string; tree: PlanTree; trees: PlanTree[] } = $props();

	const lane = loadFor(
		() => `${projectId}/${tree.lane}`,
		(signal) => api.lane(projectId, tree.lane, signal)
	);
	const tasks = $derived(new Map<string, Task>((lane.value?.tasks ?? []).map((task) => [task.id, task])));
	const pairs = $derived(diffPairs(tree));
	const count = $derived(diffCount(pairs));
	const parts = $derived(hunks(pairs));
	const opened = new SvelteSet<number>();

	const taskOf = (pair: DiffPair) => {
		const node = pair.left?.node ?? pair.right?.node;
		return node && node.sign === null ? tasks.get(node.ref) : undefined;
	};
	const movedTo = (pair: DiffPair) => (pair.left ? laneOfRef(trees, pair.left.node.ref, true) : null);
	const toggle = (index: number) => (opened.has(index) ? opened.delete(index) : opened.add(index));
</script>

{#snippet pairRow(pair: DiffPair)}
	{@const target = movedTo(pair)}
	{@const task = taskOf(pair)}
	<li class="pair">
		<DiffLine
			line={pair.left}
			side={Side.Left}
			{task}
			note={target ? `→ ${target}` : pair.left?.node.note}
			link={target ? `#new-lane-${target}` : null}
		/>
		<DiffLine line={pair.right} side={Side.Right} {task} />
	</li>
{/snippet}

<section class="diff" style:--depth={diffDepth(pairs)} aria-label="Lane diff of {tree.lane}">
	<h3 class="title">
		<span>{tree.lane}</span>
		<span class="counts">
			<span class="plus">+{count.added}</span>
			<span class="minus">−{count.removed}</span>
			{#if count.moved > 0}<span>{count.moved} moved out</span>{/if}
		</span>
	</h3>
	<ul class="cards">
		<li class="pair heads" aria-hidden="true">
			<span class="head left">now</span>
			<span class="head right"><span class="wide">after the change</span><span class="narrow">now and after the change</span></span>
		</li>
		{#each parts as part, index (index)}
			{#if part.kind === HunkKind.Shown}
				{#each part.pairs as pair, at (at)}{@render pairRow(pair)}{/each}
			{:else}
				<li class="pair">
					<button type="button" class="fold left" aria-expanded={opened.has(index)} onclick={() => toggle(index)}>
						<span class="arrow" aria-hidden="true">{opened.has(index) ? '▴' : '⋯'}</span>
						{part.pairs.length} unchanged {part.pairs.length === 1 ? 'task' : 'tasks'}
					</button>
					<span class="fold right" aria-hidden="true"></span>
				</li>
				{#if opened.has(index)}
					{#each part.pairs as pair, at (at)}{@render pairRow(pair)}{/each}
				{/if}
			{/if}
		{/each}
		<li class="pair feet" aria-hidden="true"><span class="foot left"></span><span class="foot right"></span></li>
	</ul>
</section>

<style>
	.diff {
		--tree-cell: 20px;
		--number: 34px;
		--sign: 14px;
		--step: 104px;
		container: diff / inline-size;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: var(--sans);
		font-size: 13px;
		line-height: 22px;
	}

	.title {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;
		gap: 4px 14px;
		margin: 0;
		padding: 0 4px;
		font-size: 13px;
		font-weight: 600;
	}

	.counts {
		display: flex;
		gap: 10px;
		font-size: 12px;
		font-weight: 500;
		color: var(--muted);
	}

	.plus {
		color: var(--diff-add-ink);
	}

	.minus {
		color: var(--diff-remove-ink);
	}

	.cards {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		column-gap: 12px;
	}

	.pair > :global(*) {
		background-color: var(--tile);
		border-inline: 1px solid var(--line-strong);
	}

	.head {
		padding: 6px 12px;
		font-size: 11px;
		font-weight: 600;
		color: var(--muted);
		background-color: var(--raised);
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line-strong);
		border-radius: 12px 12px 0 0;
	}

	.head.left,
	.fold.right,
	.wide {
		display: none;
	}

	.foot {
		height: 6px;
		border-bottom: 1px solid var(--line-strong);
		border-radius: 0 0 12px 12px;
	}

	.foot.left {
		display: none;
	}

	.fold {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 28px;
		padding: 2px 12px;
		font: inherit;
		font-size: 12px;
		text-align: left;
		color: var(--muted);
		background-color: var(--ground);
		border-block: 1px solid var(--line);
	}

	button.fold {
		cursor: pointer;
	}

	button.fold:hover {
		color: var(--ink);
		background-color: var(--raised);
	}

	.arrow {
		width: 34px;
		text-align: right;
		font-weight: 600;
	}

	@container (min-width: 600px) {
		.pair {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}

		.head.left,
		.fold.right,
		.foot.left {
			display: block;
		}

		.wide {
			display: inline;
		}

		.narrow {
			display: none;
		}
	}
</style>
