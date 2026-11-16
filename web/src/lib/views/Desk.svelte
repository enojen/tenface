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
	import ProjectHead from '#lib/ui/ProjectHead.svelte';
	import Skeleton, { SkeletonKind } from '#lib/ui/Skeleton.svelte';
	import TaskDetail from '#lib/ui/TaskDetail.svelte';
	import BackLink from './BackLink.svelte';
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

	const planWide = $derived(questionId !== null && !task);

	function detailLabel() {
		if (task) return `Task ${task.id}`;
		if (questionId) return `Question ${questionId}`;
		return 'Detail';
	}
</script>

{#snippet planChange()}
	{#if plan.value?.change}
		<PlanChange projectId={project.id} question={plan.value} heading="h2" onclose={close} />
	{:else if plan.state === LoadState.Loading}
		<Skeleton kind={SkeletonKind.Tree} label="Loading the plan change {questionId}" />
	{:else}
		<LoadFailed what="the plan change {questionId}" onretry={() => plan.retry()} />
	{/if}
{/snippet}

<div class="desk">
	<section class="project" aria-label="Project {project.name}">
		<div class="project-band">
			<BackLink href="/projects" label="Back to projects" />
			<ProjectHead {project} />
			<DeskAgent agent={project.planner} source={{ project: project.id, lane: null }} owner={project.name} align="right" questionHref={questionUrl(project.id, lane?.id ?? null)} />
		</div>

		<div class="columns">
			<div class="lanes">
				<LanesTable {project} desk size={10} picked={lane?.id ?? null} outlined={questionId !== null} />
			</div>

			{#if !planWide}
			<main class="column banded">
				{#if lane}
					<div class="lane-top band">
						<LaneHeader {lane} heading="h2" />
						<DeskAgent agent={lane.babysitter} source={{ project: project.id, lane: lane.id }} owner={lane.name} align="right" questionHref={questionUrl(project.id, lane.id)} />
					</div>
					<div class="column-body">
						{#if tree.value}
							<LaneTree
								lane={tree.value}
								picked={task?.id ?? null}
								offline={!live.connection.online}
								href={(item) => taskUrl(project.id, lane.id, item.id)}
							/>
						{:else if tree.state === LoadState.Failed}
							<LoadFailed what="the tasks of {lane.name}" onretry={() => tree.retry()} />
						{:else}
							<Skeleton kind={SkeletonKind.Tree} label="Loading the tasks of {lane.name}" />
						{/if}
					</div>
				{:else}
					<div class="band"><p class="card-head">Lane</p><p class="subject">This project has no lanes yet</p></div>
				{/if}
			</main>
			{/if}

			<svelte:element this={planWide ? 'main' : 'aside'} class="column banded" class:wide={planWide} aria-label={detailLabel()}>
				{#if task}
					{#key task.id}<TaskDetail {task} steps={project.steps} onclose={close} />{/key}
				{:else if questionId}
					{@render planChange()}
				{:else}
					<div class="band"><p class="card-head">Task</p><p class="subject">No task selected</p></div>
				{/if}
			</svelte:element>
		</div>
	</section>
</div>

<style>
	.desk {
		min-height: calc(100dvh - 120px - env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		padding: 24px 32px 0;
	}

	.project {
		flex: 1;
		display: flex;
		flex-direction: column;
		border-radius: 28px;
		border: 1px solid var(--line-strong);
		background: var(--tile);
	}

	.project-band {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px 12px 8px;
		border-radius: 27px 27px 0 0;
		background: var(--raised);
	}

	.columns {
		flex: 1;
		display: grid;
		grid-template-columns: clamp(340px, 22vw, 420px) minmax(0, 1fr) minmax(0, 1fr);
		grid-template-rows: auto 1fr;
		gap: 16px 20px;
		padding: 16px;
	}

	.lanes {
		grid-row: 1 / span 2;
		min-width: 0;
	}

	.column {
		--band-pad: 16px;
		--band-top: 0px;
		--band-radius: 23px;
		position: relative;
		grid-row: 1 / span 2;
		display: grid;
		grid-template-rows: subgrid;
		min-width: 0;
		padding: 0 16px 16px;
		border-radius: 24px;
		border: 1px solid var(--line);
		background: var(--lift);
	}

	.column.wide {
		grid-column: 2 / span 2;
	}

	.column > :global(.detail),
	.column > :global(.plan) {
		grid-row: 1 / span 2;
		display: grid;
		grid-template-rows: subgrid;
	}

	.column > :global(.band),
	.column > :global(* > .band) {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.lane-top.band,
	.column > :global(* > .top.band) {
		flex-direction: row;
		align-items: flex-start;
		gap: 8px;
	}

	@media (max-width: 1199px) {
		.desk {
			padding-inline: 16px;
		}

		.columns {
			grid-template-columns: 340px minmax(0, 1fr) minmax(0, 1fr);
			gap: 16px;
		}
	}
</style>
