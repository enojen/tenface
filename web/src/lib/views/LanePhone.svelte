<script lang="ts">
	import { api } from '#lib/api/index.ts';
	import type { LaneSummary, Project } from '#lib/api/types.ts';
	import { live } from '#lib/live.svelte.ts';
	import { LoadState, loadFor } from '#lib/load.svelte.ts';
	import { back } from '#lib/nav.svelte.ts';
	import FloatingAgent from '#lib/ui/FloatingAgent.svelte';
	import LaneHeader from '#lib/ui/LaneHeader.svelte';
	import LaneTree from '#lib/ui/LaneTree.svelte';
	import LoadFailed from '#lib/ui/LoadFailed.svelte';
	import Skeleton, { SkeletonKind } from '#lib/ui/Skeleton.svelte';
	import BackLink from './BackLink.svelte';
	import { laneUrl, projectUrl, questionUrl, taskUrl } from './links.ts';
	import TaskSheet from './TaskSheet.svelte';

	let { project, lane, taskId }: { project: Project; lane: LaneSummary; taskId: string | null } = $props();

	const tree = loadFor(
		() => `lane/${project.id}/${lane.id}`,
		(signal) => api.lane(project.id, lane.id, signal)
	);
	const task = $derived(taskId ? tree.value?.tasks.find((candidate) => candidate.id === taskId) : undefined);
</script>

<header class="crumbs"><BackLink href={projectUrl(project.id)} label="Back to {project.name}" text={project.name} /></header>
<main class="content">
	<section class="panel-card banded">
		<div class="band"><LaneHeader {lane} /></div>
	{#if tree.value}
		<LaneTree
			lane={tree.value}
			picked={taskId}
			offline={!live.connection.online}
			href={(item) => taskUrl(project.id, lane.id, item.id)}
		/>
	{:else if tree.state === LoadState.Failed}
		<LoadFailed what="the tasks of {lane.name}" onretry={() => tree.retry()} />
	{:else}
		<Skeleton kind={SkeletonKind.Tree} label="Loading the tasks of {lane.name}" />
	{/if}
	</section>
</main>
<FloatingAgent agent={lane.babysitter} source={{ project: project.id, lane: lane.id }} owner={lane.name} questionHref={questionUrl(project.id, lane.id)} />

{#if task}
	{#key task.id}
		<TaskSheet {task} steps={project.steps} onclose={() => back(laneUrl(project.id, lane.id))} />
	{/key}
{/if}

<style>
	.crumbs {
		padding: 12px 16px 4px 8px;
	}

	.content {
		padding: 0 16px 24px;
	}
</style>
