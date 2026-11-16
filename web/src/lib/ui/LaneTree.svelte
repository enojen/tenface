<script lang="ts">
	import { type Lane, type Task, TaskState } from '#lib/api/types.ts';
	import { live } from '#lib/live.svelte.ts';
	import { rowStep } from '#lib/steps.ts';
	import { groupByParent, RowKind, treeRows } from '#lib/tree.ts';
	import TreeCells from './TreeCells.svelte';

	let {
		lane,
		picked = null,
		offline = false,
		href
	}: { lane: Lane; picked?: string | null; offline?: boolean; href: (task: Task) => string } = $props();

	const nodes = $derived.by(() => {
		const tree = groupByParent(lane.tasks);
		return treeRows(tree.roots, tree.childrenOf).filter((row) => row.kind === RowKind.Node);
	});
	const depth = $derived(Math.max(0, ...nodes.map((row) => row.cells.length)) + 1);

	function keepSelection(event: MouseEvent) {
		if (window.getSelection()?.toString()) event.preventDefault();
	}
</script>

<div class="tree" style:--depth={depth}>
	<div class="row head" aria-hidden="true">
		<span class="number">#</span>
		<span></span>
		<span class="text">task</span>
		<span class="step">step</span>
	</div>
	<ul aria-label="Tasks of {lane.name}">
		{#each nodes as row, index (row.item.id)}
			{@const task = row.item}
			{@const step = rowStep(task, live.now, offline)}
			<li>
				<a class="row {task.state}" class:picked={picked === task.id} class:offline={offline && task.state === TaskState.Running} href={href(task)} draggable="false" onclick={keepSelection} aria-current={picked === task.id ? 'true' : undefined}>
					<span class="number" aria-hidden="true">{index + 1}</span>
					<span class="graph" aria-hidden="true">
						<TreeCells cells={row.cells} />
						<span class="node-cell" class:line-above={row.lineAbove} class:line-below={row.lineBelow}><span class="node"></span></span>
					</span>
					<span class="text">
						<span class="id">{task.id}</span>
						<span class="name">{task.title}</span>
					</span>
					<span class="step" role="img" aria-label="{step.label}{task.state === TaskState.Asking ? ', the babysitter asks you' : ''}">
						<span class="tile"></span>
						<span class="word">{step.word}</span>
						{#if step.time}<span class="time">{step.time}</span>{/if}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.tree {
		--tree-cell: 22px;
		--number: 34px;
		--step: 112px;
		container-type: inline-size;
		margin: calc(-1 * var(--band-pad, 0px)) calc(-1 * var(--band-pad, 0px)) 0;
		font-family: var(--sans);
		font-size: 13px;
		line-height: 22px;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	a.row {
		-webkit-user-drag: none;
		user-select: text;
	}

	.row {
		display: grid;
		grid-template-columns: var(--number) calc(var(--tree-cell) * var(--depth)) minmax(0, 1fr) var(--step);
		min-height: 30px;
	}

	.row.head {
		min-height: 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--muted);
		padding-top: 2px;
		background: var(--raised);
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line-strong);
	}

	.row.head > span {
		padding-block: 2px;
	}

	.row.picked {
		background: var(--raised);
	}

	.number {
		padding: 4px 8px 0 0;
		text-align: right;
		font-size: 12px;
		color: var(--muted-soft);
		user-select: none;
	}

	.graph {
		display: flex;
	}

	.node-cell {
		position: relative;
		width: var(--tree-cell);
		flex: none;
	}

	.node-cell.line-above::before,
	.node-cell.line-below::after {
		content: '';
		position: absolute;
		left: 6px;
		width: 1px;
		background: var(--mark);
	}

	.node-cell.line-above::before {
		top: 0;
		height: 10px;
	}

	.node-cell.line-below::after {
		top: 21px;
		bottom: 0;
	}

	.node {
		position: absolute;
		left: 1px;
		top: 10px;
		width: 11px;
		height: 11px;
		border-radius: 3px;
		background: var(--tile);
		border: 1px solid var(--mark);
	}

	.done .node {
		background: var(--mark-done);
		border-color: var(--mark-done);
	}

	.running .node {
		background: var(--running);
		border-color: var(--running);
	}

	.asking .node {
		border: 2px solid var(--ink);
	}

	.picked .node {
		box-shadow: 0 0 0 2px var(--raised);
	}

	.text {
		display: flex;
		align-items: flex-start;
		gap: 0 2ch;
		min-width: 0;
		padding: 4px 10px;
	}

	.id {
		flex: none;
		font-variant-numeric: tabular-nums;
		color: var(--muted);
		white-space: nowrap;
	}

	.name {
		flex: 1;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.done .name {
		color: var(--muted-soft);
	}

	.todo .name {
		color: var(--ink-soft);
	}

	.picked .name {
		font-weight: 600;
	}

	.step {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		padding: 4px 10px 0 0;
		font-size: 12px;
		color: var(--muted);
		white-space: nowrap;
	}

	.tile {
		flex: none;
		width: 8px;
		height: 8px;
		margin-top: 7px;
		border-radius: 2px;
		border: 1px solid var(--mark);
	}

	.done .tile {
		background: var(--mark-done);
		border-color: var(--mark-done);
	}

	.running .step {
		font-weight: 600;
		color: var(--running);
	}

	.running .tile {
		background: var(--running);
		border-color: var(--running);
	}

	.asking .step {
		font-weight: 600;
		color: var(--ink);
	}

	.asking .tile {
		border: 1.5px solid var(--ink);
	}

	.running.offline .node {
		background: var(--tile);
		border: 2px solid var(--mark);
	}

	.running.offline .step {
		color: var(--muted);
	}

	.running.offline .tile {
		background: none;
		border: 1.5px solid var(--mark);
	}

	@container (max-width: 400px) {
		.row {
			--tree-cell: 14px;
			--number: 26px;
			--step: 56px;
		}

		.row:not(.head) .word {
			display: none;
		}
	}
</style>
