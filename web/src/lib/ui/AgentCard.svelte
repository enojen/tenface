<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Copy from '@lucide/svelte/icons/copy';
	import Info from '@lucide/svelte/icons/info';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import type { Snippet } from 'svelte';
	import { api } from '#lib/api/index.ts';
	import { type Agent, AgentRole, type AgentSource, type AgentSummary, type Question } from '#lib/api/types.ts';
	import { clock, minutesBetween, waitTime } from '#lib/format.ts';
	import { live } from '#lib/live.svelte.ts';
	import { LoadState, loadFor } from '#lib/load.svelte.ts';
	import AgentRing from './AgentRing.svelte';
	import CopyText from './CopyText.svelte';
	import LoadFailed from './LoadFailed.svelte';
	import Pager from './Pager.svelte';
	import Skeleton, { SkeletonKind } from './Skeleton.svelte';

	let {
		agent,
		source,
		owner,
		questionHref
	}: { agent: AgentSummary; source: AgentSource; owner: string; questionHref: (question: Question) => string } = $props();

	const PAGE = 3;
	const role = $derived(agent.role === AgentRole.Planner ? 'Planner' : 'Babysitter');
	const percent = $derived(Math.round((agent.context.used / agent.context.limit) * 100));
	const thousands = (tokens: number) => `${Math.round(tokens / 1000)}k`;

	const detail = loadFor(
		() => `agent/${source.project}/${source.lane ?? ''}`,
		(signal) => api.agent(source, signal)
	);
	const oldest = $derived(
		[...(detail.value?.questions ?? [])].sort((a, b) => a.openedAt.localeCompare(b.openedAt))
	);

	let notes = $state(false);
	let page = $state(0);
	const shown = $derived(oldest.slice(page * PAGE, page * PAGE + PAGE));
</script>

