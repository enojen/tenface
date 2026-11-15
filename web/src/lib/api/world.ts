import { tasksState, taskTrio } from '../model.ts';
import type { SampleLane, SampleProject, SampleWorld } from './sample.ts';
import type {
	Agent,
	AgentSource,
	AgentSummary,
	Lane,
	LaneSummary,
	Question,
	State
} from './types.ts';

const agentSummary = (agent: Agent): AgentSummary => ({
	role: agent.role,
	working: agent.working,
	context: agent.context,
	questions: agent.questions.length
});

const laneSummary = (lane: SampleLane): LaneSummary => ({
	id: lane.id,
	name: lane.name,
	description: lane.description,
	state: tasksState(lane.tasks),
	trio: taskTrio(lane.tasks),
	babysitter: agentSummary(lane.babysitter)
});

export function summarize(world: SampleWorld): State {
	return {
		projects: world.projects.map((project) => ({
			id: project.id,
			name: project.name,
			steps: project.steps,
			planner: agentSummary(project.planner),
			lanes: project.lanes.map(laneSummary)
		}))
	};
}

const projectOf = (world: SampleWorld, id: string) =>
	world.projects.find((project) => project.id === id);

const laneOf = (project: SampleProject | undefined, id: string | null) =>
	project?.lanes.find((lane) => lane.id === id);

export function worldLane(world: SampleWorld, project: string, lane: string): Lane | undefined {
	const found = laneOf(projectOf(world, project), lane);
	return found && { id: found.id, name: found.name, tasks: found.tasks };
}

export function worldAgent(world: SampleWorld, source: AgentSource): Agent | undefined {
	const project = projectOf(world, source.project);
	if (source.lane === null) return project?.planner;
	return laneOf(project, source.lane)?.babysitter;
}

export function worldQuestion(
	world: SampleWorld,
	project: string,
	id: string
): Question | undefined {
	const owner = projectOf(world, project);
	const agents = owner ? [owner.planner, ...owner.lanes.map((lane) => lane.babysitter)] : [];
	return agents.flatMap((agent) => agent.questions).find((question) => question.id === id);
}
