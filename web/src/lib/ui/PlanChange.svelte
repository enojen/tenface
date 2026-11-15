<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { type PlanNode, PlanSign, type Question } from '#lib/api/types.ts';
	import { minutesBetween, waitTime } from '#lib/format.ts';
	import { live } from '#lib/live.svelte.ts';
	import { RowKind, treeRows } from '#lib/tree.ts';
	import TreeCells from './TreeCells.svelte';

	let {
		question,
		heading = 'h1',
		onclose
	}: { question: Question; heading?: 'h1' | 'h2'; onclose?: () => void } = $props();

	const SIGN_NAMES: Record<PlanSign, string> = {
		[PlanSign.Added]: 'added',
		[PlanSign.Removed]: 'removed',
		[PlanSign.Moved]: 'moved',
		[PlanSign.Changed]: 'changed'
	};
	const change = $derived(question.change);
</script>

{#snippet tree(roots: PlanNode[], signs: boolean)}
	<ul class="tree">
		{#each treeRows(roots, (node) => node.children) as row, index (index)}
			{#if row.kind === RowKind.Gap}
				<li class="gap" aria-hidden="true">{#if signs}<span class="sign"></span>{/if}<TreeCells cells={row.cells} /></li>
			{:else}
				{@const node = row.item}
				<li class="row">
					{#if signs}
						{#if node.sign}
							<span class="sign mono" role="img" aria-label={SIGN_NAMES[node.sign]}>{node.sign}</span>
						{:else}
							<span class="sign" aria-hidden="true"></span>
						{/if}
					{/if}
					<TreeCells cells={row.cells} />
					<span class="body" class:added={node.sign === PlanSign.Added}>
						<span class="node-cell" class:line-above={row.lineAbove} class:line-below={row.lineBelow}>
							<span class="node" class:removed={node.sign === PlanSign.Removed} class:moved={node.sign === PlanSign.Moved}></span>
						</span>
						<span class="text">
							<span class="label meta" class:mono={!node.note}>{node.note ?? node.ref}</span>
							{#if node.sign === PlanSign.Removed}
								<s class="name faint">{node.title}</s>
							{:else}
								<span class="name" class:soft={!node.sign}>{node.title}</span>
							{/if}
							{#if node.old}<s class="old">{node.old}</s>{/if}
						</span>
					</span>
				</li>
			{/if}
		{/each}
	</ul>
{/snippet}

{#if change}
	<article class="plan">
		<header>
			<div class="top">
				<svelte:element this={heading} class="headline">{question.topic}</svelte:element>
				{#if onclose}<button type="button" class="icon-button close" aria-label="Close" onclick={onclose}><X size={20} /></button>{/if}
			</div>
			<p class="label muted">
				<span class="mono id">{question.id}</span> · from the planner · {waitTime(minutesBetween(question.openedAt, live.now))}
			</p>
		</header>

		<p class="reason">{change.reason}</p>
		<p class="legend label muted">
			{#each Object.entries(SIGN_NAMES) as [sign, name] (sign)}<span><span class="mono strong">{sign}</span> {name}</span>{/each}
		</p>

		{#each change.trees as plan (plan.lane)}
			{#if plan.isNew}
				<section class="new-lane" aria-label="New lane {plan.lane}">
					<h3 class="title"><span class="mono" aria-hidden="true">+</span>New lane {plan.lane}</h3>
					{#if plan.waits}<p class="label muted">{plan.waits}</p>{/if}
					{@render tree(plan.roots, false)}
				</section>
			{:else}
				<section class="lane" aria-label="Lane {plan.lane} after the change">
					<h3 class="label muted strong">Lane {plan.lane} after the change</h3>
					{@render tree(plan.roots, true)}
				</section>
			{/if}
		{/each}

		<p class="answer">Answer in the planner chat with the id, for example <span class="mono strong">{question.id} ok</span>.</p>
	</article>
{/if}

<style>
	.plan {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-bottom: 8px;
	}

	.top {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.top > :global(:first-child) {
		flex: 1;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.close {
		margin-right: -12px;
	}

	.id,
	.strong {
		font-weight: 600;
		color: var(--ink);
	}

	.reason,
	.answer {
		color: var(--ink-soft);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		column-gap: 14px;
		margin-bottom: 8px;
	}

	.lane h3 {
		margin: 0 0 4px 24px;
	}

	.new-lane {
		padding: 12px 12px 4px;
		border-radius: 20px;
		border: 1px solid var(--ink);
	}

	.new-lane h3 {
		display: flex;
		gap: 6px;
	}

	.tree {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.gap {
		display: flex;
		height: 12px;
	}

	.row {
		display: flex;
		align-items: stretch;
		min-height: 64px;
	}

	.sign {
		flex: none;
		width: 16px;
		padding-top: 22px;
		text-align: center;
		font-weight: 600;
	}

	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: stretch;
	}

	.body.added {
		margin: 4px 0;
		border: 1px solid var(--ink);
		border-radius: 12px;
	}

	.node-cell {
		position: relative;
		width: 22px;
		flex: none;
	}

	.added .node-cell {
		margin-left: -1px;
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
		background: var(--mark-empty);
		border: 1px solid var(--mark);
	}

	.added .node {
		top: 19px;
	}

	.node.removed {
		background: var(--ground);
		border-color: var(--line-strong);
	}

	.node.moved {
		background: none;
		border: 1.5px dashed var(--mark);
	}

	.text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
		padding: 12px 12px 12px 8px;
	}

	.meta {
		color: var(--muted);
	}

	.meta.mono {
		font-weight: 500;
	}

	.name {
		font-size: 16px;
		line-height: 22px;
		overflow-wrap: anywhere;
	}

	.soft {
		color: var(--ink-soft);
	}

	.faint,
	.old {
		color: var(--muted-soft);
	}

	.answer {
		margin-top: 12px;
		padding-top: 16px;
		border-top: 1px solid var(--line);
	}
</style>
