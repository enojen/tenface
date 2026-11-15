<script lang="ts">
	import { live } from '#lib/live.svelte.ts';
	import { findQuestion } from '#lib/model.ts';
	import { projectUrl } from '#lib/views/links.ts';
	import Missing from '#lib/views/Missing.svelte';
	import PlanPhone from '#lib/views/PlanPhone.svelte';
	import { page } from '$app/state';

	const project = $derived(live.project(page.params.project ?? ''));
	const question = $derived(project ? findQuestion(project, page.params.question ?? '') : undefined);
</script>

{#if !project}
	<Missing what="Project {page.params.project}" back="/projects" label="Back to projects" />
{:else if !question?.change}
	<Missing what="Plan change {page.params.question}" back={projectUrl(project.id)} label="Back to {project.name}" />
{:else}
	<PlanPhone {project} {question} />
{/if}
