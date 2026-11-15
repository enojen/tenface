import { nameMatches } from '../model.ts';
import { sampleState } from './sample.ts';
import type { AgentSource, Api, State } from './types.ts';

const MockMode = { Offline: 'offline' } as const;
const DELAY_KEY = 'tenface.mock-delay';
const DELAY_MS = 400;

function delay() {
	try {
		const stored = Number(localStorage.getItem(DELAY_KEY));
		return Number.isFinite(stored) && stored > 0 ? stored : DELAY_MS;
	} catch {
		return DELAY_MS;
	}
}

function answer<T>(make: () => T | undefined, signal: AbortSignal): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			const value = make();
			if (value === undefined) reject(new Error('Not found'));
			else resolve(value);
		}, delay());
		signal.addEventListener('abort', () => {
			clearTimeout(timer);
			reject(signal.reason);
		});
	});
}

const matching = <T extends { id: string; name: string }>(items: T[], query: string) =>
	items.filter((item) => nameMatches(item.name, query)).map((item) => item.id);

export function createMockApi(): Api {
	let state: State = sampleState(Date.now());
	const project = (id: string) => state.projects.find((candidate) => candidate.id === id);
	const findAgent = (source: AgentSource) => {
		const owner = project(source.project);
		if (!owner || source.lane === null) return owner?.planner;
		return owner.lanes.find((lane) => lane.id === source.lane)?.babysitter;
	};

	return {
		subscribe(onState, onConnection) {
			const timer = setTimeout(() => {
				state = sampleState(Date.now());
				onState(state);
				const offline = new URLSearchParams(location.search).get('mock') === MockMode.Offline;
				onConnection(
					offline
						? { online: false, since: new Date(Date.now() - 18 * 60_000).toISOString() }
						: { online: true }
				);
			});
			return () => clearTimeout(timer);
		},
		lane: (projectId, laneId, signal) =>
			answer(() => project(projectId)?.lanes.find((lane) => lane.id === laneId), signal),
		agent: (source, signal) => answer(() => findAgent(source), signal),
		searchProjects: (query, signal) => answer(() => matching(state.projects, query), signal),
		searchLanes: (projectId, query, signal) =>
			answer(() => matching(project(projectId)?.lanes ?? [], query), signal)
	};
}
