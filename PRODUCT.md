# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- Front end: SvelteKit as a static build with Svelte 5, in `web/`. A trial built the same
  screens in React and in Svelte: both worked the same with mouse and touch, and the Svelte
  build used less browser memory. The panel has no drag and drop: the planner changes the lanes.
- Server: Rust, a separate application with its own build and deploy. Front end and server talk
  only through the server's API. Until the server is written, the TypeScript server of tenbox
  keeps its current jobs (events, run credentials, cluster watches).

## Users

For now one user: the owner, a developer who runs several coding-agent sessions in parallel on
their own and client projects. Each session is a "babysitter" that takes one lane of tasks from
plan to merge. The owner checks the lanes on the phone during the day and plans them at a desk.
Other users (a team, or teams that use tenbox and tenyard) are not decided.

## Product Purpose

Tenface is the panel of tenyard, the runtime of the coding agents. In one place it shows, per
project: each lane, the tree of its tasks, the step of each task, its tracker state, what
stopped it, the open questions of the project's planner and the lanes' babysitters, and a link
to each agent's chat. The owner does not plan by hand: the planner changes the lanes, and the
panel shows each change.

Success: the owner sees in a few seconds what waits for them, without opening a terminal, the
tracker or each chat in turn.

## Positioning

The lane is a first-class object of the server, not a note in a file. The planner and the
babysitters (Claude Code sessions) read and write lanes through the server API, and the panel
reads the same server, so the panel shows what the agents actually do.

## Operating Context

- Access at first: only the owner, over a private Tailscale network (tailnet), like the
  cluster's Grafana. A login of tenbox comes later.
- The tracker is ClickUp for now. The server learns about tracker changes from a ClickUp
  webhook, reached through one public path that opens only that webhook; each call is checked
  with ClickUp's signature.
- A task goes through steps such as plan, plan approval, build, draft PR, proof, merge, done.
  The steps differ per project: one project has a real eval step that runs only on the owner's
  computer, another has none.
- The chat with a babysitter or the planner happens in the Claude app (Remote Control). The panel
  only links to it: the owner opens it, answers, and comes back.
- Tasks run as Jobs on the tenyard cluster through the tenbox CLI.

## Capabilities and Constraints

- Terms: project, lane, task, step, planner, babysitter, question, "needs you". A
  project holds lanes, a lane holds tasks, and a task goes through the tenbox steps of its
  project. A project has one planner. A lane has one babysitter and owns no files.
- A lane is a tree of tasks, not an ordered list. A task waits for its parent: it starts when
  the parent is done, because it is built on the parent's branch or because it is a part of the
  parent. Tasks under the same parent have no order and can run in parallel. A task has at most
  one parent, in its own lane. The rare task that also waits for a second task, or for a task of
  another lane, keeps that in a separate list.
- All lane logic lives on the server: the tree, steps, and the rule that a started
  task stays where it is.
- Steps are defined per project. The step of each task is stored on the server.
- Finished tasks stay visible in their lane.
- The panel shows no chat of its own; the chat stays a link.
- Mobile first, then desktop.
- The owner never edits a lane by hand. Each project has one planner (a Claude Code session with
  its own chat) that adds, changes, moves and removes tasks that have not started, and opens or
  splits lanes. The panel shows a change read-only, as the lane's tree with + − → ~ signs. When the
  planner needs the owner's word on a change, it asks a question.
- A question comes from the project's planner or from a lane's babysitter. It has an id that is
  unique across the whole system (for example Q16). Its details stay on the server; the panel
  shows it in the card of the agent that asked it, and the agent's ring counts the open ones.
  The owner answers in that agent's chat with the id ("Q16 ok"). A hook in that session tells the
  server that the question is answered, and the question leaves the card.
- This repository is public (FSL-1.1-ALv2): no client or project names, IP addresses, server or
  volume ids, or tokens in code, docs, commits, issues or pull requests. Sample and test data are
  made up.
- Undecided: users beyond the owner; when the login of tenbox replaces the tailnet-only access.

## Brand Commitments

The product family is named tenbox (the CLI), tenyard (the cluster runtime) and tenface (this
panel). The interface copy is English.

## Evidence on Hand

No screenshots, metrics or users to show yet. Design mockups exist outside this repository and
hold real client task names, so they are not copied here.

## Product Principles

1. "Needs you" is always in sight: the projects list shows which agents ask, the lanes table
   shows which babysitters ask, and on a lane or project page the agent's ring counts its open
   questions and its card lists them.
2. One source of truth: the server holds the lanes; the planner and the babysitters write it,
   and the panel only reads it.
3. Check on the phone, see more on the desktop: the phone answers "what now", the desktop shows
   project, lane and task side by side.
4. Show only what the owner acts on: the chat is a link, the code review stays in GitHub.
5. Calm by default: the panel moves only when a state changes.
