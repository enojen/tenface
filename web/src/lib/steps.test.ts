import { describe, expect, it } from 'vitest';
import { sampleWorld } from './api/sample.ts';
import { currentMark, placeLabel, rowStep, StepMark, stepPlaces } from './steps.ts';

const now = Date.parse('2026-11-15T12:00:00Z');
const project = sampleWorld(now).projects[0];
const api = project.lanes[0];
const byId = (id: string) => api.tasks.find((task) => task.id === id) ?? api.tasks[0];

describe('steps', () => {
	it('marks the step a task waits in, and the steps a project skips', () => {
		const places = stepPlaces(byId('SAM-102'), project.steps, now);
		expect(places.map((place) => place.mark)).toEqual([
			StepMark.Done,
			StepMark.Done,
			StepMark.Done,
			StepMark.Unused,
			StepMark.Unused,
			StepMark.Done,
			StepMark.Asking,
			StepMark.Later
		]);
		expect(places.map(placeLabel).slice(-2)).toEqual(['merge 12 min waiting', 'close not started']);
	});

	it('shows offline before any other state', () => {
		expect(currentMark(byId('SAM-102'), true)).toBe(StepMark.Offline);
		expect(currentMark(byId('SAM-103'), false)).toBe(StepMark.Running);
	});
});

describe('rowStep', () => {
	it('names the open step and its time', () => {
		expect(rowStep(byId('SAM-103'), now)).toEqual({
			word: 'build',
			time: expect.stringMatching(/^\d+m$/),
			label: expect.stringMatching(/^build \d+ min running$/)
		});
	});

	it('says the time is the last known one when the panel is offline', () => {
		expect(rowStep(byId('SAM-103'), now, true).label).toMatch(/^build \d+ min, last known$/);
	});

	it('says done for a closed task and waiting for a task that has not started', () => {
		expect(rowStep(byId('SAM-101'), now)).toEqual({ word: 'done', time: '', label: 'done' });
		expect(rowStep(byId('SAM-106'), now)).toEqual({ word: 'waiting', time: '', label: 'waiting' });
	});
});
