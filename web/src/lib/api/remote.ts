import { createStreamApi } from './stream.ts';
import type { AgentSource, Api } from './types.ts';

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
	const response = await fetch(url, { signal, headers: { accept: 'application/json' } });
	if (!response.ok) throw new Error(`${response.status} ${url}`);
	return (await response.json()) as T;
}

const part = encodeURIComponent;

function agentPath(source: AgentSource) {
	const project = `/projects/${part(source.project)}`;
	return source.lane === null
		? `${project}/planner`
		: `${project}/lanes/${part(source.lane)}/babysitter`;
}

export function createRemoteApi(base: string): Api {
	const { subscribe } = createStreamApi(`${base}/stream`);
	return {
		subscribe,
		lane: (project, lane, signal) =>
			getJson(`${base}/projects/${part(project)}/lanes/${part(lane)}`, signal),
		agent: (source, signal) => getJson(`${base}${agentPath(source)}`, signal),
		searchProjects: (query, signal) => getJson(`${base}/projects?q=${part(query)}`, signal),
		searchLanes: (project, query, signal) =>
			getJson(`${base}/projects/${part(project)}/lanes?q=${part(query)}`, signal)
	};
}
