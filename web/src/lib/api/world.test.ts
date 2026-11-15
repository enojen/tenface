import { describe, expect, it } from 'vitest';
import { sampleWorld } from './sample.ts';
import { summarize, worldLane, worldQuestion } from './world.ts';

const world = sampleWorld(Date.parse('2026-11-15T12:00:00Z'));

describe('the summary the stream sends', () => {
	it('carries no tasks, questions or notes', () => {
		const text = JSON.stringify(summarize(world));
		for (const key of ['"tasks"', '"notes"', '"chatUrl"', '"handoverPrompt"', '"change"']) {
			expect(text).not.toContain(key);
		}
	});

	it('counts the trio, the lane state and the open questions', () => {
		const sample = summarize(world).projects[0];
		const api = sample.lanes.find((lane) => lane.id === 'api');
		expect(api?.trio).toEqual({ done: 1, running: 1, waiting: 5 });
		expect(api?.state).toBe('running');
		expect(api?.babysitter.questions).toBe(1);
		expect(sample.planner.questions).toBe(1);
	});

	it('is a small part of the whole sample', () => {
		const summary = JSON.stringify(summarize(world)).length;
		expect(summary * 2).toBeLessThan(JSON.stringify(world).length);
	});
});

describe('the answers to a request', () => {
	it('gives a lane its tasks and a question its plan change', () => {
		expect(worldLane(world, 'sample', 'api')?.tasks).toHaveLength(8);
		expect(worldQuestion(world, 'sample', 'Q16')?.change?.trees).toHaveLength(2);
		expect(worldLane(world, 'sample', 'nope')).toBeUndefined();
	});
});
