<script lang="ts">
	import type { StepName, Task } from '#lib/api/types.ts';
	import { live } from '#lib/live.svelte.ts';
	import { iconColor, placeLabel, reachedIndex, stepPlaces } from '#lib/steps.ts';
	import StepIcon from './StepIcon.svelte';

	let { task, steps }: { task: Task; steps: StepName[] } = $props();

	const reached = $derived(reachedIndex(task));
	const places = $derived(stepPlaces(task, steps, live.now));
	const label = $derived(`Steps: ${places.map(placeLabel).join(', ')}`);
	const dark = (to: number) => (to <= reached ? 'dark' : 'light');
</script>

<span class="snake" role="img" aria-label={label}>
	{#each [0, 1, 2] as k (k)}
		<span class="seg row1 {dark(k + 1)}" style:left="{12.5 + 25 * k}%" aria-hidden="true"></span>
		<span class="seg row2 {dark(k + 5)}" style:left="{12.5 + 25 * k}%" aria-hidden="true"></span>
	{/each}
	<span class="turn right {dark(4)}" aria-hidden="true"></span>
	<span class="cross {dark(4)}" aria-hidden="true"></span>
	<span class="turn left {dark(4)}" aria-hidden="true"></span>
	{#each places as place (place.name)}
		<span class="place {place.mark}">
			<span class="tile">
				<StepIcon step={place.name} color={iconColor(place.mark)} />
			</span>
			<span class="label name">{place.name}</span>
			{#if place.time}<span class="label time">{place.time}</span>{/if}
		</span>
	{/each}
</span>

<style>
	.snake {
		position: relative;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		row-gap: 32px;
		white-space: nowrap;
	}

	.seg,
	.cross {
		position: absolute;
		width: 25%;
		height: 2px;
	}

	.row1 {
		top: 17px;
	}

	.row2 {
		top: 125px;
	}

	.cross {
		top: 91px;
		left: 12.5%;
		width: 75%;
	}

	.turn {
		position: absolute;
		width: 12.5%;
		border: 2px solid;
	}

	.turn.right {
		top: 17px;
		left: 87.5%;
		height: 76px;
		border-left: 0;
		border-radius: 0 12px 12px 0;
	}

	.turn.left {
		top: 91px;
		left: 0;
		height: 36px;
		border-right: 0;
		border-radius: 12px 0 0 12px;
	}

	.dark {
		background-color: var(--mark);
		border-color: var(--mark);
	}

	.light {
		background-color: var(--line);
		border-color: var(--line);
	}

	.turn {
		background: none;
	}

	.cross {
		height: 0;
		border-top: 2px dashed;
		background: none;
	}

	.place {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.tile {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9px;
		background: var(--tile);
		border: 1px solid var(--line);
	}

	.done .tile {
		background: var(--mark-empty);
		border: none;
	}

	.running .tile {
		background: var(--running);
		border: none;
	}

	.asking .tile {
		border: 2px solid var(--ink);
	}

	.unused .tile {
		border: 1.5px dashed var(--line-strong);
	}

	.name {
		color: var(--muted-soft);
	}

	.done .name {
		color: var(--ink-soft);
	}

	.time {
		color: var(--muted);
	}

	.later .time {
		color: var(--muted-soft);
	}

	.asking .name,
	.asking .time,
	.running .name,
	.running .time {
		font-weight: 600;
		color: var(--ink);
	}

	.running .time {
		color: var(--running);
	}
</style>
