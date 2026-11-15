<script lang="ts">
	import { type Trio, trioLabel } from '#lib/model.ts';

	let { trio, noun = '' }: { trio: Trio; noun?: string } = $props();
</script>

<span class="trio label" role="img" aria-label={trioLabel(trio, noun)}>
	<span><span class="mark done"></span>{trio.done}</span>
	<span><span class="mark running"></span>{trio.running}</span>
	<span><span class="mark waiting"></span>{trio.waiting}</span>
</span>

<style>
	.trio {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
	}

	.trio > span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.mark {
		flex: none;
		width: 14px;
		height: 14px;
		border-radius: 4px;
	}

	.done {
		background: var(--mark-done);
	}

	.running {
		background: var(--running);
	}

	.waiting {
		border: 1.5px solid var(--mark);
	}

	:global(.picked) .trio {
		padding: 2px 8px;
		border-radius: 999px;
		background: var(--ground);
	}
</style>
