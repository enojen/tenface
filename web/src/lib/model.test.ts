import { describe, expect, it } from 'vitest';
import { sampleWorld } from './api/sample.ts';
import { summarize } from './api/world.ts';
import {
	askers,
	askersLabel,
	laneTrio,
	lastPage,
	nameMatches,
	tasksState,
	taskTrio
} from './model.ts';

const world = () => sampleWorld(Date.parse('2026-11-15T12:00:00Z'));
const project = () => world().projects[0];
const summary = () => summarize(world()).projects[0];

describe('the trio', () => {
	it('counts the api lane of the design as 1 done, 1 running, 5 waiting', () => {
		const api = project().lanes.find((lane) => lane.id === 'api')!;
		expect(taskTrio(api.tasks)).toEqual({ done: 1, running: 1, waiting: 5 });
	});

	it('gives a lane one state', () => {
		const lanes = project().lanes;
		expect(tasksState(lanes.find((lane) => lane.id === 'docs')!.tasks)).toBe('done');
		expect(tasksState(lanes.find((lane) => lane.id === 'api')!.tasks)).toBe('running');
		expect(laneTrio(summary().lanes)).toEqual({ done: 2, running: 4, waiting: 4 });
	});
});

describe('who asks', () => {
	it('names the planner and the babysitters apart', () => {
		const { planner, babysitters } = askers(summary());
		expect(askersLabel(planner, babysitters)).toBe(
			'2 open questions: 1 from the planner, 1 from the babysitter'
		);
		expect(askersLabel(0, 2)).toBe('2 open questions: 2 from the babysitters');
		expect(askersLabel(0, 0)).toBe('no open questions');
	});
});

describe('search', () => {
	it('finds a name whatever its case', () => {
		expect(nameMatches('Billing', ' bil')).toBe(true);
		expect(nameMatches('api', 'API')).toBe(true);
		expect(nameMatches('docs', 'web')).toBe(false);
	});
});

describe('pages', () => {
	it('keeps the last page in range when a list gets shorter', () => {
		expect([0, 3, 4, 6, 7].map((total) => lastPage(total, 3))).toEqual([0, 0, 1, 1, 2]);
	});
});
