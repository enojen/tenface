import { minutesBetween } from './format.ts';
import type { Lane, Project, StepRun, Task } from './api/types.ts';

export interface Trio {
	done: number;
	running: number;
	waiting: number;
}

/** Tasks that wait for the owner are counted on the agent's ring, not here. */
export function taskTrio(tasks: Task[]): Trio {
	return {
		done: tasks.filter((task) => task.state === 'done').length,
		running: tasks.filter((task) => task.state === 'running').length,
		waiting: tasks.filter((task) => task.state === 'todo').length
	};
}

export function laneState(lane: Lane): keyof Trio {
	if (lane.tasks.some((task) => task.state === 'running')) return 'running';
	if (lane.tasks.length > 0 && lane.tasks.every((task) => task.state === 'done')) return 'done';
	return 'waiting';
}

export function laneTrio(lanes: Lane[]): Trio {
	const trio: Trio = { done: 0, running: 0, waiting: 0 };
	for (const lane of lanes) trio[laneState(lane)] += 1;
	return trio;
}

export const trioLabel = (trio: Trio, noun = '') =>
	`${noun}${trio.done} done, ${trio.running} running, ${trio.waiting} waiting`;

export function currentStep(task: Task): StepRun | null {
	if (task.state === 'done' || task.state === 'todo') return null;
	return task.steps.find((run) => run.endedAt === null) ?? null;
}

export const runMinutes = (run: StepRun, now: number) =>
	minutesBetween(run.startedAt, run.endedAt ? Date.parse(run.endedAt) : now);

export const totalMinutes = (task: Task, now: number) =>
	task.steps.reduce((sum, run) => sum + runMinutes(run, now), 0);

export function askers(project: Project) {
	return {
		planner: project.planner.questions.length,
		babysitters: project.lanes.reduce((sum, lane) => sum + lane.babysitter.questions.length, 0)
	};
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export function askersLabel(planner: number, babysitters: number): string {
	const parts = [
		planner > 0 ? `${planner} from the planner` : '',
		babysitters > 0 ? `${babysitters} from the ${babysitters === 1 ? 'babysitter' : 'babysitters'}` : ''
	].filter(Boolean);
	if (parts.length === 0) return 'no open questions';
	return `${plural(planner + babysitters, 'open question')}: ${parts.join(', ')}`;
}

export const findLane = (project: Project, id: string) => project.lanes.find((lane) => lane.id === id);

export function findQuestion(project: Project, id: string) {
	const all = [project.planner, ...project.lanes.map((lane) => lane.babysitter)];
	for (const agent of all) {
		const question = agent.questions.find((candidate) => candidate.id === id);
		if (question) return question;
	}
	return undefined;
}
