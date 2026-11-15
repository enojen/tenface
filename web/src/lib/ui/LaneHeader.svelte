<script lang="ts">
	import type { LaneSummary } from '#lib/api/types.ts';
	import Trio from './Trio.svelte';

	let { lane, heading = 'h1' }: { lane: LaneSummary; heading?: 'h1' | 'h2' } = $props();
</script>

<div class="lane-head">
	<svelte:element this={heading} class="headline">{lane.name}</svelte:element>
	<p>{lane.description}</p>
	<Trio trio={lane.trio} noun="tasks: " />
</div>

<style>
	.lane-head {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	p {
		color: var(--ink-soft);
	}
</style>
