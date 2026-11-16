<script lang="ts">
	import { type Task, TaskState } from '#lib/api/types.ts';
	import { live } from '#lib/live.svelte.ts';
	import { type DiffLine, LineKind, Side } from '#lib/plan-diff.ts';
	import { rowStep } from '#lib/steps.ts';
	import TreeCells from './TreeCells.svelte';

	let {
		line,
		side,
		task,
		note = null,
		link = null
	}: { line: DiffLine | null; side: Side; task?: Task; note?: string | null; link?: string | null } = $props();

	const SIGNS: Record<LineKind, { sign: string; name: string }> = {
		[LineKind.Same]: { sign: '', name: 'unchanged' },
		[LineKind.Added]: { sign: '+', name: 'added' },
		[LineKind.Removed]: { sign: '−', name: 'removed' }
	};
	const state = $derived(task?.state ?? TaskState.Todo);
	const step = $derived(task ? rowStep(task, live.now) : { word: 'waiting', time: '' });
	const hidden = $derived(side === Side.Left && line?.kind === LineKind.Same);
</script>

{#if line}
	<div class="line {side} {line.kind} {state}" aria-hidden={hidden ? 'true' : undefined}>
		<span class="number">{line.number}</span>
		{#if line.kind === LineKind.Same}
			<span class="sign"></span>
		{:else}
			<span class="sign" role="img" aria-label={SIGNS[line.kind].name}>{SIGNS[line.kind].sign}</span>
		{/if}
		<span class="graph" aria-hidden="true">
			<TreeCells cells={line.cells} />
			<span class="node-cell" class:line-above={line.lineAbove} class:line-below={line.lineBelow}><span class="node"></span></span>
		</span>
		<span class="text">
			<span class="id">{line.node.ref}</span>
			<span class="words">
				{#each line.title as part, index (index)}{#if index > 0}{' '}{/if}{#if !part.changed}{part.text}{:else if line.kind === LineKind.Removed}<del>{part.text}</del>{:else}<ins>{part.text}</ins>{/if}{/each}
				{#if link}{' '}<a class="note" href={link}>{note}</a>{:else if note}{' '}<span class="note">{note}</span>{/if}
			</span>
		</span>
		<span class="step">
			<span class="tile" aria-hidden="true"></span>
			<span class="word">{step.word}</span>
			{#if step.time}<span>{step.time}</span>{/if}
		</span>
	</div>
{:else}
	<div class="line {side} empty" aria-hidden="true"></div>
{/if}

<style>
	.line {
		display: grid;
		grid-template-columns: var(--number) var(--sign) calc(var(--tree-cell) * var(--depth)) minmax(0, 1fr) var(--step);
		min-height: 30px;
		min-width: 0;
	}

	.line.added {
		background: var(--diff-add);
	}

	.line.removed {
		background: var(--diff-remove);
	}

	.line.empty {
		display: none;
		background: repeating-linear-gradient(135deg, transparent 0 6px, var(--line) 6px 7px), var(--tile);
	}

	.line.left.same {
		display: none;
	}

	.number {
		padding: 4px 4px 0 0;
		text-align: right;
		font-size: 12px;
		color: var(--muted-soft);
		user-select: none;
	}

	.sign {
		padding-top: 4px;
		text-align: center;
		font-weight: 600;
		user-select: none;
	}

	.added .number,
	.added .sign {
		color: var(--diff-add-ink);
	}

	.removed .number,
	.removed .sign {
		color: var(--diff-remove-ink);
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

	.text {
		display: flex;
		align-items: flex-start;
		gap: 0 2ch;
		min-width: 0;
		padding: 4px 10px 4px 6px;
	}

	.id {
		flex: none;
		font-variant-numeric: tabular-nums;
		color: var(--muted);
		white-space: nowrap;
	}

	.words {
		flex: 1;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.same.done .words {
		color: var(--muted-soft);
	}

	.note {
		font-style: italic;
		color: var(--muted);
	}

	a.note {
		white-space: nowrap;
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--mark);
		text-underline-offset: 3px;
	}

	ins,
	del {
		text-decoration: none;
		border-radius: 3px;
		padding: 0 1px;
	}

	ins {
		background: var(--diff-add-word);
	}

	del {
		background: var(--diff-remove-word);
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

	.done .node,
	.done .tile {
		background: var(--mark-done);
		border-color: var(--mark-done);
	}

	.running .node,
	.running .tile {
		background: var(--running);
		border-color: var(--running);
	}

	.running .step {
		font-weight: 600;
		color: var(--running);
	}

	.asking .node {
		border: 2px solid var(--ink);
	}

	.asking .tile {
		border: 1.5px solid var(--ink);
	}

	.asking .step {
		font-weight: 600;
		color: var(--ink);
	}

	@container diff (min-width: 600px) {
		.line.empty,
		.line.left.same {
			display: grid;
		}

	}

	@container diff (max-width: 999px) {
		.line {
			--tree-cell: 14px;
			--number: 28px;
			--step: 52px;
		}

		.text {
			gap: 0 1ch;
			padding-left: 4px;
		}

		.word {
			display: none;
		}
	}
	@container single (max-width: 499px) {
		.line {
			--tree-cell: 14px;
			--number: 28px;
			--step: 52px;
		}

		.text {
			gap: 0 1ch;
			padding-left: 4px;
		}

		.word {
			display: none;
		}
	}
</style>
