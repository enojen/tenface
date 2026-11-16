<script lang="ts">
	import type { LaneChange, LaneMove } from '#lib/plan-diff.ts';

	let { changes }: { changes: LaneChange[] } = $props();

	const anchor = (change: LaneChange) => `#${change.isNew ? 'new-lane' : 'lane-diff'}-${change.lane}`;
	const tasks = (count: number) => `${count} ${count === 1 ? 'task moves' : 'tasks move'}`;
	const moveText = (move: LaneMove) => `${tasks(move.count)} to ${move.to ?? 'another lane'}`;
</script>

<section class="lanes" aria-label="Lanes this change touches">
	<div class="row head" aria-hidden="true">
		<span class="number">#</span><span>lane</span><span class="kind">change</span><span>what happens</span>
	</div>
	<ol>
		{#each changes as change, index (change.lane)}
			<li class="row">
				<span class="number" aria-hidden="true">{index + 1}</span>
				<span class="name"><a href={anchor(change)}>{change.lane}</a></span>
				<span class="kind">
					{#if change.isNew}<span class="tag">NEW LANE</span>{:else}changed{/if}
				</span>
				<span class="what">
					{#if change.added > 0}<span class="plus">+{change.added}</span>{/if}
					{#if change.removed > 0}<span class="minus">−{change.removed}</span>{/if}
					{#each change.moves as move (move.to)}<span>{moveText(move)}</span>{/each}
					{#if change.source}<span>split off from {change.source}</span>{/if}
				</span>
			</li>
		{/each}
	</ol>
</section>

<style>
	.lanes {
		font-size: 13px;
		line-height: 22px;
	}

	:global(.banded) .lanes {
		margin: -16px calc(-1 * var(--band-pad, 0px)) 0;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.row {
		display: grid;
		grid-template-columns: 34px minmax(110px, 200px) 110px minmax(0, 1fr);
		min-height: 30px;
	}

	.row > span {
		padding: 4px 10px 0 0;
	}

	.row.head {
		min-height: 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--muted);
		background: var(--raised);
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line-strong);
	}

	.row.head > span {
		padding-block: 2px;
	}

	li.row + li.row {
		border-top: 1px solid var(--line);
	}

	li.row:last-child {
		border-bottom: 1px solid var(--line);
	}

	.number {
		padding-right: 8px;
		text-align: right;
		font-size: 12px;
		color: var(--muted-soft);
		user-select: none;
	}

	.name {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	a {
		font-weight: 600;
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--mark);
		text-underline-offset: 3px;
	}

	.tag {
		display: inline-block;
		padding: 0 8px;
		font-size: 11px;
		font-weight: 700;
		line-height: 18px;
		letter-spacing: 0.06em;
		white-space: nowrap;
		border: 1px solid var(--ink);
		border-radius: 999px;
	}

	.kind {
		color: var(--ink-soft);
	}

	.what {
		display: flex;
		flex-wrap: wrap;
		gap: 0 12px;
		min-width: 0;
		color: var(--ink-soft);
	}

	.plus {
		font-weight: 500;
		color: var(--diff-add-ink);
	}

	.minus {
		font-weight: 500;
		color: var(--diff-remove-ink);
	}

	@container (max-width: 520px) {
		.row {
			grid-template-columns: 28px minmax(0, 1fr) minmax(0, 1.4fr);
		}

		.kind {
			display: none;
		}
	}
</style>
