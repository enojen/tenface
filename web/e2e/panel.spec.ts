import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

const phone = (name: string) => name === 'phone';

async function noSideScroll(page: Page) {
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
	expect(overflow).toBeLessThanOrEqual(0);
}

/** Drags with touch events, as a finger does on the phone. */
async function swipe(page: Page, selector: string, from: number, to: number) {
	await page.evaluate(
		({ selector, from, to }) => {
			const target = document.querySelector(selector)!;
			// WebKit has no Touch constructor, so the events carry plain touch points.
			const send = (type: string, y: number) => {
				const event = new Event(type, { bubbles: true, cancelable: true });
				const points = type === 'touchend' ? [] : [{ identifier: 1, clientX: 195, clientY: y }];
				Object.defineProperty(event, 'touches', { value: points });
				target.dispatchEvent(event);
			};
			send('touchstart', from);
			for (let step = 1; step <= 6; step++) send('touchmove', from + ((to - from) * step) / 6);
			send('touchend', to);
		},
		{ selector, from, to }
	);
}

test('projects list the lanes as a trio and who asks', async ({ page }) => {
	await page.goto('/projects');
	const sample = page.getByRole('link', { name: /^sample\b/ });
	await expect(sample).toHaveAccessibleName(
		/^sample , lanes: 2 done, 4 running, 4 waiting , 2 open questions: 1 from the planner, 1 from the babysitter$/
	);
	await page.getByRole('searchbox', { name: 'Search projects' }).fill('shop');
	await expect(page.getByRole('link', { name: /^demo-shop\b/ })).toBeVisible();
	await expect(sample).toBeHidden();
	await noSideScroll(page);
});

test('a task opens from the tree and closes again', async ({ page }, info) => {
	await page.goto('/projects/sample/lanes/api');
	await page.getByRole('link', { name: /Paginate the orders list/ }).click();
	await expect(page).toHaveURL(/\?task=SAM-102$/);
	const detail = phone(info.project.name)
		? page.getByRole('dialog', { name: 'Task SAM-102' })
		: page.getByRole('complementary', { name: 'Task SAM-102' });
	await expect(detail.getByRole('img', { name: /^Steps: plan 7 min/ })).toBeVisible();
	await expect(detail.getByRole('link', { name: 'PR #418 on GitHub' })).toHaveAttribute(
		'href',
		/418/
	);
	if (phone(info.project.name)) await page.keyboard.press('Escape');
	else await detail.getByRole('button', { name: 'Close' }).click();
	await expect(page).toHaveURL(/\/lanes\/api$/);
	await noSideScroll(page);
});

test('a pull down closes the task sheet', async ({ page }, info) => {
	test.skip(!phone(info.project.name), 'the phone only');
	await page.goto('/projects/sample/lanes/api?task=SAM-102');
	await expect(page.getByRole('dialog', { name: 'Task SAM-102' })).toBeVisible();
	await swipe(page, 'dialog[open] .handle', 300, 330);
	await expect(page).toHaveURL(/\?task=SAM-102$/);
	await swipe(page, 'dialog[open] .handle', 300, 560);
	await expect(page).toHaveURL(/\/lanes\/api$/);
	await expect(page.getByRole('dialog', { name: 'Task SAM-102' })).toBeHidden();
});

test('back returns to the page before, without new history', async ({ page }, info) => {
	await page.goto('/projects');
	await page.getByRole('link', { name: /^sample\b/ }).click();
	await page.getByRole('link', { name: /^api\b/ }).click();
	await page.getByRole('link', { name: /Paginate the orders list/ }).click();
	await expect(page).toHaveURL(/\?task=SAM-102$/);
	const before = await page.evaluate(() => history.length);
	if (phone(info.project.name)) await page.keyboard.press('Escape');
	else await page.getByRole('button', { name: 'Close' }).click();
	await expect(page).toHaveURL(/\/lanes\/api$/);
	if (phone(info.project.name)) {
		await page.getByRole('link', { name: 'Back to sample' }).click();
		await expect(page).toHaveURL(/\/projects\/sample$/);
	}
	await page.getByRole('link', { name: 'Back to projects' }).click();
	await expect(page).toHaveURL(/\/projects$/);
	expect(await page.evaluate(() => history.length)).toBe(before);
	await page.goForward();
	await expect(page).toHaveURL(/\/projects\/sample/);
});

test('a direct link still has a way back', async ({ page }) => {
	await page.goto('/projects/sample/lanes/api');
	await page.getByRole('link', { name: /^Back to (sample|projects)$/ }).click();
	await expect(page).toHaveURL(/\/projects(\/sample)?$/);
});

test('offline keeps the last state under the strip', async ({ page }) => {
	await page.goto('/projects/sample/lanes/web?mock=offline');
	await expect(page.getByRole('status').first()).toContainText('Offline since');
	await expect(page.getByRole('img', { name: /build \d+ min, last known/ })).toBeVisible();
});

for (const url of ['/projects', '/projects/sample', '/projects/sample/lanes/api?task=SAM-102']) {
	test(`no serious accessibility problems on ${url}`, async ({ page }) => {
		await page.goto(url);
		await page.getByRole('main').first().waitFor();
		const result = await new AxeBuilder({ page }).analyze();
		const serious = result.violations.filter(
			(v) => v.impact === 'serious' || v.impact === 'critical'
		);
		expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`)).toEqual([]);
	});
}
