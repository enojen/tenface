# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- Front end: open decision. It must be fast on a phone and on a desktop browser. The owner is
  researching two candidates: SvelteKit as a static build (a small page that can be added to the
  phone's home screen) and React with dnd-kit (the most mature drag and drop for touch and
  keyboard). Drag and drop is the deciding part.
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
project: each lane, the order of its tasks, the stage of each task, its tracker state, what
stopped it, its open questions, and a link to the babysitter's chat. It is also where the owner
plans: reorder tasks, move a task to another lane, make one task wait for another, open a lane,
archive finished work.

Success: the owner sees in a few seconds what waits for them, without opening a terminal, the
tracker or each chat in turn.

## Positioning

The lane is a first-class object of the server, not a note in a file. The babysitters (Claude
Code sessions) read and write lanes through the same server API that the panel uses, so the
panel shows what the agents actually do and a change in the panel is what the agents follow.

## Operating Context

- Access at first: only the owner, over a private Tailscale network (tailnet), like the
  cluster's Grafana. A login of tenbox comes later.
- The tracker is ClickUp for now. The server learns about tracker changes from a ClickUp
  webhook, reached through one public path that opens only that webhook; each call is checked
  with ClickUp's signature.
- A task goes through steps such as plan, plan approval, build, draft PR, proof, merge, done.
  The steps differ per project: one project has a real eval step that runs only on the owner's
  computer, another has none.
- The chat with a babysitter happens in the Claude app (Remote Control). The panel only links
  to it: the owner opens it, answers, and comes back.
- Tasks run as Jobs on the tenyard cluster through the tenbox CLI.

## Capabilities and Constraints

- Terms: project, lane, task, stage, babysitter, "needs you", archive. A lane is an ordered list
  of tasks with one babysitter; it owns no files.
- All lane logic lives on the server: order, dependencies ("after X"), stages, archive, and the
  rule that a started task cannot move to another lane.
- Stages are defined per project. The stage of each task is stored on the server.
- Finished tasks stay visible in their lane until the owner archives them.
- The panel shows no chat of its own; the chat stays a link.
- Mobile first, then desktop. Drag and drop must work with touch.
- This repository is public (FSL-1.1-ALv2): no client or project names, IP addresses, server or
  volume ids, or tokens in code, docs, commits, issues or pull requests. Sample and test data are
  made up.
- Undecided: the front-end stack; users beyond the owner; when the login of tenbox replaces the
  tailnet-only access.

## Brand Commitments

The product family is named tenbox (the CLI), tenyard (the cluster runtime) and tenface (this
panel). The interface copy is English.

## Evidence on Hand

No screenshots, metrics or users to show yet. Design mockups exist outside this repository and
hold real client task names, so they are not copied here.

## Product Principles

1. "Needs you" first: what waits for the owner is always the first thing on a screen.
2. One source of truth: the server holds the lanes; the panel and the babysitters only read and
   write it.
3. Check on the phone, plan on the desktop: the phone answers "what now", the desktop arranges
   "what next".
4. Show only what the owner acts on: the chat is a link, the code review stays in GitHub.
5. Calm by default: the panel moves only when a state changes.
