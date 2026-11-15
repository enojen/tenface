import type { Question } from '#lib/api/types.ts';

export const homeUrl = '/';

export const projectUrl = (project: string) => `/projects/${project}`;
export const laneUrl = (project: string, lane: string) => `/projects/${project}/lanes/${lane}`;
export const taskUrl = (project: string, lane: string, task: string) =>
	`${laneUrl(project, lane)}?task=${task}`;

export const questionUrl = (project: string, lane: string | null) => (question: Question) =>
	`/projects/${project}/questions/${question.id}${lane ? `?lane=${lane}` : ''}`;
