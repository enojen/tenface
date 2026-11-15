<script lang="ts">
	import WifiOff from '@lucide/svelte/icons/wifi-off';
	import { clock } from '#lib/format.ts';
	import { live } from '#lib/live.svelte.ts';
</script>

{#if !live.connection.online}
	<div class="strip" role="status">
		<WifiOff size={18} aria-hidden="true" />
		<span>
			<strong>Offline since {clock(live.connection.since, live.now)}</strong>
			<span class="label">You see the last known state. The panel reconnects by itself.</span>
		</span>
	</div>
{/if}

<style>
	.strip {
		position: sticky;
		top: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		padding: 8px 16px;
		padding-top: calc(8px + env(safe-area-inset-top));
		background: var(--ink);
		color: var(--ground);
	}

	.strip > span {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	strong {
		font-weight: 600;
	}

	.label {
		color: var(--on-ink-muted);
	}

	@media (min-width: 1024px) {
		.strip {
			min-height: 56px;
			padding-inline: 24px;
		}
	}
</style>
