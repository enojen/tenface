<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { api } from '#lib/api/index.ts';
	import type { Project } from '#lib/api/types.ts';
	import { LoadState, searched, searchFor } from '#lib/load.svelte.ts';
	import { askers, askersLabel, projectRunning } from '#lib/model.ts';
	import BotHead from './BotHead.svelte';
	import LoadFailed from './LoadFailed.svelte';
	import Pager from './Pager.svelte';
	import SearchField from './SearchField.svelte';
	import Skeleton, { SkeletonKind } from './Skeleton.svelte';

	let { projects, size = 5 }: { projects: Project[]; size?: number } = $props();

	let query = $state('');
	let page = $state(0);
	const hits = searchFor(
		() => 'projects',
		() => query,
		(text, signal) => api.searchProjects(text, signal)
	);
	const found = $derived(searched(projects, query, hits));
	const shown = $derived(found?.slice(page * size, page * size + size) ?? []);
	$effect(() => {
		query;
		page = 0;
	});
</script>

<section class="table" aria-label="Projects" style:--columns="1fr 72px 16px">
	<SearchField bind:value={query} label="Search projects" />
	<div class="table-head" aria-hidden="true">
		<span>Project</span><span class="center">Needs you</span><span></span>
	</div>
	{#if found === null && hits.state === LoadState.Failed}
		<LoadFailed what="the projects" onretry={() => hits.retry()} />
	{:else if found === null}
		<Skeleton kind={SkeletonKind.Table} label="Searching projects" rows={3} />
	{:else}
		<ul>
			{#each shown as project (project.id)}
				{@const ask = askers(project)}
				<li>
					<a class="table-row" href="/projects/{project.id}">
						<span class="name">
							<span class="title">{project.name}</span>
							{#if projectRunning(project.lanes)}<span class="running-note">running</span>{/if}
						</span>
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
	{/if}
	<Pager bind:page {size} total={found?.length ?? 0} noun="projects" />
</section>

<style>
	.name {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow-wrap: anywhere;
	}

	.heads {
		gap: 4px;
	}

	.table :global(.chevron) {
		color: var(--muted);
	}
</style>
