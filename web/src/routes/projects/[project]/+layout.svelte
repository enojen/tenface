<script lang="ts">
	import { live, wide } from '#lib/live.svelte.ts';
	import Desk from '#lib/views/Desk.svelte';
	import { deskView } from '#lib/views/desk-view.ts';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const project = $derived(live.project(page.params.project ?? ''));
	const view = $derived(project && wide.value ? deskView(project, page.params, page.url) : null);
</script>

{#if project && view}
	<Desk {project} laneId={view.laneId} taskId={view.taskId} questionId={view.questionId} />
{:else}
	{@render children()}
{/if}
