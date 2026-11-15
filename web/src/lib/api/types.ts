// The contract with the server. Later these types come from the Rust server.

// Each set of states is a const object: code writes TaskState.Done, the JSON carries 'done'.

export const Step = {
	Plan: 'plan',
	Approve: 'approve',
	Build: 'build',
	Debug: 'debug',
	Eval: 'eval',
	PR: 'PR',
	Merge: 'merge',
	Close: 'close'
} as const;
export type StepName = (typeof Step)[keyof typeof Step];
/** Every step in its order. */
export const STEP_NAMES: readonly StepName[] = Object.values(Step);

export interface State {
	projects: Project[];
}

export interface Project {
	id: string;
	name: string;
	steps: StepName[];
	planner: Agent;
	lanes: Lane[];
}

export interface Lane {
	id: string;
	name: string;
	description: string;
	babysitter: Agent;
	tasks: Task[];
}

export const TaskState = {
	Todo: 'todo',
	Running: 'running',
	Asking: 'asking',
	Done: 'done'
} as const;
export type TaskState = (typeof TaskState)[keyof typeof TaskState];

export interface Task {
	id: string;
	title: string;
	parent: string | null;
	state: TaskState;
	tracker: { status: string; url: string };
	pr: { number: number; url: string } | null;
	steps: StepRun[];
	note: string;
}

export interface StepRun {
	step: StepName;
	startedAt: string;
	endedAt: string | null;
}

export const AgentRole = { Planner: 'planner', Babysitter: 'babysitter' } as const;
export type AgentRole = (typeof AgentRole)[keyof typeof AgentRole];

export interface Agent {
	role: AgentRole;
	working: boolean;
	context: { used: number; limit: number };
	chatUrl: string;
	handoverPrompt: string;
	questions: Question[];
	notes: Note[];
}

export interface Question {
	id: string;
	topic: string;
	openedAt: string;
	task: string | null;
	lane: string | null;
	change: PlanChange | null;
}

export interface Note {
	at: string;
	kind: string;
	text: string;
}

export const PlanSign = { Added: '+', Removed: '−', Moved: '→', Changed: '~' } as const;
export type PlanSign = (typeof PlanSign)[keyof typeof PlanSign];

export interface PlanNode {
	ref: string;
	title: string;
	sign: PlanSign | null;
	note: string | null;
	old: string | null;
	children: PlanNode[];
}

export interface PlanTree {
	lane: string;
	isNew: boolean;
	waits: string | null;
	roots: PlanNode[];
}

export interface PlanChange {
	reason: string;
	trees: PlanTree[];
}

export type Connection = { online: true } | { online: false; since: string };

export interface Api {
	subscribe(
		onState: (state: State) => void,
		onConnection: (connection: Connection) => void
	): () => void;
}
