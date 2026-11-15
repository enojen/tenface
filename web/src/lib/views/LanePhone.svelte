<script lang="ts">
	import type { Lane, Project } from '#lib/api/types.ts';
	import { live } from '#lib/live.svelte.ts';
	import { back } from '#lib/nav.svelte.ts';
	import LaneHeader from '#lib/ui/LaneHeader.svelte';
	import LaneTree from '#lib/ui/LaneTree.svelte';
	import BackHeader from './BackHeader.svelte';
	import { laneUrl, projectUrl, taskUrl } from './links.ts';
	import TaskSheet from './TaskSheet.svelte';

	let { project, lane, taskId }: { project: Project; lane: Lane; taskId: string | null } = $props();

	const task = $derived(taskId ? lane.tasks.find((candidate) => candidate.id === taskId) : undefined);
</script>

<BackHeader href={projectUrl(project.id)} label="Back to {project.name}">
	<LaneHeader {lane} />
</BackHeader>
<main class="content">
	<LaneTree
		{lane}
		steps={project.steps}
		picked={taskId}
		offline={!live.connection.online}
		href={(item) => taskUrl(project.id, lane.id, item.id)}
	/>
</main>

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
