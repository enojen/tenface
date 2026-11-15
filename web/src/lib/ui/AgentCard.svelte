<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Info from '@lucide/svelte/icons/info';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import type { Agent, Question } from '#lib/api/types.ts';
	import { clock, minutesBetween, waitTime } from '#lib/format.ts';
	import { live } from '#lib/live.svelte.ts';
	import AgentRing from './AgentRing.svelte';
	import CopyText from './CopyText.svelte';
	import Pager from './Pager.svelte';

	let {
		agent,
		owner,
		questionHref
	}: { agent: Agent; owner: string; questionHref: (question: Question) => string } = $props();

	const PAGE = 3;
	const role = $derived(agent.role === 'planner' ? 'Planner' : 'Babysitter');
	const percent = $derived(Math.round((agent.context.used / agent.context.limit) * 100));
	const thousands = (tokens: number) => `${Math.round(tokens / 1000)}k`;
	const oldest = $derived([...agent.questions].sort((a, b) => a.openedAt.localeCompare(b.openedAt)));

	let notes = $state(false);
	let page = $state(0);
	const shown = $derived(oldest.slice(page * PAGE, page * PAGE + PAGE));
</script>

{#if notes}
	<div class="head notes-head">
		<button class="icon-button back" aria-label="Back to the {role.toLowerCase()}" onclick={() => (notes = false)}>
			<ChevronLeft size={20} />
		</button>
		<h3 class="title">Notes · {role.toLowerCase()} · {owner}</h3>
	</div>
	{#if agent.notes.length === 0}
		<p class="label muted">No notes yet.</p>
	{:else}
		<ol class="notes">
			{#each agent.notes as note (note.at + note.text)}
				<li>
					<span class="label muted">{clock(note.at, live.now)}</span>
					<span class="label"><strong>{note.kind}</strong><span>{note.text}</span></span>
				</li>
			{/each}
		</ol>
	{/if}
{:else}
	<div class="head">
		<AgentRing {agent} size={40} count={false} />
		<span class="who">
			<h3 class="title">{role} <span class="owner">· {owner}</span></h3>
			<span class="label strong">Context {percent}% · {thousands(agent.context.used)} / {thousands(agent.context.limit)}</span>
		</span>
		<button class="icon-button info" aria-label="Notes of the {role.toLowerCase()}" onclick={() => (notes = true)}>
			<Info size={20} />
		</button>
	</div>

	{#if agent.questions.length > 0}
		<section class="needs" aria-label="Needs you">
			<h4>Needs you</h4>
			<div class="table-head" aria-hidden="true" style:--columns="1fr 72px 64px">
				<span>Question</span><span class="center">ID</span><span class="center">Waiting</span>
			</div>
			<ol>
				{#each shown as question (question.id)}
					<li class="table-row" style:--columns="1fr 72px 64px">
						<span class="question">
							{#if question.change}
								<a class="title" href={questionHref(question)}>{question.topic}</a>
							{:else}
								<span class="title">{question.topic}</span>
							{/if}
							<span class="label muted" class:mono={question.task}>{question.task ?? `lane ${question.lane}`}</span>
						</span>
						<span class="center">
							<CopyText class="copy-id" text={question.id} label="Copy {question.id}" done="{question.id} copied, paste it in the chat">
								{#snippet children(copied)}
									{question.id}{#if copied}<Check size={14} aria-hidden="true" />{:else}<Copy size={14} aria-hidden="true" />{/if}
								{/snippet}
							</CopyText>
						</span>
						<span class="center label muted">{waitTime(minutesBetween(question.openedAt, live.now))}</span>
					</li>
				{/each}
			</ol>
			<Pager bind:page size={PAGE} total={oldest.length} noun="questions" />
		</section>
	{/if}

	<div class="actions">
		<a class="button" href={agent.chatUrl} target="_blank" rel="noreferrer"><MessageSquare size={16} aria-hidden="true" />Chat</a>
		<CopyText class="button" text={agent.handoverPrompt} label="Copy handover prompt" done="Handover prompt copied">
			{#snippet children(copied)}
				{#if copied}<Check size={16} aria-hidden="true" />Copied{:else}<Copy size={16} aria-hidden="true" />Copy handover prompt{/if}
			{/snippet}
		</CopyText>
	</div>
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

	.owner {
		font-weight: 400;
		color: var(--muted);
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
	}

	h4 {
		margin: 0;
		padding: 0 4px 8px;
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
	}

	ol {
		list-style: none;
		margin: 4px 0 0;
		padding: 0;
	}

	.question {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow-wrap: anywhere;
	}

	a.title {
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	.question .mono {
		font-weight: 500;
	}

	.needs :global(.copy-id) {
		height: 36px;
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0 8px;
		border-radius: 999px;
		border: 1px solid var(--mark);
		background: none;
		font-family: var(--mono);
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 160ms ease, color 160ms ease;
	}

	.needs :global(.copy-id.copied),
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
