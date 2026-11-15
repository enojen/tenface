import type { Api, State } from './types.ts';

const RETRY_MS = [1_000, 2_000, 5_000, 10_000, 30_000];

export function createStreamApi(url: string): Pick<Api, 'subscribe'> {
	return {
		subscribe(onState, onConnection) {
			let source: EventSource;
			let offline = false;
			let tries = 0;
			let retry: ReturnType<typeof setTimeout> | undefined;

			const goOffline = () => {
				if (offline) return;
				offline = true;
				onConnection({ online: false, since: new Date().toISOString() });
			};

			const open = () => {
				source = new EventSource(url);
				source.addEventListener('state', (event) => {
					let state: State;
					try {
						state = JSON.parse(event.data) as State;
					} catch {
						return;
					}
					onState(state);
				});
				source.onopen = () => {
					tries = 0;
					offline = false;
					onConnection({ online: true });
				};
				source.onerror = () => {
					goOffline();
					if (source.readyState !== EventSource.CLOSED) return;
					retry = setTimeout(open, RETRY_MS[Math.min(tries++, RETRY_MS.length - 1)]);
				};
			};

			open();
			return () => {
				clearTimeout(retry);
				source.close();
			};
		}
	};
}
