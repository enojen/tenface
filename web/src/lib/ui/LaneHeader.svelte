<script lang="ts">
	import type { LaneSummary } from '#lib/api/types.ts';
	import LaneProgress from './LaneProgress.svelte';

	let { lane, heading = 'h1' }: { lane: LaneSummary; heading?: 'h1' | 'h2' } = $props();
</script>

<div class="lane-head">
	<svelte:element this={heading} class="card-head"><span aria-hidden="true">Lane ·</span> {lane.name}</svelte:element>
	<p class="subject">{lane.description}</p>
	<LaneProgress trio={lane.trio} />
</div>

<style>
	.lane-head {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
</style>
