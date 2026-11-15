<script lang="ts">
	import { live, wide } from '#lib/live.svelte.ts';
	import ProjectsTable from '#lib/ui/ProjectsTable.svelte';
</script>

<main class="narrow">
	<h1 class="display">Projects</h1>
	<ProjectsTable projects={live.state?.projects ?? []} size={wide.value ? 50 : 5} />
</main>

<style>
	.narrow {
		max-width: 880px;
		margin: 0 auto;
		padding: 24px 16px 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	@media (min-width: 1024px) {
		.narrow {
			padding-inline: 24px;
		}
	}
</style>
