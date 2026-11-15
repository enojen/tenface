<script lang="ts">
	import Search from '@lucide/svelte/icons/search';

	let { value = $bindable(''), label }: { value?: string; label: string } = $props();
	const id = $props.id();
</script>

<label for={id} class="sr-only">{label}</label>
<span class="field">
	<Search size={16} aria-hidden="true" />
	<input {id} type="search" placeholder={label} bind:value />
</span>

<style>
	.field {
		position: relative;
		display: block;
		height: 44px;
	}

	.field :global(svg) {
		position: absolute;
		left: 14px;
		top: 14px;
		color: var(--muted);
	}

	input {
		width: 100%;
		height: 44px;
		padding: 0 14px 0 38px;
		border-radius: 999px;
		border: 1px solid var(--mark);
		background: var(--ground);
		color: var(--ink);
		font: inherit;
		font-size: 16px;
	}

	input::placeholder {
		color: var(--muted);
		opacity: 1;
	}
</style>
