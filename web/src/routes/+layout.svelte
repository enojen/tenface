<script lang="ts">
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';
	import '../app.css';
	import { live, wide } from '#lib/live.svelte.ts';
	import { NavigationKind, slide, track } from '#lib/nav.svelte.ts';
	import ErrorStrip from '#lib/ui/ErrorStrip.svelte';
	import Nav from '#lib/ui/Nav.svelte';
	import Toast from '#lib/ui/Toast.svelte';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const THEMES = new Set(['light', 'dark']);

	$effect(() => live.start());
	$effect(() => wide.start());
	$effect(() => {
		const theme = page.url.searchParams.get('theme');
		if (theme !== null && THEMES.has(theme)) document.documentElement.dataset.theme = theme;
	});

	afterNavigate(track);
	onNavigate((navigation) => {
		const popstate = navigation.type === NavigationKind.Popstate;
		const backward = slide(navigation.from?.url, navigation.to?.url, popstate, popstate ? navigation.delta : 0);
		if (backward === null || wide.value) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>tenface</title>
	<meta name="color-scheme" content="only light" />
	<meta name="theme-color" content="#e7e1d4" />
</svelte:head>

<ErrorStrip />
<div class="page">
	{#if live.state}
		{@render children()}
	{:else}
		<p class="label muted loading" role="status">Loading…</p>
	{/if}
</div>
<Nav />
<Toast />

<style>
	.page {
		padding-bottom: calc(120px + env(safe-area-inset-bottom));
		view-transition-name: page;
	}

	.loading {
		padding: 24px 16px;
	}

	:global(::view-transition-old(page)),
	:global(::view-transition-new(page)) {
		animation-duration: 260ms;
		animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	:global(::view-transition-old(page)) {
		animation-name: page-out;
	}

	:global(::view-transition-new(page)) {
		animation-name: page-in;
	}

	:global(html[data-slide='back']::view-transition-old(page)) {
		animation-name: page-out-back;
	}

	:global(html[data-slide='back']::view-transition-new(page)) {
		animation-name: page-in-back;
	}

	@keyframes -global-page-in {
		from {
			opacity: 0;
			translate: 48px 0;
		}
	}

	@keyframes -global-page-out {
		to {
			opacity: 0;
			translate: -24px 0;
		}
	}

	@keyframes -global-page-in-back {
		from {
			opacity: 0;
			translate: -48px 0;
		}
	}

	@keyframes -global-page-out-back {
		to {
			opacity: 0;
			translate: 24px 0;
		}
	}
</style>
