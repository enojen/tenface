import { live } from './live.svelte.ts';

export const LoadState = { Loading: 'loading', Ready: 'ready', Failed: 'failed' } as const;
export type LoadState = (typeof LoadState)[keyof typeof LoadState];

export class Load<T> {
	value = $state.raw<T | undefined>(undefined);
	state = $state<LoadState>(LoadState.Loading);
	attempt = $state(0);
	private key: string | null = null;

	run(key: string, fetch: (signal: AbortSignal) => Promise<T>) {
		this.attempt;
		if (key !== this.key) this.reset(key);
		const controller = new AbortController();
		fetch(controller.signal).then(
			(value) => this.done(controller.signal, value),
			() => this.fail(controller.signal)
		);
		return () => controller.abort();
	}

	retry() {
		this.state = LoadState.Loading;
		this.attempt += 1;
	}

	private reset(key: string) {
		this.key = key;
		this.value = undefined;
		this.state = LoadState.Loading;
	}

	private done(signal: AbortSignal, value: T) {
		if (signal.aborted) return;
		this.value = value;
		this.state = LoadState.Ready;
	}

	private fail(signal: AbortSignal) {
		if (signal.aborted || this.value !== undefined) return;
		this.state = LoadState.Failed;
	}
}

export function pause(ms: number, signal: AbortSignal) {
	return new Promise<void>((resolve, reject) => {
		const timer = setTimeout(resolve, ms);
		signal.addEventListener('abort', () => {
			clearTimeout(timer);
			reject(signal.reason);
		});
	});
}

export function loadFor<T>(key: () => string | null, fetch: (signal: AbortSignal) => Promise<T>) {
	const load = new Load<T>();
	$effect(() => {
		live.state;
		const current = key();
		if (current === null) return;
		return load.run(current, fetch);
	});
	return load;
}

const SEARCH_PAUSE_MS = 250;

export function searchFor(
	query: () => string,
	find: (query: string, signal: AbortSignal) => Promise<string[]>
) {
	return loadFor(
		() => query().trim() || null,
		async (signal) => {
			const text = query().trim();
			await pause(SEARCH_PAUSE_MS, signal);
			return find(text, signal);
		}
	);
}

export function searched<T extends { id: string }>(
	items: T[],
	query: string,
	hits: Load<string[]>
) {
	if (!query.trim()) return items;
	if (!hits.value) return null;
	const ids = new Set(hits.value);
	return items.filter((item) => ids.has(item.id));
}
