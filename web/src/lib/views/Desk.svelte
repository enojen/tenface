<script lang="ts">
	import { api } from '#lib/api/index.ts';
	import type { Project } from '#lib/api/types.ts';
	import { live } from '#lib/live.svelte.ts';
	import { LoadState, loadFor } from '#lib/load.svelte.ts';
	import { back } from '#lib/nav.svelte.ts';
	import DeskAgent from '#lib/ui/DeskAgent.svelte';
	import LaneHeader from '#lib/ui/LaneHeader.svelte';
	import LanesTable from '#lib/ui/LanesTable.svelte';
	import LaneTree from '#lib/ui/LaneTree.svelte';
	import LoadFailed from '#lib/ui/LoadFailed.svelte';
	import PlanChange from '#lib/ui/PlanChange.svelte';
	import Skeleton, { SkeletonKind } from '#lib/ui/Skeleton.svelte';
	import TaskDetail from '#lib/ui/TaskDetail.svelte';
	import BackHeader from './BackHeader.svelte';
	import { laneUrl, projectUrl, questionUrl, taskUrl } from './links.ts';

	let {
		project,
		laneId,
		taskId = null,
		questionId = null
	}: { project: Project; laneId: string | null; taskId?: string | null; questionId?: string | null } = $props();

	const lane = $derived(project.lanes.find((candidate) => candidate.id === laneId) ?? project.lanes[0]);
	const tree = loadFor(
		() => (lane ? `${project.id}/${lane.id}` : null),
		(signal) => api.lane(project.id, lane?.id ?? '', signal)
	);
	const plan = loadFor(
		() => (questionId ? `${project.id}/${questionId}` : null),
		(signal) => api.question(project.id, questionId ?? '', signal)
	);
	const task = $derived(taskId ? tree.value?.tasks.find((candidate) => candidate.id === taskId) : undefined);
	const close = () => back(lane ? laneUrl(project.id, lane.id) : projectUrl(project.id));

	function detailLabel() {
		if (task) return `Task ${task.id}`;
		if (questionId) return `Question ${questionId}`;
		return 'Detail';
	}
</script>

{#snippet planChange()}
	{#if plan.value?.change}
		<PlanChange question={plan.value} heading="h2" onclose={close} />
	{:else if plan.state === LoadState.Loading}
		<Skeleton kind={SkeletonKind.Tree} label="Loading the plan change {questionId}" />
	{:else}
		<LoadFailed what="the plan change {questionId}" onretry={() => plan.retry()} />
	{/if}
{/snippet}

<div class="desk">
	<BackHeader href="/projects" label="Back to projects">
		<h1 class="display">{project.name}</h1>
		<DeskAgent agent={project.planner} source={{ project: project.id, lane: null }} owner={project.name} questionHref={questionUrl(project.id, lane?.id ?? null)} />
	</BackHeader>

	<div class="columns">
		<div class="column first">
			<LanesTable {project} desk size={10} picked={lane?.id ?? null} outlined={questionId !== null} />
		</div>

		<main class="column banded">
			{#if lane}
				<div class="lane-top band">
					<LaneHeader {lane} heading="h2" />
					<DeskAgent agent={lane.babysitter} source={{ project: project.id, lane: lane.id }} owner={lane.name} align="right" questionHref={questionUrl(project.id, lane.id)} />
				</div>
				{#if tree.value}
					<LaneTree
						lane={tree.value}
						steps={project.steps}
						picked={task?.id ?? null}
						offline={!live.connection.online}
						href={(item) => taskUrl(project.id, lane.id, item.id)}
					/>
				{:else if tree.state === LoadState.Failed}
					<LoadFailed what="the tasks of {lane.name}" onretry={() => tree.retry()} />
				{:else}
					<Skeleton kind={SkeletonKind.Tree} label="Loading the tasks of {lane.name}" />
				{/if}
			{:else}
				<p class="muted">This project has no lanes yet.</p>
			{/if}
		</main>

		<aside class="column detail banded" aria-label={detailLabel()}>
			{#if task}
				{#key task.id}<TaskDetail {task} steps={project.steps} onclose={close} />{/key}
			{:else if questionId}
				{@render planChange()}
			{:else}
				<p class="muted">Pick a task in the tree, or a planner question in the P card.</p>
			{/if}
		</aside>
	</div>
</div>

<style>
	.desk {
		min-height: calc(100dvh - 120px - env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
	}

	.desk :global(.back-header) {
		padding: 24px 32px 16px 20px;
	}

	.columns {
		flex: 1;
		padding: 0 32px;
		display: flex;
		gap: 24px;
		align-items: stretch;
	}

	.column {
		--band-pad: 16px;
		--band-radius: 27px;
		position: relative;
		flex: 1 1 0;
		min-width: 0;
		padding: 16px;
		border-radius: 28px;
		border: 1px solid var(--line);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.first {
		flex: 0 0 clamp(360px, 24vw, 440px);
	}

	.detail {
		background: var(--tile);
	}

	.lane-top {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	@media (max-width: 1199px) {
		.columns {
			gap: 16px;
			padding-inline: 16px;
		}

		.first {
			flex: 0 0 380px;
		}
	}
</style>
