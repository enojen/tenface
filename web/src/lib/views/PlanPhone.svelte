<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import { api } from '#lib/api/index.ts';
	import type { Project } from '#lib/api/types.ts';
	import { LoadState, loadFor } from '#lib/load.svelte.ts';
	import { back } from '#lib/nav.svelte.ts';
	import FloatingAgent from '#lib/ui/FloatingAgent.svelte';
	import LoadFailed from '#lib/ui/LoadFailed.svelte';
	import PlanChange from '#lib/ui/PlanChange.svelte';
	import Skeleton, { SkeletonKind } from '#lib/ui/Skeleton.svelte';
	import { projectUrl, questionUrl } from './links.ts';

	let { project, questionId }: { project: Project; questionId: string } = $props();

	const plan = loadFor(
		() => `${project.id}/${questionId}`,
		(signal) => api.question(project.id, questionId, signal)
	);
</script>

<main class="content">
	<a
		class="icon-button back"
		href={projectUrl(project.id)}
		aria-label="Back to {project.name}"
		onclick={(event) => {
			event.preventDefault();
			back(projectUrl(project.id));
		}}
	><ChevronLeft size={20} /></a>
	{#if plan.value?.change}
		<PlanChange projectId={project.id} question={plan.value} />
	{:else if plan.state === LoadState.Loading}
		<Skeleton kind={SkeletonKind.Tree} label="Loading the plan change {questionId}" />
	{:else}
		<LoadFailed what="the plan change {questionId}" onretry={() => plan.retry()} />
	{/if}
</main>
<FloatingAgent agent={project.planner} source={{ project: project.id, lane: null }} owner={project.name} questionHref={questionUrl(project.id, null)} />

<style>
	.content {
		padding: 20px 16px 24px;
	}

	.back {
		margin: 0 0 4px -12px;
	}
</style>
