<script lang="ts">
	let { what, back, label }: { what: string; back: string; label: string } = $props();
</script>

<main class="missing">
	<h1 class="headline">{what} is not here</h1>
	<p>It may have been closed or renamed on the server.</p>
	<a class="button" href={back}>{label}</a>
</main>

<style>
	.missing {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding: 24px 16px;
	}

	p {
		color: var(--ink-soft);
	}
</style>
