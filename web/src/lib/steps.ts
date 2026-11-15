import { STEP_NAMES, type StepName, type StepRun, type Task, TaskState } from './api/types.ts';
import { stepTime } from './format.ts';
import { currentStep, runMinutes } from './model.ts';

export const StepMark = {
	Running: 'running',
	Asking: 'asking',
	Offline: 'offline',
	Done: 'done',
	Later: 'later',
	Unused: 'unused'
} as const;
export type StepMark = (typeof StepMark)[keyof typeof StepMark];

const ICON_COLOR: Record<StepMark, string> = {
	[StepMark.Running]: 'var(--on-running)',
	[StepMark.Asking]: 'var(--ink)',
	[StepMark.Done]: 'var(--muted-soft)',
	[StepMark.Offline]: 'var(--mark)',
	[StepMark.Later]: 'var(--mark)',
	[StepMark.Unused]: 'var(--mark)'
};

const STATUS_WORDS: Partial<Record<StepMark, string>> = {
	[StepMark.Running]: ' running',
	[StepMark.Asking]: ' waiting',
	[StepMark.Offline]: ', last known'
};

export const iconColor = (mark: StepMark) => ICON_COLOR[mark];

export const statusWords = (mark: StepMark) => STATUS_WORDS[mark] ?? '';

export function currentMark(task: Task, offline: boolean): StepMark {
	if (offline) return StepMark.Offline;
	if (task.state === TaskState.Asking) return StepMark.Asking;
	return StepMark.Running;
}

export function reachedIndex(task: Task): number {
	if (task.state === TaskState.Done) return STEP_NAMES.length;
	const run = currentStep(task);
	if (!run) return -1;
	return STEP_NAMES.indexOf(run.step);
}

export interface StepPlace {
	name: StepName;
	mark: StepMark;
	time: string | null;
	minutes: number | null;
}

interface PlaceFacts {
	used: boolean;
	now: StepRun | undefined;
	finished: StepRun | undefined;
	passed: boolean;
	asking: boolean;
}

function placeMark({ used, now, finished, passed, asking }: PlaceFacts): StepMark {
	if (!used) return StepMark.Unused;
	if (now) return asking ? StepMark.Asking : StepMark.Running;
	if (finished || passed) return StepMark.Done;
	return StepMark.Later;
}

function placeTime(used: boolean, minutes: number | null): string | null {
	if (!used) return null;
	if (minutes === null) return '–';
	return stepTime(minutes);
}

export function stepPlaces(task: Task, steps: StepName[], now: number): StepPlace[] {
	const run = currentStep(task);
	const reached = reachedIndex(task);
	return STEP_NAMES.map((name, index) => {
		const facts: PlaceFacts = {
			used: steps.includes(name),
			now: run?.step === name ? run : undefined,
			finished: task.steps.find((step) => step.step === name && step.endedAt !== null),
			passed: index < reached,
			asking: task.state === TaskState.Asking
		};
		const timed = facts.now ?? facts.finished;
		const minutes = timed ? runMinutes(timed, now) : null;
		return { name, mark: placeMark(facts), time: placeTime(facts.used, minutes), minutes };
	});
}

export function placeLabel(place: StepPlace): string {
	if (place.mark === StepMark.Unused) return `${place.name} not used here`;
	if (place.minutes === null) return `${place.name} not started`;
	return `${place.name} ${place.minutes} min${statusWords(place.mark)}`;
}
