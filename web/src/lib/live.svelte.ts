import { api } from './api/index.ts';
import type { Connection, State } from './api/types.ts';

/** The last known state of the server and the time, both live. */
class Live {
	// Raw: the panel never changes the state, so no deep proxies (less RAM).
	state = $state.raw<State | null>(null);
	connection = $state<Connection>({ online: true });
	now = $state(Date.now());

	start() {
		const stop = api.subscribe(
			(state) => (this.state = state),
			(connection) => (this.connection = connection)
		);
		const clock = setInterval(() => (this.now = Date.now()), 15_000);
		return () => {
			stop();
			clearInterval(clock);
		};
	}

	project(id: string) {
		return this.state?.projects.find((project) => project.id === id);
	}
}

export const live = new Live();

/** True on a screen wide enough for the three desktop columns. */
class Wide {
	value = $state(false);

	start() {
		const query = matchMedia('(min-width: 1024px)');
		const update = () => (this.value = query.matches);
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	}
}

export const wide = new Wide();
