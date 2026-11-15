<script lang="ts">
	import { live } from '#lib/live.svelte.ts';
	import Missing from '#lib/views/Missing.svelte';
	import PlanPhone from '#lib/views/PlanPhone.svelte';
	import { page } from '$app/state';

	const project = $derived(live.project(page.params.project ?? ''));
</script>

{#if !project}
	<Missing what="Project {page.params.project}" back="/projects" label="Back to projects" />
{:else}
	<PlanPhone {project} questionId={page.params.question ?? ''} />
{/if}
