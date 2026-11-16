<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import type { Question } from '#lib/api/types.ts';
	import { minutesBetween, waitTime } from '#lib/format.ts';
	import { live } from '#lib/live.svelte.ts';
	import { splitSource } from '#lib/plan-diff.ts';
	import LaneDiff from './LaneDiff.svelte';
	import NewLane from './NewLane.svelte';

	let {
		projectId,
		question,
		heading = 'h1',
		onclose
	}: { projectId: string; question: Question; heading?: 'h1' | 'h2'; onclose?: () => void } = $props();

	const change = $derived(question.change);
	const trees = $derived(change?.trees ?? []);
	const changed = $derived(trees.filter((tree) => !tree.isNew));
	const created = $derived(trees.filter((tree) => tree.isNew));
</script>

{#if change}
	<article class="plan">
		<header class="band">
			<div class="top">
				<div class="names">
					<p class="card-head">Plan change · {question.id}</p>
					<svelte:element this={heading} class="subject">{question.topic}</svelte:element>
				</div>
				{#if onclose}<button type="button" class="icon-button close" aria-label="Close" onclick={onclose}><X size={20} /></button>{/if}
			</div>
			<p class="label muted">
				From the planner · {waitTime(minutesBetween(question.openedAt, live.now))}
			</p>
		</header>

		<div class="plan-body">
			<p class="reason">{change.reason}</p>

			{#if changed.length > 0}
				<p class="section label">Lane diff</p>
				{#each changed as tree (tree.lane)}
					<LaneDiff {projectId} {tree} {trees} />
				{/each}
			{/if}

			{#each created as tree (tree.lane)}
				<div class="new-lane"><NewLane {tree} source={splitSource(trees, tree)} /></div>
			{/each}

			<p class="answer">Answer in the planner chat with the id, for example <span class="mono strong">{question.id} ok</span>.</p>
		</div>
	</article>
{/if}

<style>
	.plan {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.plan-body {
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 2px;
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

	.names {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.close {
		margin-right: -12px;
	}

	.strong {
		font-weight: 600;
		color: var(--ink);
	}

	.reason,
	.answer {
		color: var(--ink-soft);
	}

	.section {
		margin-top: 4px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}

	@container (min-width: 600px) {
		.new-lane {
			margin-left: calc(50% + 6px);
		}
	}

	.answer {
		margin-top: 4px;
		padding-top: 16px;
		border-top: 1px solid var(--line);
	}
</style>
