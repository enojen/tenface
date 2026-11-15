<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { ToastMark, toast } from '#lib/toast.svelte.ts';

	let element = $state<HTMLElement>();

	$effect(() => {
		if (!element) return;
		toast.shown;
		if (toast.text) {
			if (element.matches(':popover-open')) element.hidePopover();
			element.showPopover();
		} else if (element.matches(':popover-open')) {
			element.hidePopover();
		}
	});
</script>

<div bind:this={element} popover="manual" class="toast" role="status">
	{#if toast.mark === ToastMark.Done}<Check size={16} aria-hidden="true" />{/if}{toast.text}
</div>

<style>
	.toast {
		position: fixed;
		inset: auto 0 calc(112px + env(safe-area-inset-bottom)) 0;
		width: max-content;
		max-width: calc(100vw - 32px);
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 16px;
		border: none;
		border-radius: 999px;
		background: var(--ink);
		color: var(--ground);
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
		box-shadow: var(--shadow-card);
		opacity: 1;
		translate: 0 0;
		transition:
			opacity 180ms ease,
			translate 180ms ease,
			display 180ms allow-discrete,
			overlay 180ms allow-discrete;
	}

	.toast:not(:popover-open) {
		opacity: 0;
		translate: 0 8px;
	}

	@starting-style {
		.toast:popover-open {
			opacity: 0;
			translate: 0 8px;
		}
	}
</style>
