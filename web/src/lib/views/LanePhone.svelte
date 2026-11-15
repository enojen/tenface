<script lang="ts">
	import { api } from '#lib/api/index.ts';
	import type { Lane, Project } from '#lib/api/types.ts';
	import { live } from '#lib/live.svelte.ts';
	import { LoadState, loadFor } from '#lib/load.svelte.ts';
	import { back } from '#lib/nav.svelte.ts';
	import FloatingAgent from '#lib/ui/FloatingAgent.svelte';
	import LaneHeader from '#lib/ui/LaneHeader.svelte';
	import LaneTree from '#lib/ui/LaneTree.svelte';
	import LoadFailed from '#lib/ui/LoadFailed.svelte';
	import Skeleton, { SkeletonKind } from '#lib/ui/Skeleton.svelte';
	import BackHeader from './BackHeader.svelte';
	import { laneUrl, projectUrl, questionUrl, taskUrl } from './links.ts';
	import TaskSheet from './TaskSheet.svelte';

	let { project, lane, taskId }: { project: Project; lane: Lane; taskId: string | null } = $props();

	const tree = loadFor(
		() => `${project.id}/${lane.id}`,
		(signal) => api.lane(project.id, lane.id, signal)
	);
	const task = $derived(taskId ? tree.value?.tasks.find((candidate) => candidate.id === taskId) : undefined);
</script>

<BackHeader href={projectUrl(project.id)} label="Back to {project.name}">
	<LaneHeader {lane} />
</BackHeader>
<main class="content">
	{#if tree.value}
		<LaneTree
			lane={tree.value}
			steps={project.steps}
			picked={taskId}
			offline={!live.connection.online}
			href={(item) => taskUrl(project.id, lane.id, item.id)}
		/>
	{:else if tree.state === LoadState.Failed}
		<LoadFailed what="the tasks of {lane.name}" onretry={() => tree.retry()} />
	{:else}
		<Skeleton kind={SkeletonKind.Tree} label="Loading the tasks of {lane.name}" />
	{/if}
</main>
<FloatingAgent agent={lane.babysitter} source={{ project: project.id, lane: lane.id }} owner={lane.name} questionHref={questionUrl(project.id, lane.id)} />

{#if task}
	{#key task.id}
		<TaskSheet {task} steps={project.steps} onclose={() => back(laneUrl(project.id, lane.id))} />
	{/key}
{/if}

<style>
	.content {
		padding: 4px 16px 0;
	}
</style>
