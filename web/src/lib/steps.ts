import { STEP_NAMES, type StepName, type StepRun, type Task, TaskState } from './api/types.ts';
import { clock, stepTime } from './format.ts';
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

const STATUS_WORDS: Partial<Record<StepMark, string>> = {
	[StepMark.Running]: ' running',
	[StepMark.Asking]: ' waiting',
	[StepMark.Offline]: ', last known'
};

const statusWords = (mark: StepMark) => STATUS_WORDS[mark] ?? '';

export function currentMark(task: Task, offline: boolean): StepMark {
	if (offline) return StepMark.Offline;
	if (task.state === TaskState.Asking) return StepMark.Asking;
	return StepMark.Running;
}

function reachedIndex(task: Task): number {
	if (task.state === TaskState.Done) return STEP_NAMES.length;
	const run = currentStep(task);
	if (!run) return -1;
	return STEP_NAMES.indexOf(run.step);
}

export interface StepRow {
	name: StepName;
	run: number;
	mark: StepMark;
	started: string | null;
	time: string | null;
	minutes: number | null;
}

const order = (name: StepName) => STEP_NAMES.indexOf(name);

function runRows(task: Task, now: number): StepRow[] {
	const current = currentStep(task);
	const counts = new Map<StepName, number>();
	const runs = [...task.steps].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
	return runs.map((run: StepRun) => {
		const count = (counts.get(run.step) ?? 0) + 1;
		counts.set(run.step, count);
		const minutes = runMinutes(run, now);
		return {
			name: run.step,
			run: count,
			mark: run === current ? currentMark(task, false) : StepMark.Done,
			started: clock(run.startedAt, now),
			time: stepTime(minutes),
			minutes
		};
	});
}

function idleMark(name: StepName, steps: StepName[], reached: number): StepMark {
	if (!steps.includes(name)) return StepMark.Unused;
	return order(name) < reached ? StepMark.Done : StepMark.Later;
}

function idleRow(name: StepName, steps: StepName[], reached: number): StepRow {
	const mark = idleMark(name, steps, reached);
	return {
		name,
		run: 1,
		mark,
		started: null,
		time: mark === StepMark.Unused ? null : '–',
		minutes: null
	};
}

function insertAt(rows: StepRow[], name: StepName): number {
	const after = rows.findIndex((row) => order(row.name) > order(name));
	return after === -1 ? rows.length : after;
}

export function stepRows(task: Task, steps: StepName[], now: number): StepRow[] {
	const rows = runRows(task, now);
	const reached = reachedIndex(task);
	for (const name of STEP_NAMES) {
		if (rows.some((row) => row.name === name)) continue;
		rows.splice(insertAt(rows, name), 0, idleRow(name, steps, reached));
	}
	return rows;
}

export const stepName = (row: StepRow) => (row.run > 1 ? `${row.name} #${row.run}` : row.name);

function idleLabel(row: StepRow): string {
	if (row.mark === StepMark.Unused) return 'not used here';
	return row.mark === StepMark.Done ? 'skipped' : 'not started';
}

export function stepLabel(row: StepRow): string {
	if (row.minutes === null) return `${stepName(row)} ${idleLabel(row)}`;
	return `${stepName(row)} ${row.minutes} min${statusWords(row.mark)}, started ${row.started}`;
}

export interface RowStep {
	word: string;
	time: string;
	label: string;
}

const restingStep = (word: string): RowStep => ({ word, time: '', label: word });

export function rowStep(task: Task, now: number, offline = false): RowStep {
	if (task.state === TaskState.Done) return restingStep('done');
	const run = currentStep(task);
	if (!run) return restingStep('waiting');
	const minutes = runMinutes(run, now);
	const label = `${run.step} ${minutes} min${statusWords(currentMark(task, offline))}`;
	return { word: run.step, time: stepTime(minutes), label };
}
