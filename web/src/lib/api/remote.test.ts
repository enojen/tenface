import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRemoteApi } from './remote.ts';

describe('the remote api', () => {
	afterEach(() => vi.unstubAllGlobals());

	function record() {
		const urls: string[] = [];
		vi.stubGlobal(
			'fetch',
			vi.fn(async (url: string) => {
				urls.push(url);
				return new Response(JSON.stringify([]), { status: 200 });
			})
		);
		return urls;
	}

	it('asks the server for a lane, an agent and a search', async () => {
		const urls = record();
		const api = createRemoteApi('/api');
		const signal = new AbortController().signal;
		await api.lane('sample', 'api', signal);
		await api.agent({ project: 'sample', lane: null }, signal);
		await api.agent({ project: 'sample', lane: 'web' }, signal);
		await api.searchProjects('a b', signal);
		await api.searchLanes('sample', 'we', signal);
		expect(urls).toEqual([
			'/api/projects/sample/lanes/api',
			'/api/projects/sample/planner',
			'/api/projects/sample/lanes/web/babysitter',
			'/api/projects?q=a%20b',
			'/api/projects/sample/lanes?q=we'
		]);
	});

	it('fails when the server does not answer 200', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('', { status: 500 }))
		);
		await expect(
			createRemoteApi('/api').lane('sample', 'api', new AbortController().signal)
		).rejects.toThrow('500');
	});
});
