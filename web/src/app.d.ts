import type { AgentRole } from '#lib/api/types.ts';

declare global {
	namespace App {
		interface PageState {
			agent?: AgentRole;
		}
	}
}
