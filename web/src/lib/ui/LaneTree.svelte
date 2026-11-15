<script lang="ts">
	import type { Lane, StepName, Task } from '#lib/api/types.ts';
	import { groupByParent, treeRows } from '#lib/tree.ts';
	import StepMini from './StepMini.svelte';
	import TreeCells from './TreeCells.svelte';

	let {
		lane,
		steps,
		picked = null,
		offline = false,
		href
	}: { lane: Lane; steps: StepName[]; picked?: string | null; offline?: boolean; href: (task: Task) => string } = $props();

	const rows = $derived.by(() => {
		const tree = groupByParent(lane.tasks);
		return treeRows(tree.roots, tree.childrenOf);
	});
</script>

<ul class="tree" aria-label="Tasks of {lane.name}">
	{#each rows as row, index (row.kind === 'node' ? row.item.id : `gap-${index}`)}
		{#if row.kind === 'gap'}
			<li class="gap" class:between-roots={row.betweenRoots} aria-hidden="true"><TreeCells cells={row.cells} /></li>
		{:else}
			{@const task = row.item}
			<li>
				<a class="row" class:picked={picked === task.id} href={href(task)} aria-current={picked === task.id ? 'true' : undefined}>
					<TreeCells cells={row.cells} />
					<span class="node-cell" class:line-above={row.lineAbove} class:line-below={row.lineBelow}>
						<span class="node {task.state}" class:offline={offline && task.state === 'running'}></span>
					</span>
					<span class="text">
						<span class="meta label">
							<span class="mono">{task.id}</span>
							<span>· {task.tracker.status}</span>
							{#if task.state === 'asking'}
								<svg role="img" aria-label="The babysitter asks you" width="12" height="16" viewBox="0 0 12 16">
									<rect x="0.75" y="0.75" width="10.5" height="14.5" rx="2.5" fill="var(--tile)" stroke="var(--ink)" stroke-width="1.5" />
									<text x="6" y="11.5" text-anchor="middle" font-size="9" font-weight="700" fill="var(--ink)">?</text>
								</svg>
							{/if}
						</span>
						<span class="name {task.state}">{task.title}</span>
					</span>
					<StepMini {task} {steps} {offline} />
				</a>
			</li>
		{/if}
	{/each}
</ul>

<style>
	.tree {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.gap {
		display: flex;
		height: 12px;
	}

	.gap.between-roots {
		height: 20px;
	}

	.row {
		display: flex;
		align-items: stretch;
		min-height: 64px;
		border-radius: 12px;
	}

	.row.picked {
		box-shadow: inset 0 0 0 2px var(--ink);
		padding-right: 8px;
	}

	.node-cell {
		position: relative;
		width: 22px;
		flex: none;
	}

	.node-cell.line-above::before,
	.node-cell.line-below::after {
		content: '';
		position: absolute;
		left: 10px;
		width: 2px;
		background: var(--mark);
	}

	.node-cell.line-above::before {
		top: 0;
		height: 24px;
	}

	.node-cell.line-below::after {
		top: 40px;
		bottom: 0;
	}

	.node {
		position: absolute;
		left: 3px;
		top: 24px;
		width: 16px;
		height: 16px;
		border-radius: 5px;
	}

	.node.done {
		background: var(--mark-done);
	}

	.node.running {
		background: var(--running);
	}

	.node.todo,
	.node.offline {
		background: none;
		border: 1.5px solid var(--mark);
	}

	.node.offline {
		border-width: 2px;
	}

	.node.asking {
		background: var(--tile);
		border: 2px solid var(--ink);
	}

	.text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
		padding: 8px 0 8px 8px;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 6px;
		color: var(--muted);
	}

	.meta > * {
		white-space: nowrap;
	}

	.meta .mono {
		font-weight: 500;
	}

	.name {
		font-size: 16px;
		line-height: 22px;
		overflow-wrap: anywhere;
	}

	.name.done {
		color: var(--muted-soft);
	}

	.name.todo {
		color: var(--ink-soft);
	}
</style>
