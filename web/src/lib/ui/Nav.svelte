<script lang="ts">
	import House from '@lucide/svelte/icons/house';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import { page } from '$app/state';

	const home = $derived(page.url.pathname === '/');
</script>

<nav aria-label="Main">
	<a href="/" aria-current={home ? 'page' : undefined}><House size={22} aria-hidden="true" />Home</a>
	<a href="/projects" aria-current={home ? undefined : 'page'}><LayoutGrid size={22} aria-hidden="true" />Projects</a>
</nav>

<style>
	nav {
		position: fixed;
		left: 50%;
		bottom: calc(24px + env(safe-area-inset-bottom));
		z-index: 2;
		translate: -50% 0;
		width: 220px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
		padding: 4px;
		border-radius: 999px;
		background: var(--tile);
		border: 1px solid var(--line);
		box-shadow: var(--shadow-nav);
		view-transition-name: nav;
	}

	a {
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

	a[aria-current='page'] {
		color: var(--ink);
		background: var(--raised);
		border: 1.5px solid var(--ink);
	}
</style>
