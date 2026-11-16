<script lang="ts">
	import type { StepName, Task } from '#lib/api/types.ts';
	import { stepTime } from '#lib/format.ts';
	import { live } from '#lib/live.svelte.ts';
	import { totalMinutes } from '#lib/model.ts';
	import { StepMark, stepLabel, stepName, stepRows } from '#lib/steps.ts';
	import StepIcon from './StepIcon.svelte';

	let { task, steps }: { task: Task; steps: StepName[] } = $props();

	const rows = $derived(stepRows(task, steps, live.now));
	const total = $derived(stepTime(totalMinutes(task, live.now)));
</script>

<section class="steps" aria-label="Steps">
	<div class="row head" aria-hidden="true">
		<span class="number">#</span>
		<span></span>
		<span class="step">step</span>
		<span class="started">started</span>
		<span class="time">time</span>
	</div>
	<ol>
		{#each rows as row, index (index)}
			<li class="row {row.mark}" class:first={index === 0} class:last={index === rows.length - 1}>
				<span class="sr-only">{stepLabel(row)}</span>
				<span class="number" aria-hidden="true">{index + 1}</span>
				<span class="graph" aria-hidden="true"><span class="node"></span></span>
				<span class="step" aria-hidden="true">
					<span class="icon"><StepIcon step={row.name} size={14} /></span>
					<span class="name">{stepName(row)}{#if row.mark === StepMark.Unused}{' '}<span class="unused-note">not used</span>{/if}</span>
				</span>
				<span class="started" aria-hidden="true">{row.started ?? ''}</span>
				<span class="time" aria-hidden="true">{row.time ?? ''}</span>
			</li>
		{/each}
	</ol>
	<div class="row total">
		<span></span>
		<span></span>
		<span class="step">total</span>
		<span></span>
		<span class="time">{total}</span>
	</div>
</section>

<style>
	.steps {
		margin: -16px calc(-1 * var(--band-pad, 0px)) 0;
		font-family: var(--sans);
		font-size: 13px;
		line-height: 22px;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.row {
		display: grid;
		grid-template-columns: 34px 22px minmax(0, 1fr) 64px 64px;
		min-height: 30px;
	}

	.row > span {
		padding-top: 4px;
	}

	.row > .sr-only {
		padding: 0;
	}

	.row.head {
		min-height: 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--muted);
		background: var(--raised);
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line-strong);
	}

	.row.head > span {
		padding-block: 2px;
	}

	.number {
		padding-right: 8px;
		text-align: right;
		font-size: 12px;
		color: var(--muted-soft);
		user-select: none;
	}

	.row > .graph {
		position: relative;
		padding: 0;
	}

	.graph::before {
		content: '';
		position: absolute;
		left: 6px;
		top: 0;
		bottom: 0;
		width: 1px;
		background: var(--mark);
	}

	.first .graph::before {
		top: 10px;
	}

	.last .graph::before {
		bottom: auto;
		height: 10px;
	}

	.first.last .graph::before {
		display: none;
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

	.step {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		min-width: 0;
		padding-inline: 10px;
	}

	.icon {
		flex: none;
		display: flex;
		margin-top: 4px;
		color: var(--muted);
	}

	.name {
		min-width: 0;
		overflow-wrap: anywhere;
		font-variant-numeric: tabular-nums;
	}

	.unused-note {
		font-style: italic;
		color: var(--muted);
	}

	.started,
	.time {
		text-align: right;
		font-size: 12px;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.started {
		padding-right: 8px;
	}

	.time {
		padding-right: var(--band-pad, 0px);
	}

	.done .node {
		background: var(--mark-done);
		border-color: var(--mark-done);
	}

	.done .name,
	.done .time {
		color: var(--muted-soft);
	}

	.running .node {
		background: var(--running);
		border-color: var(--running);
	}

	.running .name,
	.running .time,
	.running .icon {
		font-weight: 600;
		color: var(--running);
	}

	.asking .node {
		border: 2px solid var(--ink);
	}

	.asking .name,
	.asking .time,
	.asking .icon {
		font-weight: 600;
		color: var(--ink);
	}

	.later .name {
		color: var(--ink-soft);
	}

	.unused .node {
		background: none;
		border: 1px dashed var(--line-strong);
	}

	.unused .name {
		color: var(--muted-soft);
	}

	.unused .icon {
		color: var(--line-strong);
	}

	.row.total {
		border-top: 1px solid var(--line-strong);
		font-weight: 600;
	}

	.total .step {
		color: var(--ink-soft);
	}

	.total .time {
		color: var(--ink);
	}
</style>
