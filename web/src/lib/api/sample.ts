import {
	type Agent,
	AgentRole,
	type PlanChange,
	PlanSign,
	Step,
	type StepName,
	type StepRun,
	type Task,
	TaskState
} from './types.ts';

const STEPS: StepName[] = [Step.Plan, Step.Approve, Step.Build, Step.PR, Step.Merge, Step.Close];

export interface SampleLane {
	id: string;
	name: string;
	description: string;
	babysitter: Agent;
	tasks: Task[];
}

export interface SampleProject {
	id: string;
	name: string;
	steps: StepName[];
	planner: Agent;
	lanes: SampleLane[];
}

export interface SampleWorld {
	projects: SampleProject[];
}

export function sampleWorld(now: number): SampleWorld {
	const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

	function runs(times: [StepName, number][], open: boolean, endAgo = 0): StepRun[] {
		let start = endAgo + times.reduce((sum, [, minutes]) => sum + minutes, 0);
		return times.map(([step, minutes], index) => {
			const run: StepRun = {
				step,
				startedAt: ago(start),
				endedAt: open && index === times.length - 1 ? null : ago(start - minutes)
			};
			start -= minutes;
			return run;
		});
	}

	const all: [StepName, number][] = [
		[Step.Plan, 9],
		[Step.Approve, 3],
		[Step.Build, 41],
		[Step.PR, 5],
		[Step.Merge, 8],
		[Step.Close, 1]
	];

	function task(
		id: string,
		title: string,
		parent: string | null,
		state: TaskState,
		rest: Partial<Task> = {}
	): Task {
		const status = {
			[TaskState.Todo]: 'to do',
			[TaskState.Running]: 'in progress',
			[TaskState.Asking]: 'in review',
			[TaskState.Done]: 'closed'
		}[state];
		return {
			id,
			title,
			parent,
			state,
			tracker: { status, url: `https://example.com/tracker/${id}` },
			pr: null,
			steps: state === TaskState.Done ? runs(all, false, 600) : [],
			note: '',
			...rest
		};
	}

	function agent(
		role: Agent['role'],
		working: boolean,
		used: number,
		rest: Partial<Agent> = {}
	): Agent {
		return {
			role,
			working,
			context: { used, limit: 200_000 },
			chatUrl: 'https://example.com/chat',
			handoverPrompt: `Hand over: write the state of your ${role === AgentRole.Planner ? 'project' : 'lane'} to the server, then end this session.`,
			questions: [],
			notes: [],
			...rest
		};
	}

	function chain(id: string, prefix: string, counts: [number, number, number]): Task[] {
		const states = [TaskState.Done, TaskState.Running, TaskState.Todo];
		const titles = [
			(index: number) => `Finished part ${index + 1} of ${id}`,
			() => `Current work in ${id}`,
			(index: number) => `Next part ${index + 1} of ${id}`
		];
		const made: Task[] = [];
		states.forEach((state, kind) => {
			for (let index = 0; index < counts[kind]; index++) {
				const number = made.length + 1;
				const parent = made.at(-1)?.id ?? null;
				made.push(task(`${prefix}-${number}`, titles[kind](index), parent, state));
			}
		});
		for (const [index, item] of made.entries()) {
			if (item.state !== TaskState.Running) continue;
			item.steps = runs(
				[
					[Step.Plan, 5],
					[Step.Approve, 2],
					[Step.Build, 11 + index]
				],
				true
			);
		}
		return made;
	}

	function lane(
		id: string,
		description: string,
		prefix: string,
		[done, running, waiting]: [number, number, number],
		tasks: Task[] = []
	): SampleLane {
		if (tasks.length === 0) tasks.push(...chain(id, prefix, [done, running, waiting]));
		const used = 40_000 + id.length * 9_000;
		return {
			id,
			name: id,
			description,
			babysitter: agent(AgentRole.Babysitter, running > 0, used),
			tasks
		};
	}

	const api = lane(
		'api',
		'Orders, invoices and the report job',
		'SAM',
		[1, 1, 5],
		[
			task('SAM-101', 'Rate limit the login endpoint', null, TaskState.Done),
			task('SAM-102', 'Paginate the orders list', 'SAM-101', TaskState.Asking, {
				pr: { number: 418, url: 'https://example.com/pr/418' },
				steps: runs(
					[
						[Step.Plan, 7],
						[Step.Approve, 2],
						[Step.Build, 30],
						[Step.PR, 4],
						[Step.Build, 8],
						[Step.Merge, 12]
					],
					true
				),
				note: 'The change is in src/orders/list.ts:48. The page size of the old route must not change.'
			}),
			task(
				'SAM-103',
				'Add an index to the audit table and backfill the old rows',
				'SAM-101',
				TaskState.Running,
				{
					steps: runs(
						[
							[Step.Plan, 6],
							[Step.Approve, 2],
							[Step.Build, 14]
						],
						true
					)
				}
			),
			task('SAM-105', 'Retry failed webhooks', 'SAM-103', TaskState.Todo),
			task('SAM-108', 'Split the report job', 'SAM-105', TaskState.Todo),
			task('SAM-112', 'Queue the report parts', 'SAM-108', TaskState.Todo),
			task('SAM-113', 'Send the report by email', 'SAM-112', TaskState.Todo),
			task('SAM-106', 'Cache the price lookup', 'SAM-103', TaskState.Todo)
		]
	);
	api.babysitter = agent(AgentRole.Babysitter, true, 124_000, {
		questions: [
			{
				id: 'Q12',
				topic: 'Merge PR #418?',
				openedAt: ago(12),
				task: 'SAM-102',
				lane: 'api',
				change: null
			}
		],
		notes: [
			{ at: ago(18), kind: 'stuck', text: 'tenbox check ran 9 min on a large diff' },
			{ at: ago(55), kind: 'idea', text: 'Show the PR size before the review step' },
			{ at: ago(62), kind: 'handover', text: 'Took the lane over at 38% context' }
		]
	});

	const web = lane(
		'web',
		'The customer web app',
		'SAM',
		[0, 1, 1],
		[
			task('SAM-201', 'Empty state for the inbox', null, TaskState.Running, {
				steps: runs(
					[
						[Step.Plan, 4],
						[Step.Approve, 1],
						[Step.Build, 22]
					],
					true
				)
			}),
			task('SAM-204', 'Table column resize', 'SAM-201', TaskState.Todo)
		]
	);
	web.babysitter = agent(AgentRole.Babysitter, true, 82_000);

	const search = lane(
		'search',
		'Search over orders and customers',
		'SAM',
		[1, 1, 8],
		[
			task('SAM-301', 'Search index schema', null, TaskState.Done),
			task('SAM-302', 'Index the orders', 'SAM-301', TaskState.Running, {
				steps: runs(
					[
						[Step.Plan, 8],
						[Step.Approve, 2],
						[Step.Build, 31]
					],
					true
				)
			}),
			task('SAM-303', 'Search by customer name', 'SAM-302', TaskState.Todo),
			task('SAM-304', 'Rebuild the index every night', 'SAM-302', TaskState.Todo),
			...[5, 6, 7, 8, 9, 10].map((n) =>
				task(
					`SAM-3${String(n).padStart(2, '0')}`,
					`Index job part ${n - 4}`,
					n === 5 ? 'SAM-304' : `SAM-3${String(n - 1).padStart(2, '0')}`,
					TaskState.Todo
				)
			)
		]
	);

	const indexParts = (sign: PlanSign | null) =>
		[10, 9, 8, 7, 6, 5].reduce<PlanChange['trees'][number]['roots']>(
			(children, n) => [
				node(`SAM-3${String(n).padStart(2, '0')}`, `Index job part ${n - 4}`, sign, children)
			],
			[]
		);

	const change: PlanChange = {
		reason: 'The branch under SAM-304 has 7 open tasks, and the limit is 6.',
		trees: [
			{
				lane: 'search',
				isNew: false,
				waits: null,
				roots: [
					node('SAM-301', 'Search index schema', null, [
						node('SAM-302', 'Index the orders', null, [
							node('SAM-303', 'Search by name and email', PlanSign.Changed, [], {
								old: 'Search by customer name'
							}),
							node('SAM-311', 'Page the search results', PlanSign.Added),
							node('SAM-299', 'Old search page', PlanSign.Removed),
							node(
								'SAM-304',
								'Rebuild the index every night',
								PlanSign.Moved,
								indexParts(PlanSign.Moved)
							)
						])
					])
				]
			},
			{
				lane: 'search-index',
				isNew: true,
				waits: 'Waits for SAM-302 (running), then a new babysitter starts it.',
				roots: [node('SAM-304', 'Rebuild the index every night', null, indexParts(null))]
			}
		]
	};

	const sample: SampleProject = {
		id: 'sample',
		name: 'sample',
		steps: STEPS,
		planner: agent(AgentRole.Planner, false, 56_000, {
			questions: [
				{
					id: 'Q16',
					topic: 'Split search into a new lane',
					openedAt: ago(25),
					task: null,
					lane: 'search',
					change
				}
			],
			notes: [{ at: ago(40), kind: 'idea', text: 'Lane search grows fast; watch the open tasks' }]
		}),
		lanes: [
			api,
			web,
			lane('billing', 'Invoices and payment retries', 'BIL', [2, 1, 4]),
			search,
			lane('docs', 'The public docs site', 'DOC', [3, 0, 0]),
			lane('auth', 'Login, sessions and tokens', 'AUT', [4, 0, 0]),
			lane('mobile', 'The phone app', 'MOB', [0, 0, 3]),
			lane('infra', 'Build and deploy', 'INF', [0, 0, 2]),
			lane('emails', 'The emails we send', 'EML', [0, 0, 5]),
			lane('admin', 'The admin screens', 'ADM', [0, 0, 1])
		]
	};

	const shop = lane('storefront', 'The shop pages', 'DEM', [0, 0, 2]);
	shop.babysitter.questions = [
		{
			id: 'Q9',
			topic: 'Use the new checkout?',
			openedAt: ago(70),
			task: 'DEM-1',
			lane: 'storefront',
			change: null
		}
	];

	return {
		projects: [
			sample,
			{
				id: 'demo-shop',
				name: 'demo-shop',
				steps: STEPS,
				planner: agent(AgentRole.Planner, false, 30_000),
				lanes: [shop]
			},
			{
				id: 'demo-docs',
				name: 'demo-docs',
				steps: STEPS,
				planner: agent(AgentRole.Planner, false, 12_000),
				lanes: [lane('guides', 'How-to guides', 'GDE', [0, 1, 0])]
			}
		]
	};
}

function node(
	ref: string,
	title: string,
	sign: PlanChange['trees'][number]['roots'][number]['sign'],
	children: PlanChange['trees'][number]['roots'] = [],
	rest: { note?: string; old?: string } = {}
) {
	return { ref, title, sign, note: rest.note ?? null, old: rest.old ?? null, children };
}
