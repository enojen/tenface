<script lang="ts">
	import type { Project, Question } from '#lib/api/types.ts';
	import { live } from '#lib/live.svelte.ts';
	import { back } from '#lib/nav.svelte.ts';
	import DeskAgent from '#lib/ui/DeskAgent.svelte';
	import LaneHeader from '#lib/ui/LaneHeader.svelte';
	import LanesTable from '#lib/ui/LanesTable.svelte';
	import LaneTree from '#lib/ui/LaneTree.svelte';
	import PlanChange from '#lib/ui/PlanChange.svelte';
	import TaskDetail from '#lib/ui/TaskDetail.svelte';
	import BackHeader from './BackHeader.svelte';
	import { laneUrl, questionUrl, taskUrl } from './links.ts';

	let {
		project,
		laneId,
		taskId = null,
		question = null
	}: { project: Project; laneId: string | null; taskId?: string | null; question?: Question | null } = $props();

	const lane = $derived(project.lanes.find((candidate) => candidate.id === laneId) ?? project.lanes[0]);
	const task = $derived(taskId ? lane?.tasks.find((candidate) => candidate.id === taskId) : undefined);
	const close = () => back(laneUrl(project.id, lane.id));
</script>

<div class="desk">
	<BackHeader href="/projects" label="Back to projects">
		<h1 class="display">{project.name}</h1>
		<DeskAgent agent={project.planner} owner={project.name} questionHref={questionUrl(project.id, lane?.id ?? null)} />
	</BackHeader>

	<div class="columns">
		<div class="column first">
			<LanesTable {project} desk size={10} picked={lane?.id ?? null} outlined={question !== null} />
		</div>

		<main class="column">
			{#if lane}
				<div class="lane-top">
					<LaneHeader {lane} heading="h2" />
					<DeskAgent agent={lane.babysitter} owner={lane.name} align="right" questionHref={questionUrl(project.id, lane.id)} />
				</div>
				<LaneTree
					{lane}
					steps={project.steps}
					picked={task?.id ?? null}
					offline={!live.connection.online}
					href={(item) => taskUrl(project.id, lane.id, item.id)}
				/>
			{:else}
				<p class="muted">This project has no lanes yet.</p>
			{/if}
		</main>

		<aside class="column detail" aria-label={task ? `Task ${task.id}` : question ? `Question ${question.id}` : 'Detail'}>
			{#if task}
				{#key task.id}<TaskDetail {task} steps={project.steps} onclose={close} />{/key}
			{:else if question?.change}
				<PlanChange {question} heading="h2" onclose={close} />
			{:else}
				<p class="muted">Pick a task in the tree, or a planner question in the P card.</p>
			{/if}
		</aside>
	</div>
</div>

<style>
	.desk :global(.back-header) {
		max-width: 1280px;
		margin: 0 auto;
		padding: 24px 24px 16px 12px;
	}

	.columns {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 24px 32px;
		display: flex;
		gap: 24px;
		align-items: stretch;
	}

	.column {
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

	.detail {
		background: var(--tile);
	}

	.lane-top {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 4px;
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
