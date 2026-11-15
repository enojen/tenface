<script lang="ts">
	import type { StepName, Task } from '#lib/api/types.ts';
	import TaskDetail from '#lib/ui/TaskDetail.svelte';

	let { task, steps, onclose }: { task: Task; steps: StepName[]; onclose: () => void } = $props();

	let dialog = $state<HTMLDialogElement>();
	let scroller = $state<HTMLElement>();
	let pull = $state(0);
	let leaving = $state(false);
	let start: { y: number; time: number } | null = null;

	$effect(() => {
		if (dialog && !dialog.open) {
			dialog.showModal();
			dialog.focus();
		}
	});

	const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	/** Slides the sheet down, then closes it. */
	function dismiss() {
		if (leaving) return;
		if (reduced()) {
			dialog?.close();
			return;
		}
		leaving = true;
		setTimeout(() => dialog?.close(), 220);
	}

	function touchstart(event: TouchEvent) {
		start = (scroller?.scrollTop ?? 0) <= 0 ? { y: event.touches[0].clientY, time: event.timeStamp } : null;
	}

	function touchmove(event: TouchEvent) {
		if (!start) return;
		const distance = event.touches[0].clientY - start.y;
		if (distance <= 0 && pull === 0) {
			start = null;
			return;
		}
		event.preventDefault();
		pull = Math.max(0, distance);
	}

	function touchend(event: TouchEvent) {
		if (!start) return;
		const speed = pull / Math.max(1, event.timeStamp - start.time);
		start = null;
		if (pull > 120 || (pull > 40 && speed > 0.6)) dismiss();
		else pull = 0;
	}

	$effect(() => {
		if (!dialog) return;
		// Not passive: the pull must stop the page from scrolling.
		dialog.addEventListener('touchstart', touchstart, { passive: true });
		dialog.addEventListener('touchmove', touchmove, { passive: false });
		dialog.addEventListener('touchend', touchend);
		dialog.addEventListener('touchcancel', touchend);
		return () => {
			dialog?.removeEventListener('touchstart', touchstart);
			dialog?.removeEventListener('touchmove', touchmove);
			dialog?.removeEventListener('touchend', touchend);
			dialog?.removeEventListener('touchcancel', touchend);
		};
	});
</script>

<dialog
	bind:this={dialog}
	tabindex="-1"
	aria-label="Task {task.id}"
	class:leaving
	class:pulling={pull > 0}
	style:translate={pull > 0 && !leaving ? `0 ${pull}px` : null}
	oncancel={(event) => {
		event.preventDefault();
		dismiss();
	}}
	onclose={onclose}
	onclick={(event) => event.target === dialog && dismiss()}
>
	<div class="handle" aria-hidden="true"></div>
	<div class="scroll" bind:this={scroller}>
		<TaskDetail {task} {steps} heading="h1" hideClose onclose={dismiss} />
	</div>
</dialog>

<style>
	dialog {
		position: fixed;
		inset: auto 0 0 0;
		width: 100%;
		max-width: 640px;
		max-height: calc(100dvh - 120px);
		margin: 0 auto;
		padding: 0 0 env(safe-area-inset-bottom);
		display: flex;
		flex-direction: column;
		border: none;
		border-top: 1px solid var(--mark-empty);
		border-radius: 32px 32px 0 0;
		background: var(--tile);
		color: inherit;
		box-shadow: var(--shadow-sheet);
		transition: translate 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	dialog[open] {
		animation: sheet-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	dialog.pulling {
		transition: none;
	}

	dialog.leaving {
		translate: 0 100%;
	}

	dialog::backdrop {
		background: var(--dim);
		transition: opacity 220ms ease;
	}

	dialog[open]::backdrop {
		animation: dim-in 280ms ease;
	}

	dialog.leaving::backdrop {
		opacity: 0;
	}

	@keyframes sheet-in {
		from {
			translate: 0 100%;
		}
	}

	@keyframes dim-in {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog[open],
		dialog[open]::backdrop {
			animation: none;
		}
	}

	.handle {
		align-self: center;
		flex: none;
		width: 40px;
		height: 5px;
		margin: 8px 0 4px;
		border-radius: 999px;
		background: var(--line-strong);
	}

	.scroll {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 10px 20px 20px;
	}
</style>
