<script lang="ts">
	import { untrack } from 'svelte';
	import type { Agent, Question } from '#lib/api/types.ts';
	import { rememberCard } from '#lib/nav.svelte.ts';
	import { page } from '$app/state';
	import AgentCard from './AgentCard.svelte';
	import AgentRing from './AgentRing.svelte';

	let { agent, owner, questionHref }: { agent: Agent; owner: string; questionHref: (question: Question) => string } = $props();

	const SIZE = 56;
	const EDGE = 8;
	const LOW = 104;
	const KEY = 'tenface.agent';

	function saved(): { side: 'left' | 'right'; bottom: number } {
		try {
			const value = JSON.parse(localStorage.getItem(KEY) ?? '');
			if ((value.side === 'left' || value.side === 'right') && typeof value.bottom === 'number') return value;
		} catch {}
		return { side: 'right', bottom: LOW };
	}

	let place = $state(saved());
	let width = $state(390);
	let height = $state(844);
	let start: { x: number; y: number; moved: boolean } | null = null;
	let dragged = false;
	let dialog = $state<HTMLDialogElement>();
	let open = $state(false);

	// The ring trails the finger a little, then swings to its edge: it should feel heavy.
	type Phase = 'rest' | 'pressed' | 'dragging' | 'settling';
	let phase = $state<Phase>('rest');
	let at = $state({ x: 0, y: 0 });
	let target = { x: 0, y: 0 };
	let frame = 0;

	const role = $derived(agent.role === 'planner' ? 'Planner' : 'Babysitter');
	const percent = $derived(Math.round((agent.context.used / agent.context.limit) * 100));
	const count = $derived(agent.questions.length);
	const label = $derived(
		`${role} of ${owner}, context ${percent} percent, ${count} open ${count === 1 ? 'question' : 'questions'}. Drag to move, tap to ${open ? 'close' : 'open'} its card`
	);
	const rest = $derived({
		x: place.side === 'left' ? EDGE : width - SIZE - EDGE,
		y: Math.min(Math.max(height - place.bottom - SIZE, 16), height - SIZE - LOW)
	});
	const shown = $derived(phase === 'dragging' ? at : rest);
	const scale = $derived(phase === 'dragging' ? 1.08 : phase === 'pressed' ? 0.94 : 1);
	const style = $derived(`transform: translate3d(${shown.x}px, ${shown.y}px, 0) scale(${scale})`);

	const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	function follow() {
		const pull = reduced() ? 1 : 0.22;
		at = { x: at.x + (target.x - at.x) * pull, y: at.y + (target.y - at.y) * pull };
		frame = requestAnimationFrame(follow);
	}

	function down(event: PointerEvent) {
		start = { x: event.clientX, y: event.clientY, moved: false };
		phase = 'pressed';
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function move(event: PointerEvent) {
		if (!start) return;
		if (!start.moved && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 6) return;
		target = { x: event.clientX - SIZE / 2, y: event.clientY - SIZE / 2 };
		if (!start.moved) {
			start.moved = true;
			at = { ...rest };
			phase = 'dragging';
			frame = requestAnimationFrame(follow);
		}
	}

	function up(event: PointerEvent) {
		if (!start) return;
		const moved = start.moved;
		start = null;
		dragged = moved;
		cancelAnimationFrame(frame);
		if (!moved) {
			phase = 'rest';
			return;
		}
		const top = Math.min(Math.max(event.clientY - SIZE / 2, 16), height - SIZE - LOW);
		place = { side: event.clientX < width / 2 ? 'left' : 'right', bottom: Math.round(height - top - SIZE) };
		phase = 'settling';
		setTimeout(() => phase === 'settling' && (phase = 'rest'), 520);
		try {
			localStorage.setItem(KEY, JSON.stringify(place));
		} catch {}
	}

	function cancel() {
		start = null;
		cancelAnimationFrame(frame);
		phase = 'rest';
	}

	let cardBelow = $state(false);
	let cardStyle = $state('');

	/** The card opens on the side of the ring that has more room, so it never leaves the screen. */
	function placeCard() {
		const top = rest.y;
		cardBelow = top + SIZE / 2 < height / 2;
		cardStyle = cardBelow
			? `top: ${top + SIZE + 12}px; max-height: ${height - top - SIZE - 28}px`
			: `bottom: ${height - top + 12}px; max-height: ${top - 28}px`;
	}

	function toggle() {
		if (dragged) {
			dragged = false;
			return;
		}
		if (open) dialog?.close();
		else openCard();
	}

	function openCard() {
		placeCard();
		dialog?.showModal();
		dialog?.focus();
		open = true;
		rememberCard(agent.role);
	}

	$effect(() => {
		if (dialog && page.state.agent === agent.role) untrack(() => !open && openCard());
	});
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

{#snippet ring()}
	<AgentRing {agent} size={SIZE} />
{/snippet}

<button
	class="float agent-button"
	{style}
	class:dragging={phase === 'dragging'}
	class:settling={phase === 'settling'}
	aria-label={label}
	aria-haspopup="dialog"
	aria-expanded={open}
	onpointerdown={down}
	onpointermove={move}
	onpointerup={up}
	onpointercancel={cancel}
	onclick={toggle}
>
	{@render ring()}
</button>

<dialog
	bind:this={dialog}
	tabindex="-1"
	aria-label="{role} of {owner}"
	onclose={() => {
		open = false;
		rememberCard(undefined);
	}}
	onclick={(event) => event.target === dialog && dialog?.close()}
>
	<div class="card" class:below={cardBelow} style={cardStyle}>
		<AgentCard {agent} {owner} {questionHref} />
	</div>
	<button class="float agent-button" {style} aria-label={label} aria-expanded="true" onclick={() => dialog?.close()}>
		{@render ring()}
	</button>
</dialog>

<style>
	.float {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 3;
		width: 56px;
		height: 56px;
		padding: 0;
		border: none;
		border-radius: 999px;
		background: none;
		box-shadow: var(--shadow-ring);
		touch-action: none;
		cursor: grab;
		transition:
			transform 160ms ease,
			box-shadow 200ms ease;
	}

	.dragging {
		cursor: grabbing;
		transition: box-shadow 200ms ease;
		box-shadow: 0 14px 30px rgba(var(--shade), 0.3);
	}

	.settling {
		transition: transform 500ms cubic-bezier(0.3, 1.35, 0.5, 1);
	}

	@media (prefers-reduced-motion: reduce) {
		.float,
		.settling {
			transition: none;
		}
	}

	dialog {
		position: fixed;
		inset: 0;
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
	}

	dialog::backdrop {
		background: var(--dim);
	}

	dialog[open] .card {
		animation: card-in 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	dialog[open]::backdrop {
		animation: dim-in 200ms ease;
	}

	.card.below {
		transform-origin: top right;
	}

	@keyframes card-in {
		from {
			opacity: 0;
			scale: 0.94;
		}
	}

	@keyframes dim-in {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog[open] .card,
		dialog[open]::backdrop {
			animation: none;
		}
	}

	.card {
		position: absolute;
		left: 16px;
		right: 16px;
		overflow-y: auto;
		transform-origin: bottom right;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px;
		border-radius: 18px;
		background: var(--tile);
		border: 1px solid var(--line-strong);
		box-shadow: var(--shadow-card);
	}
</style>
