<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Snippet } from 'svelte';
	import { back } from '#lib/nav.svelte.ts';

	let { href, label, children }: { href: string; label: string; children: Snippet } = $props();
</script>

<header class="back-header">
	<a
		class="icon-button"
		{href}
		aria-label={label}
		onclick={(event) => {
			event.preventDefault();
			back(href);
		}}
	><ChevronLeft size={20} /></a>
	{@render children()}
</header>

<style>
	.back-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 20px 16px 12px 8px;
	}
</style>
