<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ToastMark, toast } from '#lib/toast.svelte.ts';

	let {
		text,
		label,
		done,
		class: className = '',
		quiet = false,
		children
	}: {
		text: string;
		label: string;
		done: string;
		class?: string;
		quiet?: boolean;
		children: Snippet<[boolean]>;
	} = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			toast.show('Could not copy', ToastMark.Failed);
			return;
		}
		copied = true;
		if (!quiet) toast.show(done);
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1800);
	}
</script>

<button type="button" class={className} class:copied aria-label={label} onclick={copy}>{@render children(copied)}</button>
{#if quiet}<span class="sr-only" role="status">{copied ? done : ''}</span>{/if}
