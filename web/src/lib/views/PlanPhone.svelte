<script lang="ts">
	import { api } from '#lib/api/index.ts';
	import type { Project } from '#lib/api/types.ts';
	import { LoadState, loadFor } from '#lib/load.svelte.ts';
	import FloatingAgent from '#lib/ui/FloatingAgent.svelte';
	import LoadFailed from '#lib/ui/LoadFailed.svelte';
	import PlanChange from '#lib/ui/PlanChange.svelte';
	import Skeleton, { SkeletonKind } from '#lib/ui/Skeleton.svelte';
	import BackLink from './BackLink.svelte';
	import { projectUrl, questionUrl } from './links.ts';

	let { project, questionId }: { project: Project; questionId: string } = $props();

	const plan = loadFor(
		() => `${project.id}/${questionId}`,
		(signal) => api.question(project.id, questionId, signal)
	);
</script>

<header class="crumbs"><BackLink href={projectUrl(project.id)} label="Back to {project.name}" text={project.name} /></header>
<main class="content">
	<section class="panel-card banded">
		{#if plan.value?.change}
			<PlanChange projectId={project.id} question={plan.value} />
		{:else if plan.state === LoadState.Loading}
			<Skeleton kind={SkeletonKind.Tree} label="Loading the plan change {questionId}" />
		{:else}
			<LoadFailed what="the plan change {questionId}" onretry={() => plan.retry()} />
		{/if}
	</section>
</main>
<FloatingAgent agent={project.planner} source={{ project: project.id, lane: null }} owner={project.name} questionHref={questionUrl(project.id, null)} />

<style>
	.crumbs {
		padding: 12px 16px 4px 8px;
	}

	.content {
		padding: 0 16px 24px;
	}
</style>
