import type { Api, State } from './types.ts';

/** The server sends the whole state as a `state` event on every change. */
export function createStreamApi(url: string): Api {
	return {
		subscribe(onState, onConnection) {
			const source = new EventSource(url);
			let offline = false;
			source.addEventListener('state', (event) => onState(JSON.parse(event.data) as State));
			source.onopen = () => {
				offline = false;
				onConnection({ online: true });
			};
			source.onerror = () => {
				if (offline) return;
				offline = true;
				onConnection({ online: false, since: new Date().toISOString() });
			};
			return () => source.close();
		}
	};
}
