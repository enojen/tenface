<script lang="ts">
	import type { Trio } from '#lib/api/types.ts';
	import { trioParts } from '#lib/model.ts';

	let { trio }: { trio: Trio } = $props();

	const parts = $derived(trioParts(trio));
	const total = $derived(trio.done + trio.running + trio.waiting);
	const share = (count: number) => `${total === 0 ? 0 : (count / total) * 100}%`;
</script>

<div class="progress">
	{#if total === 0}
		<p class="label muted">No tasks yet</p>
	{:else}
		<p class="label words">
			{#each parts as part, index (part.state)}{#if index > 0}{' · '}{/if}<span class={part.state}>{part.count} {part.state}</span>{/each}
		</p>
		<span class="bar" aria-hidden="true">
			<span class="fill done" style:width={share(trio.done)}></span>
			<span class="fill running" style:width={share(trio.running)}></span>
		</span>
	{/if}
</div>

<style>
	.progress {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-top: 2px;
	}

	.words {
		margin: 0;
		color: var(--ink-soft);
	}

	.words .running {
		font-weight: 600;
		color: var(--running);
	}

	.words .done {
		color: var(--muted);
	}

	.bar {
		display: flex;
		width: min(220px, 100%);
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--tile);
		box-shadow: inset 0 0 0 1.5px var(--mark);
	}

	.fill.done {
		background: var(--mark-done);
	}

	.fill.running {
		background: var(--running);
	}
</style>
