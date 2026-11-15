<script lang="ts">
	import type { Project } from '#lib/api/types.ts';
	import FloatingAgent from '#lib/ui/FloatingAgent.svelte';
	import LanesTable from '#lib/ui/LanesTable.svelte';
	import ProjectHead from '#lib/ui/ProjectHead.svelte';
	import BackLink from './BackLink.svelte';
	import { questionUrl } from './links.ts';

	let { project }: { project: Project } = $props();
</script>

<header class="crumbs"><BackLink href="/projects" label="Back to projects" text="Projects" /></header>
<main class="content">
	<section class="panel-card banded" aria-label="Project {project.name}">
		<div class="band"><ProjectHead {project} /></div>
		<LanesTable {project} />
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
