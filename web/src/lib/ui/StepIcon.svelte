<script lang="ts">
	import type { StepName } from '#lib/api/types.ts';

	let { step, size = 18, color = 'currentColor', width = 2 }: { step: StepName; size?: number; color?: string; width?: number } = $props();
</script>

<svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width={width} stroke-linecap="round" stroke-linejoin="round">
	{#if step === 'plan'}
		<rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" />
	{:else if step === 'approve'}
		<circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.8 2.8L16.5 9" />
	{:else if step === 'build'}
		<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16v4h4l5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5Z" />
	{:else if step === 'debug'}
		<path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" /><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" /><path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" /><path d="M6 13H2" /><path d="M3 21c0-2.1 1.7-3.9 3.8-4" /><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" /><path d="M22 13h-4" /><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
	{:else if step === 'eval'}
		<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" /><path d="M6.453 15h11.094" /><path d="M8.5 2h7" />
	{:else if step === 'PR'}
		<circle cx="6" cy="5.5" r="2" /><circle cx="6" cy="18.5" r="2" /><circle cx="18" cy="18.5" r="2" /><path d="M6 7.5v9M18 16.5V10a3 3 0 0 0-3-3h-4" /><path d="m12.5 4.5-2 2.5 2 2.5" />
	{:else if step === 'merge'}
		<circle cx="6" cy="5.5" r="2" /><circle cx="6" cy="18.5" r="2" /><circle cx="18" cy="12" r="2" /><path d="M6 7.5v9M6 7.5a4.5 4.5 0 0 0 4.5 4.5H16" />
	{:else}
		<path d="M6 21V4" /><path d="M6 4h11l-2.5 4L17 12H6" />
	{/if}
</svg>
