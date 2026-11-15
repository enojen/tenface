export const StepMark = {
	Running: 'running',
	Asking: 'asking',
	Offline: 'offline',
	Done: 'done',
	Later: 'later',
	Unused: 'unused'
} as const;
export type StepMark = (typeof StepMark)[keyof typeof StepMark];
