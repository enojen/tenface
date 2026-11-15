import { sampleState } from './sample.ts';
import type { Api } from './types.ts';

const MockMode = { Offline: 'offline' } as const;

export function createMockApi(): Api {
	return {
		subscribe(onState, onConnection) {
			const timer = setTimeout(() => {
				onState(sampleState(Date.now()));
				const offline = new URLSearchParams(location.search).get('mock') === MockMode.Offline;
				onConnection(
					offline
						? { online: false, since: new Date(Date.now() - 18 * 60_000).toISOString() }
						: { online: true }
				);
			});
			return () => clearTimeout(timer);
		}
	};
}
