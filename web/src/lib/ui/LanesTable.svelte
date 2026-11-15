<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { api } from '#lib/api/index.ts';
	import type { Project } from '#lib/api/types.ts';
	import { LoadState, searched, searchFor } from '#lib/load.svelte.ts';
	import BotHead from './BotHead.svelte';
	import LoadFailed from './LoadFailed.svelte';
	import Pager from './Pager.svelte';
	import SearchField from './SearchField.svelte';
	import Skeleton, { SkeletonKind } from './Skeleton.svelte';
	import Trio from './Trio.svelte';

	let {
		project,
		size = 5,
		desk = false,
		picked = null,
		outlined = false
	}: { project: Project; size?: number; desk?: boolean; picked?: string | null; outlined?: boolean } = $props();

	let query = $state('');
	let page = $state(0);
	const hits = searchFor(
		() => query,
		(text, signal) => api.searchLanes(project.id, text, signal)
	);
	const found = $derived(searched(project.lanes, query, hits));
	const shown = $derived(found?.slice(page * size, page * size + size) ?? []);
	const columns = $derived(desk ? '1fr 120px 64px' : '1fr 120px 72px 16px');
	$effect(() => {
		query;
		page = 0;
	});
</script>

<section class="table" aria-labelledby="lanes-title" style:--columns={columns}>
	<h2 id="lanes-title" class="title heading">Lanes</h2>
	<SearchField bind:value={query} label="Search lanes" />
	<div class="table-head" aria-hidden="true">
		<span>Lane</span><span class="center">Tasks</span><span class="center">Needs you</span>{#if !desk}<span></span>{/if}
	</div>
	{#if found === null && hits.state === LoadState.Failed}
		<LoadFailed what="the lanes" onretry={() => hits.retry()} />
	{:else if found === null}
		<Skeleton kind={SkeletonKind.Table} label="Searching lanes" rows={3} />
	{:else}
		<ul>
			{#each shown as lane (lane.id)}
				{@const asks = lane.babysitter.questions}
				{@const here = picked === lane.id}
				<li>
					<a
						class="table-row"
						class:picked={here && !outlined}
						class:outlined={here && outlined}
						href="/projects/{project.id}/lanes/{lane.id}"
						aria-current={here ? 'true' : undefined}
					>
						<span class="title name">{lane.name}<span class="sr-only">,</span></span>
						<span class="center"><Trio trio={lane.trio} noun="tasks: " /></span>
						<span class="center">
							{#if asks > 0}<BotHead letter="B" /><span class="sr-only">, {asks} open {asks === 1 ? 'question' : 'questions'} from the babysitter</span>{/if}
						</span>
						{#if !desk}<ChevronRight size={16} class="chevron" aria-hidden="true" />{/if}
					</a>
				</li>
			{:else}
				<li class="table-row label muted">No lane matches “{query}”.</li>
			{/each}
		</ul>
	{/if}
	<Pager bind:page {size} total={found?.length ?? 0} noun="lanes" />
</section>

<style>
	.heading {
		padding: 0 4px;
	}

	.name {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.table :global(.chevron) {
		color: var(--muted);
	}
</style>
