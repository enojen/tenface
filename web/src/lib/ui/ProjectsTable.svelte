<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { Project } from '#lib/api/types.ts';
	import { askers, askersLabel, laneTrio } from '#lib/model.ts';
	import BotHead from './BotHead.svelte';
	import Pager from './Pager.svelte';
	import SearchField from './SearchField.svelte';
	import Trio from './Trio.svelte';

	let { projects, size = 5 }: { projects: Project[]; size?: number } = $props();

	let query = $state('');
	let page = $state(0);
	const found = $derived(projects.filter((project) => project.name.includes(query.trim().toLowerCase())));
	const shown = $derived(found.slice(page * size, page * size + size));
	$effect(() => {
		query;
		page = 0;
	});
</script>

<section class="table" aria-label="Projects" style:--columns="1fr 120px 72px 16px">
	<SearchField bind:value={query} label="Search projects" />
	<div class="table-head" aria-hidden="true">
		<span>Project</span><span class="center">Lanes</span><span class="center">Needs you</span><span></span>
	</div>
	<ul>
		{#each shown as project (project.id)}
			{@const ask = askers(project)}
			{@const lanes = laneTrio(project.lanes)}
			<li>
				<a class="table-row" href="/projects/{project.id}">
					<span class="title name">{project.name}<span class="sr-only">,</span></span>
					<span class="center"><Trio trio={lanes} noun="lanes: " /></span>
					<span class="center heads">
						<span class="sr-only">, {askersLabel(ask.planner, ask.babysitters)}</span>
						{#if ask.planner > 0}<BotHead letter="P" />{/if}
						{#if ask.babysitters > 0}<BotHead letter="B" />{/if}
					</span>
					<ChevronRight size={16} class="chevron" aria-hidden="true" />
				</a>
			</li>
		{:else}
			<li class="table-row label muted">No project matches “{query}”.</li>
		{/each}
	</ul>
	<Pager bind:page {size} total={found.length} noun="projects" />
</section>

<style>
	.name {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.heads {
		gap: 4px;
	}

	.table :global(.chevron) {
		color: var(--muted);
	}
</style>
