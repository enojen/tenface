<script lang="ts">
	import { untrack } from 'svelte';
	import { type Agent, AgentRole, type AgentSource, type Question } from '#lib/api/types.ts';
	import { rememberCard } from '#lib/nav.svelte.ts';
	import { page } from '$app/state';
	import AgentCard from './AgentCard.svelte';
	import AgentRing from './AgentRing.svelte';

	let {
		agent,
		source,
		owner,
		questionHref,
		align = 'left'
	}: {
		agent: Agent;
		source: AgentSource;
		owner: string;
		questionHref: (question: Question) => string;
		align?: 'left' | 'right';
	} = $props();

	let open = $state(untrack(() => page.state.agent === agent.role));

	$effect(() => {
		if (open) rememberCard(agent.role);
		else if (page.state.agent === agent.role) rememberCard(undefined);
	});
	let root = $state<HTMLElement>();
	let ring = $state<HTMLButtonElement>();
	const id = $props.id();
	const role = $derived(agent.role === AgentRole.Planner ? 'Planner' : 'Babysitter');
	const percent = $derived(Math.round((agent.context.used / agent.context.limit) * 100));
	const count = $derived(agent.questions.length);

	function closeOnEscape(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !open) return;
		open = false;
		if (root?.contains(document.activeElement)) ring?.focus();
	}

	function outside(event: PointerEvent) {
		if (open && root && !root.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window onpointerdown={outside} onkeydown={closeOnEscape} />

<div bind:this={root} class="agent">
	<button
		bind:this={ring}
		type="button"
		class="ring-button agent-button"
		aria-label="{role} of {owner}, context {percent} percent, {count} open {count === 1 ? 'question' : 'questions'}, {agent.working ? 'working' : 'waiting'}. {open ? 'Close' : 'Open'} its card"
		aria-expanded={open}
		aria-controls={id}
		onclick={() => (open = !open)}
	>
		<AgentRing {agent} size={48} />
	</button>
	{#if open}
		<section {id} class="card {align}" aria-label="{role} of {owner}">
			<AgentCard {agent} {source} {owner} {questionHref} />
		</section>
	{/if}
</div>

<style>
	.ring-button {
		width: 48px;
		height: 48px;
		padding: 0;
		border: none;
		border-radius: 999px;
		background: none;
		cursor: pointer;
	}

	.agent {
		position: relative;
		flex: none;
	}

	.card {
		position: absolute;
		z-index: 2;
		top: 56px;
		width: min(380px, calc(100vw - 32px));
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px;
		border-radius: 18px;
		background: var(--tile);
		border: 1px solid var(--line-strong);
		box-shadow: var(--shadow-card);
	}

	.left {
		left: 0;
	}

	.right {
		right: 0;
	}
</style>
