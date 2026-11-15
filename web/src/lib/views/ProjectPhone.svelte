<script lang="ts">
	import type { Project } from '#lib/api/types.ts';
	import FloatingAgent from '#lib/ui/FloatingAgent.svelte';
	import LanesTable from '#lib/ui/LanesTable.svelte';
	import BackHeader from './BackHeader.svelte';
	import { questionUrl } from './links.ts';

	let { project }: { project: Project } = $props();
</script>

<BackHeader href="/projects" label="Back to projects">
	<h1 class="display">{project.name}</h1>
</BackHeader>
<main class="content">
	<LanesTable {project} />
</main>
<FloatingAgent agent={project.planner} owner={project.name} questionHref={questionUrl(project.id, null)} />

<style>
	.content {
		padding: 0 16px 24px;
	}
</style>
