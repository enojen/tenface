<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import { back } from '#lib/nav.svelte.ts';

	let { href, label, text = '' }: { href: string; label: string; text?: string } = $props();
</script>

<a
	class="back-link"
	class:icon-button={!text}
	class:with-text={text}
	{href}
	aria-label={label}
	onclick={(event) => {
		event.preventDefault();
		back(href);
	}}
><ChevronLeft size={20} />{text}</a>

<style>
	.with-text {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		min-height: 44px;
		padding: 0 8px 0 0;
		color: var(--ink-soft);
		font-weight: 500;
	}
</style>
