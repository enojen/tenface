<script lang="ts">
	import type { Project } from '#lib/api/types.ts';
	import LanesTable from '#lib/ui/LanesTable.svelte';
	import BackHeader from './BackHeader.svelte';

	let { project }: { project: Project } = $props();
</script>

<BackHeader href="/projects" label="Back to projects">
	<h1 class="display">{project.name}</h1>
</BackHeader>
<main class="content">
	<LanesTable {project} />
</main>

<style>
	.content {
		padding: 0 16px 24px;
	}
</style>
