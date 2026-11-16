<script lang="ts">
	let {
		what,
		onretry,
		refresh = false
	}: { what: string; onretry: () => void; refresh?: boolean } = $props();
</script>

<p class="failed label muted" role="alert">
	Could not {refresh ? 'refresh' : 'load'} {what}.
	<button type="button" class="link" onclick={onretry}>Try again</button>
</p>

<style>
	.failed {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
	}

	.link {
		min-height: 44px;
		padding: 0;
		border: none;
		background: none;
		color: var(--ink);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
</style>
