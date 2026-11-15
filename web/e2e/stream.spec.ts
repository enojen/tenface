import { expect, type Page, test } from '@playwright/test';
import { sampleState } from '../src/lib/api/sample.ts';
import type { State } from '../src/lib/api/types.ts';

test.use({ baseURL: 'http://localhost:4175' });

async function serve(page: Page, state: State) {
	await page.route('**/stream', (route) =>
		route.fulfill({
			status: 200,
			headers: { 'content-type': 'text/event-stream' },
			body: `event: state\ndata: ${JSON.stringify(state)}\n\n`
		})
	);
}

test('two notes with the same time and text both show', async ({ page }) => {
	const state = sampleState(Date.now());
	const api = state.projects[0].lanes.find((lane) => lane.name === 'api')!;
	const note = { at: new Date().toISOString(), kind: 'stuck', text: 'tenbox check failed' };
	api.babysitter.notes = [note, { ...note }];
	await serve(page, state);
	await page.goto('/projects/sample/lanes/api');
	await page
		.getByRole('button', { name: /^Babysitter of api/ })
		.first()
		.click();
	await page.getByRole('button', { name: 'Notes of the babysitter' }).click();
	await expect(page.locator('.notes li')).toHaveCount(2);
});
