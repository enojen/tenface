// The contract with the server. Later these types come from the Rust server.

export const STEP_NAMES = ['plan', 'approve', 'build', 'debug', 'eval', 'PR', 'merge', 'close'] as const;
export type StepName = (typeof STEP_NAMES)[number];

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

export type TaskState = 'todo' | 'running' | 'asking' | 'done';

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

export type AgentRole = 'planner' | 'babysitter';

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

export type PlanSign = '+' | '−' | '→' | '~';

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
	subscribe(onState: (state: State) => void, onConnection: (connection: Connection) => void): () => void;
}
