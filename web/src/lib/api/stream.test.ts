import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStreamApi } from './stream.ts';
import type { Connection, State } from './types.ts';

class FakeSource {
	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSED = 2;
	static made: FakeSource[] = [];
	readyState = FakeSource.CONNECTING;
	onopen: (() => void) | null = null;
	onerror: (() => void) | null = null;
	listeners: ((event: { data: string }) => void)[] = [];
	constructor(public url: string) {
		FakeSource.made.push(this);
	}
	addEventListener(_type: string, listener: (event: { data: string }) => void) {
		this.listeners.push(listener);
	}
	close() {
		this.readyState = FakeSource.CLOSED;
	}
	send(data: string) {
		for (const listener of this.listeners) listener({ data });
	}
}

describe('the stream', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		FakeSource.made = [];
		vi.stubGlobal('EventSource', FakeSource);
	});
	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('opens a new stream when the browser gives up', () => {
		const connections: Connection[] = [];
		createStreamApi('/events').subscribe(
			() => {},
			(connection) => connections.push(connection)
		);
		const first = FakeSource.made[0];
		first.readyState = FakeSource.CLOSED;
		first.onerror!();
		expect(connections.map((c) => c.online)).toEqual([false]);
		vi.advanceTimersByTime(1_000);
		expect(FakeSource.made).toHaveLength(2);
		FakeSource.made[1].onopen!();
		expect(connections.map((c) => c.online)).toEqual([false, true]);
	});

	it('leaves a retry of the browser to the browser', () => {
		createStreamApi('/events').subscribe(
			() => {},
			() => {}
		);
		FakeSource.made[0].onerror!();
		vi.advanceTimersByTime(60_000);
		expect(FakeSource.made).toHaveLength(1);
	});

	it('skips a broken event and keeps the next one', () => {
		const states: State[] = [];
		createStreamApi('/events').subscribe(
			(state) => states.push(state),
			() => {}
		);
		FakeSource.made[0].send('{broken');
		FakeSource.made[0].send('{"projects":[]}');
		expect(states).toEqual([{ projects: [] }]);
	});

	it('stops retrying after unsubscribe', () => {
		const stop = createStreamApi('/events').subscribe(
			() => {},
			() => {}
		);
		FakeSource.made[0].readyState = FakeSource.CLOSED;
		FakeSource.made[0].onerror!();
		stop();
		vi.advanceTimersByTime(60_000);
		expect(FakeSource.made).toHaveLength(1);
	});
});
