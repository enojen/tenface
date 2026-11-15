import type { Project, Question } from '#lib/api/types.ts';
import { findLane, findQuestion } from '#lib/model.ts';

export interface DeskView {
	laneId: string | null;
	taskId: string | null;
	question: Question | null;
}

interface Params {
	lane?: string;
	question?: string;
}

function questionOf(project: Project, id: string | undefined) {
	if (id === undefined) return null;
	const question = findQuestion(project, id);
	return question?.change ? question : undefined;
}

export function deskView(
	project: Project,
	params: Params,
	url: { searchParams: { get(name: string): string | null } }
): DeskView | null {
	if (params.lane !== undefined && !findLane(project, params.lane)) return null;
	const question = questionOf(project, params.question);
	if (question === undefined) return null;
	return {
		laneId: params.lane ?? url.searchParams.get('lane'),
		taskId: url.searchParams.get('task'),
		question
	};
}
