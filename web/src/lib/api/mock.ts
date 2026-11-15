import { nameMatches } from '../model.ts';
import { type SampleWorld, sampleWorld } from './sample.ts';
import type { Api } from './types.ts';
import { summarize, worldAgent, worldLane, worldQuestion } from './world.ts';

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
	let world: SampleWorld = sampleWorld(Date.now());
	const project = (id: string) => world.projects.find((candidate) => candidate.id === id);

	return {
		subscribe(onState, onConnection) {
			const timer = setTimeout(() => {
				world = sampleWorld(Date.now());
				onState(summarize(world));
				const offline = new URLSearchParams(location.search).get('mock') === MockMode.Offline;
				onConnection(
					offline
						? { online: false, since: new Date(Date.now() - 18 * 60_000).toISOString() }
						: { online: true }
				);
			});
			return () => clearTimeout(timer);
		},
		lane: (projectId, laneId, signal) => answer(() => worldLane(world, projectId, laneId), signal),
		agent: (source, signal) => answer(() => worldAgent(world, source), signal),
		question: (projectId, id, signal) => answer(() => worldQuestion(world, projectId, id), signal),
		searchProjects: (query, signal) => answer(() => matching(world.projects, query), signal),
		searchLanes: (projectId, query, signal) =>
			answer(() => matching(project(projectId)?.lanes ?? [], query), signal)
	};
}
