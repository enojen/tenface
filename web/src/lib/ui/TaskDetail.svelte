<script lang="ts">
	import ListChecks from '@lucide/svelte/icons/list-checks';
	import X from '@lucide/svelte/icons/x';
	import { type StepName, type Task, TaskState } from '#lib/api/types.ts';
	import { stepTime } from '#lib/format.ts';
	import { live } from '#lib/live.svelte.ts';
	import { totalMinutes } from '#lib/model.ts';
	import StepSnake from './StepSnake.svelte';

	let {
		task,
		steps,
		onclose,
		heading = 'h2',
		hideClose = false
	}: { task: Task; steps: StepName[]; onclose: () => void; heading?: 'h1' | 'h2'; hideClose?: boolean } = $props();
</script>

<div class="detail">
	<div class="top">
		<svelte:element this={heading} class="headline">{task.title}</svelte:element>
		<button type="button" class="icon-button close" class:hidden-close={hideClose} aria-label="Close" onclick={onclose}><X size={20} /></button>
	</div>

	{#if task.steps.length > 0 || task.state !== TaskState.Todo}
		<div class="steps">
			<span class="label muted head"><span>Steps</span><span>{stepTime(totalMinutes(task, live.now))} total</span></span>
			<StepSnake {task} {steps} />
		</div>
	{/if}

	<div class="links">
		{#if task.pr}
			<a class="button big" href={task.pr.url} target="_blank" rel="noreferrer" aria-label="PR #{task.pr.number} on GitHub">
				<svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" /></svg>
				PR #{task.pr.number}
			</a>
		{/if}
		<a class="button big" href={task.tracker.url} target="_blank" rel="noreferrer">
			<ListChecks size={18} aria-hidden="true" />Tracker <span class="mono">{task.id}</span>
		</a>
	</div>

	{#if task.note}
		<div class="note">
			<h3 class="label muted">Note</h3>
			<p>{task.note}</p>
		</div>
	{/if}
</div>

<style>
	.detail {
		display: flex;
		flex-direction: column;
		gap: 16px;
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

	.close {
		margin-right: -12px;
	}

	.hidden-close:not(:focus-visible) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	.steps {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.head {
		display: flex;
		justify-content: space-between;
	}

	.links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 8px;
	}

	.big {
		height: 48px;
	}

	.note {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.note h3 {
		font-weight: 400;
	}

	.note p {
		color: var(--ink-soft);
		overflow-wrap: anywhere;
	}
</style>
