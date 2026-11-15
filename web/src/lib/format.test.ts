import { describe, expect, it } from 'vitest';
import { clock, minutesBetween, stepTime, waitTime } from './format.ts';

describe('times', () => {
	it('writes a step time short', () => {
		expect([0, 7, 59, 60, 63, 125].map(stepTime)).toEqual([
			'0m',
			'7m',
			'59m',
			'1h00',
			'1h03',
			'2h05'
		]);
	});

	it('writes a waiting time in words', () => {
		expect([41, 60, 125].map(waitTime)).toEqual(['41 min', '1 h', '2 h 5 min']);
	});

	it('writes only the time for today', () => {
		const now = new Date(2026, 10, 15, 14, 0).getTime();
		expect(clock(new Date(2026, 10, 15, 11, 2).toISOString(), now)).toBe('11:02');
		expect(clock(new Date(2026, 10, 13, 20, 30).toISOString(), now)).toBe('Nov 13, 20:30');
	});

	it('never counts minutes below zero', () => {
		expect(minutesBetween(new Date(2000).toISOString(), 1000)).toBe(0);
	});
});
