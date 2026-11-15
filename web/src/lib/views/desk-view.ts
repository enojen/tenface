import type { Project } from '#lib/api/types.ts';
import { findLane } from '#lib/model.ts';

export interface DeskView {
	laneId: string | null;
	taskId: string | null;
	questionId: string | null;
}

interface Params {
	lane?: string;
	question?: string;
}

export function deskView(
	project: Project,
	params: Params,
	url: { searchParams: { get(name: string): string | null } }
): DeskView | null {
	if (params.lane !== undefined && !findLane(project, params.lane)) return null;
	return {
		laneId: params.lane ?? url.searchParams.get('lane'),
		taskId: url.searchParams.get('task'),
		questionId: params.question ?? null
	};
}
