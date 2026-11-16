import { describe, expect, it } from 'vitest';
import { sampleWorld } from './api/sample.ts';
import { currentMark, rowStep, StepMark, stepLabel, stepName, stepRows } from './steps.ts';

const now = Date.parse('2026-11-15T12:00:00Z');
const project = sampleWorld(now).projects[0];
const api = project.lanes[0];
const byId = (id: string) => api.tasks.find((task) => task.id === id) ?? api.tasks[0];

describe('stepRows', () => {
	const rows = stepRows(byId('SAM-102'), project.steps, now);

	it('lists the runs in the order they ran, and numbers a step that ran again', () => {
		expect(rows.map(stepName)).toEqual([
			'plan',
			'approve',
			'build',
			'debug',
			'eval',
			'PR',
			'build #2',
			'merge',
			'close'
		]);
	});

	it('marks the step a task waits in, the steps a project skips and the steps to come', () => {
		expect(rows.map((row) => row.mark)).toEqual([
			StepMark.Done,
			StepMark.Done,
			StepMark.Done,
			StepMark.Unused,
			StepMark.Unused,
			StepMark.Done,
			StepMark.Done,
			StepMark.Asking,
			StepMark.Later
		]);
	});

	it('says each row aloud with its time and start', () => {
		expect(stepLabel(rows[7])).toMatch(/^merge 12 min waiting, started \d\d:\d\d$/);
		expect(stepLabel(rows[3])).toBe('debug not used here');
		expect(stepLabel(rows[8])).toBe('close not started');
	});
});

describe('steps', () => {
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
