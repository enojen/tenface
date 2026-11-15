import { describe, expect, it } from 'vitest';
import { sampleWorld } from '../api/sample.ts';
import { summarize } from '../api/world.ts';
import { deskView } from './desk-view.ts';

const project = summarize(sampleWorld(Date.parse('2026-11-15T12:00:00Z'))).projects[0];
const url = (path: string) => new URL(`http://panel${path}`);

describe('the desk view of a url', () => {
	it('reads the lane, the task and the plan change', () => {
		expect(
			deskView(project, { lane: 'api' }, url('/projects/sample/lanes/api?task=SAM-102'))
		).toEqual({
			laneId: 'api',
			taskId: 'SAM-102',
			questionId: null
		});
		expect(
			deskView(project, { question: 'Q16' }, url('/projects/sample/questions/Q16?lane=web'))
		).toEqual({
			laneId: 'web',
			taskId: null,
			questionId: 'Q16'
		});
	});

	it('leaves an unknown lane to the page', () => {
		expect(deskView(project, { lane: 'nope' }, url('/projects/sample/lanes/nope'))).toBeNull();
	});
});
