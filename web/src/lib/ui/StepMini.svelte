<script lang="ts">
	import type { StepName, StepRun, Task } from '#lib/api/types.ts';
	import { stepTime } from '#lib/format.ts';
	import { live } from '#lib/live.svelte.ts';
	import { currentStep, runMinutes } from '#lib/model.ts';
	import { currentMark, iconColor, StepMark, statusWords } from '#lib/steps.ts';
	import StepIcon from './StepIcon.svelte';

	let { task, steps, offline }: { task: Task; steps: StepName[]; offline: boolean } = $props();

	const run = $derived(currentStep(task));
	const at = $derived(run ? steps.indexOf(run.step) : -1);
	const mark = $derived(currentMark(task, offline));
	const stepLabel = (step: StepRun) =>
		`${step.step} ${runMinutes(step, live.now)} min${step === run ? statusWords(mark) : ''}`;
	const label = $derived(`Steps: ${task.steps.map(stepLabel).join(', ')}`);
</script>

{#if run}
	<span class="steps" role="img" aria-label={label}>
		<span class="tile {mark}">
			<StepIcon step={run.step} size={12} width={2.2} color={iconColor(mark)} />
		</span>
		<span class="side">
			<span class="label time {mark}">{stepTime(runMinutes(run, live.now))}</span>
			<span class="dots">
				{#each steps as step, index (step)}
					<span class="dot" class:done={index < at} class:now={index === at} class:asking={index === at && mark === StepMark.Asking} class:offline={index === at && mark === StepMark.Offline}></span>
				{/each}
			</span>
		</span>
	</span>
{/if}

<style>
	.steps {
		flex: none;
		display: flex;
		align-items: center;
		gap: 8px;
		padding-left: 8px;
	}

	.tile {
		width: 22px;
		height: 22px;
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
	}

	.tile.running {
		background: var(--running);
	}

	.tile.asking {
		background: var(--tile);
		box-shadow: inset 0 0 0 1.5px var(--ink);
	}

	.tile.offline {
		box-shadow: inset 0 0 0 1.5px var(--mark);
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.time {
		white-space: nowrap;
		font-weight: 600;
	}

	.time.running {
		color: var(--running);
	}

	.time.offline {
		color: var(--muted);
	}

	.dots {
		display: flex;
		gap: 3px;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 2px;
		box-shadow: inset 0 0 0 1px var(--mark);
	}

	.dot.done {
		background: var(--mark-done);
		box-shadow: none;
	}

	.dot.now {
		background: var(--running);
		box-shadow: none;
	}

	.dot.now.asking {
		background: none;
		box-shadow: inset 0 0 0 1.5px var(--ink);
	}

	.dot.now.offline {
		background: var(--mark);
	}
</style>
