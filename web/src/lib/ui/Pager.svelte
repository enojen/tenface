<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let {
		page = $bindable(0),
		size,
		total,
		noun
	}: { page?: number; size: number; total: number; noun: string } = $props();

	const last = $derived(Math.max(0, Math.ceil(total / size) - 1));
	const first = $derived(page * size + 1);
</script>

{#if total > size}
	<div class="pager">
		<button class="icon-button" disabled={page === 0} aria-label="Previous {noun}" onclick={() => (page -= 1)}>
			<ChevronLeft size={16} />
		</button>
		<span class="label muted" aria-live="polite">{first}–{Math.min(total, first + size - 1)} of {total}</span>
		<button class="icon-button" disabled={page >= last} aria-label="Next {noun}" onclick={() => (page += 1)}>
			<ChevronRight size={16} />
		</button>
	</div>
{/if}

<style>
	.pager {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		border-top: 1px solid var(--line);
	}

	.pager button {
		color: var(--muted);
	}

	.pager button:disabled {
		color: var(--line-strong);
		cursor: default;
	}
</style>
