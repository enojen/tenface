// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** The agent whose card was open, so that back opens it again. */
			agent?: 'planner' | 'babysitter';
		}
		// interface Platform {}
	}
}

export {};
