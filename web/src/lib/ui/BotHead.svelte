<script lang="ts">
	let { letter, size = 22 }: { letter: 'P' | 'B'; size?: number } = $props();
</script>

<svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
	<path d="M12 8V4H8" />
	<rect width="16" height="12" x="4" y="8" rx="2" />
	<path d="M2 14h2" />
	<path d="M20 14h2" />
	<text x="12" y="17.4" text-anchor="middle" fill="currentColor" stroke="none" font-family="Inter Variable, Inter, system-ui, sans-serif" font-size="9" font-weight="700">{letter}</text>
</svg>
