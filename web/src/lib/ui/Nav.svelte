<script lang="ts">
	import House from '@lucide/svelte/icons/house';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { Theme, theme } from '#lib/theme.svelte.ts';
	import { homeUrl } from '#lib/views/links.ts';
	import { page } from '$app/state';

	const home = $derived(page.url.pathname === homeUrl);
</script>

<nav aria-label="Main">
	<a href="/" aria-current={home ? 'page' : undefined}><House size={22} aria-hidden="true" />Home</a>
	<a href="/projects" aria-current={home ? undefined : 'page'}><LayoutGrid size={22} aria-hidden="true" />Projects</a>
	<span class="divider" aria-hidden="true"></span>
	<button type="button" class="theme" aria-label={theme.value === Theme.Dark ? 'Light theme' : 'Dark theme'} onclick={() => theme.toggle()}>
		{#if theme.value === Theme.Dark}<Sun size={22} aria-hidden="true" />{:else}<Moon size={22} aria-hidden="true" />{/if}
	</button>
</nav>

<style>
	nav {
		position: fixed;
		left: 50%;
		bottom: calc(24px + env(safe-area-inset-bottom));
		z-index: 2;
		translate: -50% 0;
		display: grid;
		grid-template-columns: 106px 106px 1px 56px;
		gap: 4px;
		padding: 4px;
		border-radius: 999px;
		background: var(--tile);
		border: 1px solid var(--line);
		box-shadow: var(--shadow-nav);
		view-transition-name: nav;
	}

	a,
	.theme {
		height: 56px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		border-radius: 999px;
		font-size: 12px;
		line-height: 16px;
		font-weight: 600;
		color: var(--muted);
	}

	.theme {
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}

	.theme:hover {
		color: var(--ink);
	}

	.divider {
		margin-block: 12px;
		background: var(--line-strong);
	}

	a[aria-current='page'] {
		color: var(--ink);
		background: var(--raised);
		border: 1.5px solid var(--ink);
	}
</style>
