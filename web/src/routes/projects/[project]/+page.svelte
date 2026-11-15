<script lang="ts">
	import { live, wide } from '#lib/live.svelte.ts';
	import Desk from '#lib/views/Desk.svelte';
	import Missing from '#lib/views/Missing.svelte';
	import ProjectPhone from '#lib/views/ProjectPhone.svelte';
	import { page } from '$app/state';

	const project = $derived(live.project(page.params.project ?? ''));
</script>

{#if !project}
	<Missing what="Project {page.params.project}" back="/projects" label="Back to projects" />
{:else if wide.value}
	<Desk {project} laneId={null} />
{:else}
	<ProjectPhone {project} />
{/if}
