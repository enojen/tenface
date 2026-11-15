<script lang="ts">
	import type { Agent } from '#lib/api/types.ts';
	import BotHead from './BotHead.svelte';

	let { agent, size, count = true }: { agent: Agent; size: 40 | 48 | 56; count?: boolean } = $props();

	const CIRCUMFERENCE = 2 * Math.PI * 20;
	const share = $derived(Math.min(1, agent.context.used / agent.context.limit));
	const open = $derived(agent.questions.length);
	const wideCard = $derived(open > 9);
</script>

<span class="ring" style:width="{size}px" style:height="{size}px">
	<svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48">
		<circle cx="24" cy="24" r="20" fill="none" stroke="var(--line-strong)" stroke-width="3" />
		<circle
			cx="24"
			cy="24"
			r="20"
			fill="none"
			stroke={agent.working ? 'var(--running)' : 'var(--ink)'}
			stroke-width="3"
			stroke-linecap="round"
			stroke-dasharray="{(share * CIRCUMFERENCE).toFixed(1)} {CIRCUMFERENCE.toFixed(1)}"
			transform="rotate(-90 24 24)"
		/>
		<line x1="38.9" y1="34.9" x2="41.3" y2="36.6" stroke="var(--ink)" stroke-width="2" stroke-linecap="round" />
		{#if count && open > 0}
			<rect x={wideCard ? 31.1 : 32.6} y="2.9" width={wideCard ? 14 : 11} height="14" rx="2.5" fill="var(--tile)" stroke="var(--ground)" stroke-width="3" />
			<rect x={wideCard ? 31.1 : 32.6} y="2.9" width={wideCard ? 14 : 11} height="14" rx="2.5" fill="var(--tile)" stroke="var(--ink)" stroke-width="1.5" />
			<text x="38.1" y="13.1" text-anchor="middle" fill="var(--ink)" font-family="Inter Variable, Inter, system-ui, sans-serif" font-size="9" font-weight="700">{wideCard ? '9+' : open}</text>
		{/if}
	</svg>
	<BotHead letter={agent.role === 'planner' ? 'P' : 'B'} size={size / 2} />
</span>

<style>
	.ring {
		position: relative;
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--tile);
		color: var(--ink);
	}

	svg:first-child {
		position: absolute;
		inset: 0;
	}

	.ring :global(svg + svg) {
		position: relative;
	}
</style>