{#snippet loaded(render: Snippet<[Agent]>)}
	{#if detail.value}
		{@render render(detail.value)}
	{:else if detail.state === LoadState.Failed}
		<LoadFailed what="the {role.toLowerCase()}" onretry={() => detail.retry()} />
	{:else}
		<Skeleton kind={SkeletonKind.Card} label="Loading the {role.toLowerCase()}" rows={2} />
	{/if}
{/snippet}

{#snippet noteList(full: Agent)}
	{#if full.notes.length === 0}
		<p class="label muted">No notes yet.</p>
	{:else}
		<ol class="notes">
			{#each full.notes as note}
				<li>
					<span class="label muted">{clock(note.at, live.now)}</span>
					<span class="label"><strong>{note.kind}</strong><span>{note.text}</span></span>
				</li>
			{/each}
		</ol>
	{/if}
{/snippet}

{#snippet needsAndActions(full: Agent)}
	{#if full.questions.length > 0}
		<section class="needs" aria-label="Needs you">
			<div class="qrow head" aria-hidden="true">
				<span class="number">#</span><span>needs you</span><span>id</span><span class="wait">waiting</span>
			</div>
			<ol>
				{#each shown as question, index (question.id)}
					<li class="qrow">
						<span class="number" aria-hidden="true">{page * PAGE + index + 1}</span>
						<span class="question">
							{#if question.change}
								<a class="topic" href={questionHref(question)}>{question.topic}</a>
							{:else}
								<span class="topic">{question.topic}</span>
							{/if}
							<span class="sub">{question.task ?? `lane ${question.lane}`}</span>
						</span>
						<span class="id-cell">
							<CopyText class="copy-id" quiet text={question.id} label="Copy {question.id}" done="{question.id} copied, paste it in the chat">
								{#snippet children(copied)}
									{question.id}{#if copied}<Check size={12} aria-hidden="true" />{:else}<Copy size={12} aria-hidden="true" />{/if}
								{/snippet}
							</CopyText>
						</span>
						<span class="wait">{waitTime(minutesBetween(question.openedAt, live.now))}</span>
					</li>
				{/each}
			</ol>
			{#if oldest.length > PAGE}
				<div class="pages"><Pager bind:page size={PAGE} total={oldest.length} noun="questions" /></div>
			{/if}
		</section>
	{/if}

	<div class="actions">
		<a class="button" href={full.chatUrl} target="_blank" rel="noreferrer"><MessageSquare size={16} aria-hidden="true" />Chat</a>
		<CopyText class="button" text={full.handoverPrompt} label="Copy handover prompt" done="Handover prompt copied">
			{#snippet children(copied)}
				{#if copied}<Check size={16} aria-hidden="true" />Copied{:else}<Copy size={16} aria-hidden="true" />Copy handover prompt{/if}
			{/snippet}
		</CopyText>
	</div>
{/snippet}

{#if notes}
	<div class="head notes-head band">
		<button type="button" class="icon-button back" aria-label="Back to the {role.toLowerCase()}" onclick={() => (notes = false)}>
			<ChevronLeft size={20} />
		</button>
		<h3 class="card-head">Notes · {role} · {owner}</h3>
	</div>
	{@render loaded(noteList)}
{:else}
	<div class="head band">
		<AgentRing {agent} size={40} count={false} />
		<span class="who">
			<h3 class="card-head">{role} · {owner}</h3>
			<span class="label strong">Context {percent}% · {thousands(agent.context.used)} / {thousands(agent.context.limit)}</span>
		</span>
		<button type="button" class="icon-button info" aria-label="Notes of the {role.toLowerCase()}" onclick={() => (notes = true)}>
			<Info size={20} />
		</button>
	</div>

	{@render loaded(needsAndActions)}
{/if}

<style>
	.head {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.notes-head {
		gap: 2px;
	}

	.back {
		margin-left: -12px;
	}

	.who {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.strong {
		font-weight: 600;
	}

	.info {
		margin: -6px -10px -6px 0;
	}

	.needs {
		display: flex;
		flex-direction: column;
		margin: -10px calc(-1 * var(--band-pad)) 0;
		font-size: 13px;
		line-height: 22px;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.qrow {
		display: grid;
		grid-template-columns: 28px minmax(0, 1fr) 56px 64px;
		min-height: 30px;
	}

	.qrow > span {
		padding-block: 4px;
	}

	.qrow.head {
		min-height: 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--muted);
		background: var(--raised);
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line-strong);
	}

	.qrow.head > span {
		padding-block: 4px;
	}

	li.qrow + li.qrow {
		border-top: 1px solid var(--line);
	}

	.number {
		padding-right: 8px;
		text-align: right;
		font-size: 12px;
		color: var(--muted-soft);
		user-select: none;
	}

	.question {
		min-width: 0;
		display: flex;
		flex-direction: column;
		padding-inline: 4px 8px;
		overflow-wrap: anywhere;
	}

	a.topic {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--mark);
		text-underline-offset: 3px;
	}

	.sub {
		font-size: 12px;
		line-height: 16px;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	.wait {
		padding-right: var(--band-pad);
		text-align: right;
		font-size: 12px;
		color: var(--muted);
		white-space: nowrap;
	}

	.needs :global(.copy-id) {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		padding: 0;
		border: 0;
		border-radius: 4px;
		background: none;
		color: var(--ink);
		font: inherit;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		cursor: pointer;
		transition: background-color 160ms ease, color 160ms ease;
	}

	.needs :global(.copy-id:hover) {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.pages {
		padding: 0 var(--band-pad);
		border-top: 1px solid var(--line);
	}

	.actions :global(.button.copied) {
		background: var(--ink);
		color: var(--ground);
		border-color: var(--ink);
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.notes li {
		display: grid;
		grid-template-columns: 36px 1fr;
		gap: 8px;
		padding: 8px 0;
		border-top: 1px solid var(--raised);
	}

	.notes li > span:last-child {
		display: flex;
		flex-direction: column;
		gap: 2px;
		color: var(--ink-soft);
	}

	.notes strong {
		color: var(--ink);
		font-weight: 600;
	}
</style>
