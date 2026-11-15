<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Project, Question } from '#lib/api/types.ts';
	import { back } from '#lib/nav.svelte.ts';
	import FloatingAgent from '#lib/ui/FloatingAgent.svelte';
	import PlanChange from '#lib/ui/PlanChange.svelte';
	import { projectUrl, questionUrl } from './links.ts';

	let { project, question }: { project: Project; question: Question } = $props();
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
	<PlanChange {question} />
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
