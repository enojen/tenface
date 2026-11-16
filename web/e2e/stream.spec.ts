import { expect, type Page, type Route, test } from '@playwright/test';
import { type SampleWorld, sampleWorld } from '../src/lib/api/sample.ts';
import { summarize, worldAgent, worldLane, worldQuestion } from '../src/lib/api/world.ts';

test.use({ baseURL: 'http://localhost:4175' });

const nameHas = (name: string, query: string) => name.toLowerCase().includes(query.toLowerCase());

function answers(world: SampleWorld): [RegExp, (match: string[], query: string) => unknown][] {
	const project = (id: string) => world.projects.find((candidate) => candidate.id === id);
	return [
		[
			/^\/api\/projects$/,
			(_, query) =>
				world.projects.filter((item) => nameHas(item.name, query)).map((item) => item.id)
		],
		[
			/^\/api\/projects\/([^/]+)\/planner$/,
			([, id]) => worldAgent(world, { project: id, lane: null })
		],
		[
			/^\/api\/projects\/([^/]+)\/questions\/([^/]+)$/,
			([, id, question]) => worldQuestion(world, id, question)
		],
		[
			/^\/api\/projects\/([^/]+)\/lanes$/,
			([, id], query) =>
				project(id)
					?.lanes.filter((item) => nameHas(item.name, query))
					.map((item) => item.id)
		],
		[
			/^\/api\/projects\/([^/]+)\/lanes\/([^/]+)\/babysitter$/,
			([, id, lane]) => worldAgent(world, { project: id, lane })
		],
		[/^\/api\/projects\/([^/]+)\/lanes\/([^/]+)$/, ([, id, lane]) => worldLane(world, id, lane)]
	];
}

function stream(route: Route, world: SampleWorld) {
	return route.fulfill({
		status: 200,
		headers: { 'content-type': 'text/event-stream' },
		body: `event: state\ndata: ${JSON.stringify(summarize(world))}\n\n`
	});
}

function reply(route: Route, url: URL, table: ReturnType<typeof answers>) {
	const query = url.searchParams.get('q') ?? '';
	for (const [pattern, handle] of table) {
		const match = url.pathname.match(pattern);
		if (match) return route.fulfill({ json: handle(match.map(decodeURIComponent), query) ?? null });
	}
	return route.fulfill({ status: 404 });
}

async function serve(page: Page, world: SampleWorld) {
	const table = answers(world);
	await page.route(
		(url) => url.pathname.startsWith('/api/'),
		(route) => {
			const url = new URL(route.request().url());
			return url.pathname === '/api/stream' ? stream(route, world) : reply(route, url, table);
		}
	);
}

test('two notes with the same time and text both show', async ({ page }) => {
	const world = sampleWorld(Date.now());
	const api = world.projects[0].lanes.find((lane) => lane.name === 'api')!;
	const note = { at: new Date().toISOString(), kind: 'stuck', text: 'tenbox check failed' };
	api.babysitter.notes = [note, { ...note }];
	await serve(page, world);
	await page.goto('/projects/sample/lanes/api');
	await page
		.getByRole('button', { name: /^Babysitter of api/ })
		.first()
		.click();
	await page.getByRole('button', { name: 'Notes of the babysitter' }).click();
	await expect(page.locator('.notes li')).toHaveCount(2);
});

test('a plan change closes in a project with no lanes yet', async ({ page }, info) => {
	test.skip(info.project.name === 'phone', 'the desk only');
	const world = sampleWorld(Date.now());
	const [sample, empty] = world.projects;
	const question = sample.planner.questions.find((candidate) => candidate.id === 'Q16')!;
	empty.lanes = [];
	empty.planner.questions = [question];
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await serve(page, world);
	await page.goto(`/projects/${empty.id}/questions/Q16`);
	await page.getByRole('button', { name: 'Close' }).click();
	await expect(page).toHaveURL(new RegExp(`/projects/${empty.id}$`));
	expect(errors).toEqual([]);
});

test('a lane that does not load says so and loads again on a retry', async ({ page }) => {
	await serve(page, sampleWorld(Date.now()));
	let fail = true;
	await page.route('**/api/projects/sample/lanes/api', (route) => {
		if (!fail) return route.fallback();
		fail = false;
		return route.fulfill({ status: 500 });
	});
	await page.goto('/projects/sample/lanes/api');
	await expect(page.getByRole('alert')).toHaveText(/Could not load the tasks of api/);
	await page.getByRole('button', { name: 'Try again' }).click();
	await expect(page.getByRole('list', { name: 'Tasks of api' })).toBeVisible();
});

test('a plan change comes from the server', async ({ page }) => {
	await serve(page, sampleWorld(Date.now()));
	const asked = page.waitForRequest((request) =>
		request.url().endsWith('/api/projects/sample/questions/Q16')
	);
	await page.goto('/projects/sample/questions/Q16');
	await asked;
	await expect(page.getByRole('region', { name: 'New lane search-index' })).toBeVisible();
});
