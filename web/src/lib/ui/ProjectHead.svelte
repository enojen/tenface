<script lang="ts">
	import type { Project } from '#lib/api/types.ts';
	import { projectRunning } from '#lib/model.ts';

	let { project }: { project: Project } = $props();
</script>

<div class="project-head">
	<h1 class="card-head"><span aria-hidden="true">Project ·</span> {project.name}</h1>
	{#if projectRunning(project.lanes)}<span class="running-note">running</span>{/if}
</div>

<style>
	.project-head {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
</style>
