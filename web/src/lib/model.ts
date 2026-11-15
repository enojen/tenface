import {
	LaneState,
	type LaneSummary,
	type Project,
	type StepRun,
	type Task,
	TaskState,
	type Trio
} from './api/types.ts';
import { minutesBetween } from './format.ts';

export function taskTrio(tasks: Task[]): Trio {
	return {
		[LaneState.Done]: tasks.filter((task) => task.state === TaskState.Done).length,
		[LaneState.Running]: tasks.filter((task) => task.state === TaskState.Running).length,
		[LaneState.Waiting]: tasks.filter((task) => task.state === TaskState.Todo).length
	};
}

export function tasksState(tasks: Task[]): LaneState {
	if (tasks.some((task) => task.state === TaskState.Running)) return LaneState.Running;
	if (tasks.length > 0 && tasks.every((task) => task.state === TaskState.Done))
		return LaneState.Done;
	return LaneState.Waiting;
}

export const projectRunning = (lanes: LaneSummary[]) =>
	lanes.some((lane) => lane.state === LaneState.Running);

export const tasksRunning = (count: number) => `${count} ${count === 1 ? 'task' : 'tasks'} running`;

const TRIO_ORDER = [LaneState.Running, LaneState.Waiting, LaneState.Done];

export const trioParts = (trio: Trio) =>
	TRIO_ORDER.filter((state) => trio[state] > 0).map((state) => ({ state, count: trio[state] }));

export function currentStep(task: Task): StepRun | null {
	if (task.state === TaskState.Done || task.state === TaskState.Todo) return null;
	return task.steps.find((run) => run.endedAt === null) ?? null;
}

export const runMinutes = (run: StepRun, now: number) =>
	minutesBetween(run.startedAt, run.endedAt ? Date.parse(run.endedAt) : now);

export const totalMinutes = (task: Task, now: number) =>
	task.steps.reduce((sum, run) => sum + runMinutes(run, now), 0);

export function askers(project: Project) {
	return {
		planner: project.planner.questions,
		babysitters: project.lanes.reduce((sum, lane) => sum + lane.babysitter.questions, 0)
	};
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export function askersLabel(planner: number, babysitters: number): string {
	const parts = [
		planner > 0 ? `${planner} from the planner` : '',
		babysitters > 0
			? `${babysitters} from the ${babysitters === 1 ? 'babysitter' : 'babysitters'}`
			: ''
	].filter(Boolean);
	if (parts.length === 0) return 'no open questions';
	return `${plural(planner + babysitters, 'open question')}: ${parts.join(', ')}`;
}

export const nameMatches = (name: string, query: string) =>
	name.toLowerCase().includes(query.trim().toLowerCase());

export const lastPage = (total: number, size: number) => Math.max(0, Math.ceil(total / size) - 1);

export const findLane = (project: Project, id: string) =>
	project.lanes.find((lane) => lane.id === id);
