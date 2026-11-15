<script lang="ts">
	import { page } from '$app/state';
	import { live } from '#lib/live.svelte.ts';
	import { findLane } from '#lib/model.ts';
	import LanePhone from '#lib/views/LanePhone.svelte';
	import { projectUrl } from '#lib/views/links.ts';
	import Missing from '#lib/views/Missing.svelte';

	const project = $derived(live.project(page.params.project ?? ''));
	const lane = $derived(project ? findLane(project, page.params.lane ?? '') : undefined);
	const taskId = $derived(page.url.searchParams.get('task'));
</script>

{#if !project}
	<Missing what="Project {page.params.project}" back="/projects" label="Back to projects" />
{:else if !lane}
	<Missing what="Lane {page.params.lane}" back={projectUrl(project.id)} label="Back to {project.name}" />
{:else}
	<LanePhone {project} {lane} {taskId} />
{/if}
