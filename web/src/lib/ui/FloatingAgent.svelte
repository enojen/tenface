<script lang="ts">
	import { untrack } from 'svelte';
	import { type Agent, AgentRole, type Question } from '#lib/api/types.ts';
	import { rememberCard } from '#lib/nav.svelte.ts';
	import { page } from '$app/state';
	import AgentCard from './AgentCard.svelte';
	import AgentRing from './AgentRing.svelte';

	let { agent, owner, questionHref }: { agent: Agent; owner: string; questionHref: (question: Question) => string } = $props();

	const SIZE = 56;
	const EDGE = 8;
	const LOW = 104;
	const KEY = 'tenface.agent';

	const Side = { Left: 'left', Right: 'right' } as const;
	type Side = (typeof Side)[keyof typeof Side];

	const Phase = { Rest: 'rest', Pressed: 'pressed', Dragging: 'dragging', Settling: 'settling' } as const;
	type Phase = (typeof Phase)[keyof typeof Phase];

	const SCALE: Record<Phase, number> = {
		[Phase.Rest]: 1,
		[Phase.Pressed]: 0.94,
		[Phase.Dragging]: 1.08,
		[Phase.Settling]: 1
	};

	const isSide = (value: unknown): value is Side => value === Side.Left || value === Side.Right;

	function saved(): { side: Side; bottom: number } {
		try {
			const value = JSON.parse(localStorage.getItem(KEY) ?? '');
			if (isSide(value.side) && typeof value.bottom === 'number') return value;
		} catch {}
		return { side: Side.Right, bottom: LOW };
	}

	let place = $state(saved());
	let width = $state(390);
	let height = $state(844);
	let start: { x: number; y: number; moved: boolean } | null = null;
	let dragged = false;
	let dialog = $state<HTMLDialogElement>();
	let open = $state(false);

	let phase = $state<Phase>(Phase.Rest);
	let at = $state({ x: 0, y: 0 });
	let target = { x: 0, y: 0 };
	let frame = 0;

	const role = $derived(agent.role === AgentRole.Planner ? 'Planner' : 'Babysitter');
	const percent = $derived(Math.round((agent.context.used / agent.context.limit) * 100));
	const count = $derived(agent.questions.length);
	const label = $derived(
		`${role} of ${owner}, context ${percent} percent, ${count} open ${count === 1 ? 'question' : 'questions'}, ${agent.working ? 'working' : 'waiting'}. Drag to move, tap to ${open ? 'close' : 'open'} its card`
	);
	const rest = $derived({
		x: place.side === Side.Left ? EDGE : width - SIZE - EDGE,
		y: Math.min(Math.max(height - place.bottom - SIZE, 16), height - SIZE - LOW)
	});
	const shown = $derived(phase === Phase.Dragging ? at : rest);
	const scale = $derived(SCALE[phase]);
	const style = $derived(`transform: translate3d(${shown.x}px, ${shown.y}px, 0) scale(${scale})`);

	const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	function follow() {
		const pull = reduced() ? 1 : 0.22;
		at = { x: at.x + (target.x - at.x) * pull, y: at.y + (target.y - at.y) * pull };
		frame = requestAnimationFrame(follow);
	}

	function down(event: PointerEvent) {
		start = { x: event.clientX, y: event.clientY, moved: false };
		phase = Phase.Pressed;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function move(event: PointerEvent) {
		if (!start) return;
		if (!start.moved && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 6) return;
		target = { x: event.clientX - SIZE / 2, y: event.clientY - SIZE / 2 };
		if (!start.moved) {
			start.moved = true;
			at = { ...rest };
			phase = Phase.Dragging;
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
			phase = Phase.Rest;
			return;
		}
		const top = Math.min(Math.max(event.clientY - SIZE / 2, 16), height - SIZE - LOW);
		place = { side: event.clientX < width / 2 ? Side.Left : Side.Right, bottom: Math.round(height - top - SIZE) };
		phase = Phase.Settling;
		setTimeout(endSettling, 520);
		try {
			localStorage.setItem(KEY, JSON.stringify(place));
		} catch {}
	}

	function endSettling() {
		if (phase === Phase.Settling) phase = Phase.Rest;
	}

	function cancel() {
		start = null;
		cancelAnimationFrame(frame);
		phase = Phase.Rest;
	}

	let cardBelow = $state(false);
	let cardStyle = $state('');

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
	type="button"
	class="float agent-button"
	{style}
	class:dragging={phase === Phase.Dragging}
	class:settling={phase === Phase.Settling}
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

<!-- biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes a modal dialog -->
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
		{#if open}<AgentCard {agent} {owner} {questionHref} />{/if}
	</div>
	<button type="button" class="float agent-button" {style} aria-label={label} aria-expanded="true" onclick={() => dialog?.close()}>
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
</style>
