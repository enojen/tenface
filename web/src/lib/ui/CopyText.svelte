<script lang="ts">
	import type { Snippet } from 'svelte';
	import { toast } from '#lib/toast.svelte.ts';

	let {
		text,
		label,
		done,
		class: className = '',
		children
	}: { text: string; label: string; done: string; class?: string; children: Snippet<[boolean]> } = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			toast.show('Could not copy');
			return;
		}
		copied = true;
		toast.show(done);
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1800);
	}
</script>

<button type="button" class={className} class:copied aria-label={label} onclick={copy}>{@render children(copied)}</button>
