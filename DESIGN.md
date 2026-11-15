---
name: Tenface
description: The panel of tenyard, a quiet ledger of coding-agent lanes that shows what runs and what the agents ask the owner.
colors:
  ground: "#e7e1d4"
  tile: "#f1ece2"
  raised: "#e0d9cb"
  lift: "#fffdf9"
  ink: "#1f1c17"
  ink-soft: "#3d3830"
  on-ink-muted: "#d8d0c2"
  muted: "#5e574b"
  muted-soft: "#6a6254"
  line: "#d6cebe"
  line-strong: "#c4bba9"
  mark: "#857c6c"
  mark-done: "#7a7262"
  mark-empty: "#ddd5c6"
  running: "#a3161c"
  on-running: "#e7e1d4"
  dark-ground: "#2a2620"
  dark-tile: "#332e27"
  dark-raised: "#3c362e"
  dark-lift: "#403a31"
  dark-ink: "#efe9de"
  dark-ink-soft: "#d8d0c2"
  dark-muted: "#b8ae9d"
  dark-muted-soft: "#a89e8d"
  dark-line: "#3f392f"
  dark-line-strong: "#534b3f"
  dark-mark: "#807666"
  dark-mark-done: "#8b8170"
  dark-mark-empty: "#474036"
  dark-running: "#ff5a5f"
  dark-on-running: "#2a2620"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "34px"
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "26px"
  card-head:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "16px"
    letterSpacing: "0.08em"
  subject:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "22px"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: "20px"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  id-button:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  id:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
rounded:
  step-dot: "2px"
  mark: "4px"
  node: "5px"
  step-mini: "6px"
  step-tile: "9px"
  row: "12px"
  card: "18px"
  panel: "20px"
  column: "28px"
  sheet: "32px"
  capsule: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.capsule}"
    padding: "0 12px"
    height: "44px"
  button-outline-sheet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.capsule}"
    padding: "0 16px"
    height: "48px"
  copy-id:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.id-button}"
    rounded: "{rounded.capsule}"
    padding: "0 8px"
    height: "36px"
  tab-current:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    height: "56px"
  agent-ring:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.capsule}"
    size: "48px"
  agent-ring-floating:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.capsule}"
    size: "56px"
  agent-card:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "14px"
  table:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "12px"
  mark-done:
    backgroundColor: "{colors.mark-done}"
    rounded: "{rounded.mark}"
    size: "14px"
  mark-running:
    backgroundColor: "{colors.running}"
    rounded: "{rounded.mark}"
    size: "14px"
  mark-waiting:
    backgroundColor: "transparent"
    rounded: "{rounded.mark}"
    size: "14px"
  task-sheet:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  error-strip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.body}"
    padding: "8px 16px"
  error-strip-desktop:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.body}"
    padding: "8px 24px"
    height: "56px"
---

# Design System: Tenface

## Overview

**Creative North Star: "The Quiet Ledger"**

Tenface is a ledger that the owner reads in a few seconds. Every project, lane, task and step is written down in warm, paper-like Sepia tones, in tables and trees that read like a well-kept book. The page does not glow or decorate. Its one color, a blood red, says "this runs now".

What the agents ask the owner does not sit on the page. Each question belongs to the agent that asked it: the planner of the project (P) or the babysitter of a lane (B). The agent is a ring that shows its context use, and a small card on the ring counts its open questions. Tap the ring and its card lists the questions. The owner answers in that agent's chat, for example "Q12 ok".

The surface is light Sepia, also on a phone or computer set to dark. The dark Sepia twins wait under `data-theme="dark"` for a later switch; nothing sets it yet. There is no accent color. Hierarchy comes from tone, weight and position. Shapes follow Apple's current capsule forms without the glass: capsule buttons and tabs, round agent rings, softly rounded cards, all opaque and flat.

The phone answers "what now"; the desktop shows project, lane and task side by side.

**Key Characteristics:**
- The trio: done is a filled gray square, running a filled red square, waiting an empty square with a gray outline. The same three marks count tasks, count lanes in a project row, and draw the tree.
- Red means running and nothing else. A question for the owner is never red; it is a count on the asking agent's ring.
- Every question has an id (Q12) that is unique across the whole system.
- Ink marks where the owner is: the current tab, the selected row, the last pick.
- An error of the whole panel is an ink strip at the top of every screen.
- A plan change is read-only; the owner answers it in the planner's chat.
- A lane is one tree with lines from root to leaf.

## Colors

A warm, low-chroma Sepia neutral scale with a single blood red; each tone has a dark twin.

### Primary
- **Blood Red** (`running`; dark twin `dark-running`): what runs now. The running square of the trio, the running tree node, the arc of a working agent, the running count. On dark Sepia the red is lighter, because the light-theme red does not read on a dark ground.

### Neutral
- **Sepia Ground** (`ground` / `dark-ground`): the page.
- **Paper Tile** (`tile` / `dark-tile`): tables, cards, columns, the agent ring.
- **Raised Sepia** (`raised` / `dark-raised`): the current tab.
- **Lift** (`lift` / `dark-lift`, #fffdf9 / #403a31): the card of a picked lane row and a picked task row.
- **Ink** (`ink` / `dark-ink`): main text, the error strip, outlines that mark a selection, the arc of an idle agent, the box of a new lane in a plan change.
- **On Running** (`on-running` / `dark-on-running`): an icon or text on red, for example the step icon on a red step tile.
- **Soft Ink** (`ink-soft` / `dark-ink-soft`): secondary text, notes. `on-ink-muted` is the muted text on an ink row.
- **Muted** (`muted`, `muted-soft` and their dark twins): labels, meta, ids, times, placeholders.
- **Line** (`line`, `line-strong` and their dark twins): table and card borders, dividers, the ring's track.
- **Gray Mark** (`mark` / `dark-mark`): the outline of a waiting square, tree lines, the edges of buttons and search fields.
- **Done Mark** (`mark-done` / `dark-mark-done`): the done square, a closed tree node, a done step.
- **Empty Mark** (`mark-empty` / `dark-mark-empty`): the tile behind a step icon.

### Named Rules
**The Red Means Running Rule.** Red marks what runs now and nothing else. No red for a question, an error, a link, a brand or decoration. A question is a count on the asking agent's ring; an error is ink.

**The No Accent Rule.** There is no second color. Selection, focus and "current" are shown with ink, weight and tone.

**The Lifted Pick Rule.** A picked row rises as a light card: the selected lane row in the desktop lanes table and the selected task row in the tree get the Lift fill, a 1 px `line` ring and a soft 2 px / 6 px shadow (`--shadow-pick`); the picked task's title is semibold. The current tab keeps its 1.5 px ink border. The panel has no dark row: the owner wants it light everywhere. In a plan change, a 1 px ink outline marks what is new: an added row and the box of a new lane.

## Typography

**Body Font:** Inter (with system-ui, sans-serif)
**Mono Font:** JetBrains Mono (with ui-monospace, monospace)

**Character:** Inter carries every word at a calm, tight scale; JetBrains Mono sets the exact things the owner may copy or compare: task ids, question ids, PR numbers.

### Hierarchy
- **Display** (700, 28px, 34px): page titles: Projects, the project name.
- **Headline** (700, 20px, 26px): the title of the "not here" page.
- **Card Head** (700, 12px, 16px, uppercase, 0.08em, soft ink): what a card is, with its short name: "Lanes", "Lane · api", "Task · SAM-103", "Plan change · Q16", "Babysitter · api". The phone lane page opens with it too.
- **Subject** (500, 16px, 22px): the sentence under a card head: the lane's description, the task title, the plan change topic.
- **Title** (500, 15px, 20px): the name in a table row, a question title, a new lane in a plan change. A task in the tree is 15px at 400; the picked one is 600.
- **Body** (400, 14px, 20px): notes, button text, error text.
- **Label** (600, 12px, 16px): table headers, meta, times, counts, step names, nav labels. Weight 400–500 for muted meta.
- **Id** (JetBrains Mono 500–600, the size of its line): SAM-102, Q12, PR #418.

### Named Rules
**The Card Head Rule.** A card opens with its head on a band: the Card Head line, then the Subject, on a Raised Sepia band that runs to the card's edges and its top corners. The lanes table, the lane column, the detail column, the agent card and the task sheet have it. The head is the strongest line of its card and the Subject sits under it, quieter; a level below is never heavier than the level above. A Card Head outside a card (the phone lane page, the phone plan change) has no band.

**The Six Sizes Rule.** Only 12, 14, 15, 16, 20 and 28 px exist. The one exception is the 9 px mark drawn inside a small icon: the letter or count of an agent icon, and the "?" of the question card in a tree row. A long title wraps; it is never cut with "…".

## Layout

The phone is the first target (designed at 390 px), with a 16 px side gutter and 44 × 44 px tap targets. Spacing steps are 4, 8, 12, 16, 24 and 32 px.

**Phone.** Every screen has the floating capsule nav at the bottom center: two tabs, Home and Projects, 220 px wide. The agent of the page floats over it as a 56 px ring, 8 px from the right edge and 104 px from the bottom; the owner can drag it, and it snaps to the nearest edge. A lane page shows the lane's babysitter (B), a project page and a plan change show the project's planner (P), and Home, Projects and a task show no agent. Tapping the ring opens its card full width, over a page dimmed with ink at 32%: above the ring, or below it when the ring is in the upper half of the screen.

**Tables.** Projects and lanes use one table kit: an optional section title, a "Search …" capsule field, a header row and rows at least 56 px high. The phone shows five rows per page with a pager ("1–5 of 10" between two arrows); a question list in an agent card shows three. Projects: Project | Lanes (a trio that counts the project's lanes) | Needs you (one agent head per asking agent, P and/or B). A project: Lane | Tasks (a trio that counts the lane's tasks) | Needs you (a B head when the lane's babysitter asks something).

**Lane.** A header with the back arrow, the head "Lane · api", the one-line description of the lane and its trio, then one tree. A lane holds one root tree, because one babysitter does not take more. The tree indents only at a fork; an only child stays in its parent's column.

**Task.** A bottom sheet over the lane, dimmed with ink at 32%: a grab handle and the head band ("Task · SAM-103" and the title), the steps with the total time ("1h03 total"), PR and Tracker buttons (48 px), and the babysitter's note. The steps are a snake of eight places, four per row: plan, approve, build, debug, eval, PR, merge, close. A step a project does not use has a dashed `line-strong` tile and no time.

**Desktop.** The floating nav sits at the bottom center here too. The projects page is the same table, wide, with every row on one page. A project page is three phone-like columns side by side: the project (its lanes table and the P ring), the lane (its tree and the B ring) and the detail. The columns fill the whole screen width with 32 px side gutters and reach down to the nav: the lanes column is 24% of the screen (360 to 440 px), and the lane and the detail share the rest equally; below 1200 px the gap and the gutters are 16 px and the first column is 380 px. The detail column shows whatever the owner picked last: a task, or the plan change of a planner question. An agent card opens in place under its ring, without dimming the page.

### Named Rules
**The Last Pick Rule.** The detail column shows the last pick. The picked task stays a lifted card in the tree. The selected lane row is a lifted card while its task is shown, and only a 2 px ink outline, without the card, while the detail column shows a plan change.

**The Error Rule.** An error of the whole panel (offline, the tracker late) is an ink strip at the top of every screen, with "Try again" only when the owner's action can fix it. An error of one thing stays where that thing is. No red.

**The Offline Rule.** Offline, the panel shows the last known state under the strip: the trio and the ring keep their last colors, and the strip alone says the panel is offline. Only the running node turns into a 2 px gray outline, and its step tile turns gray, "last known".

## Elevation & Depth

Surfaces are flat. Tables, cards and columns are told apart by tone (ground, tile, raised) and a thin line. A shadow appears only on what floats: the nav, the agent ring, the agent card and the task sheet. Shadows use the ink color at low opacity.

### Shadow Vocabulary
- **Nav** (`box-shadow: 0 6px 20px rgba(31, 28, 23, 0.12)`): the floating nav.
- **Ring** (`box-shadow: 0 6px 18px rgba(31, 28, 23, 0.22)`): the floating agent ring.
- **Card** (`box-shadow: 0 10px 28px rgba(31, 28, 23, 0.16)`): an open agent card.
- **Sheet** (`box-shadow: 0 -8px 24px rgba(31, 28, 23, 0.12)`): the task sheet.

### Named Rules
**The Flat Unless Floating Rule.** No shadow on anything that lies in the page. On the phone, behind an open agent card or the task sheet, the page and the nav are dimmed with ink at 32%.

## Shapes

Capsules for everything you press: buttons, the copy-id pill, tabs, the nav (999px). The agent ring is a circle. Agent cards have 18 px corners, tables and the box of a new lane 20 px, desktop columns 28 px, the task sheet 32 px top corners, a selected row 12 px. The trio marks are 14 px with 4 px corners, tree nodes 16 px with 5 px. Step icons sit on 36 px tiles with 9 px corners in the task, and on 22 px tiles with 6 px corners in a tree row; step dots are 6 px with 2 px corners. No glass, no blur, no transparency in surfaces.

## Components

Clear like a tool: the same shape for the same job on every screen.

### Buttons
- **Outline:** a capsule 44 px high with a 1 px gray-mark edge, ink text and an optional icon: Chat, Copy handover prompt, PR #418, Tracker SAM-102, Try again.
- **Copy id:** a 36 px capsule with the mono id and a copy icon; it copies the id for the chat.
- A button that only repeats an action says what it does, for example "Try again: load lane billing".

### The trio
Three 14 px squares with a count after each: done (filled done mark), running (filled red), waiting (empty, 1.5 px gray-mark outline). It counts tasks in a lane row and a lane header, and lanes in a project row. The screen-reader label says the three counts in words.

### Tree nodes
16 px squares on a line from root to leaf: closed is a filled done mark, in progress is red, to do is empty with a 1.5 px gray-mark outline. A task with an open question has a 2 px ink outline on the tile color and a small question card (12 × 16 px) after its status, named "The babysitter asks you". Right of a running or waiting task: a 22 px tile with the current step's icon, the step's time beside it, and one 6 px dot per step. Done dots are filled done mark; the current dot is red while the step runs and ink-outlined while it waits; the rest have a gray-mark outline.

### Agent ring (signature)
A robot head with P (planner) or B (babysitter), in a ring that fills with the context use. The arc is red while the agent works and ink while it waits. A fixed tick at 35% marks where an idle agent hands over to a new session; the Copy handover prompt button copies that prompt. A small card on the orbit, at the upper right, counts its open questions: "1", "2" … "9+". 48 px in a desktop header, 56 px floating on the phone.

### Agent card (signature)
Opens from the ring. A head band with a 40 px ring, the Card Head ("Babysitter · api"), the context line ("Context 62% · 124k / 200k") and a notes button; no state word, the ring's color says it. Then "Needs you" (a 14 px section title): a table of Question | ID | Waiting, oldest first, where the id is a copy-id pill; the title of a planner question opens its plan change, other titles are plain text. Then Chat and Copy handover prompt. The notes view has a back button and lists what the agent did, with times and a kind (stuck, idea, handover).

### Plan change (signature)
The planner's change to the lanes is read-only. The lane's tree with a sign column: "+" added (the row in a 1 px ink outline), "−" removed (struck through, on the ground color), "→" moved (with where it goes), "~" changed (the old text struck under the new). A new lane is its own tree in a 1 px ink box with 20 px corners. The signs are images with a name for screen readers. No Approve and no Reject: the page ends with "Answer in the planner chat with the id, for example Q16 ok."

### Navigation
The floating capsule nav with Home and Projects, on the phone and the desktop; the current tab is a raised capsule with a 1.5 px ink border.

### Error strip
An ink strip at the top with an icon, one line of what is wrong and one line of what happens now ("You see the last known state. The panel reconnects by itself."). On the desktop it is at least 56 px high with 24 px side padding.

### Loading
What the panel already has shows at once: a lane's header and trio, the agent card's header. What comes from the server (a lane's task tree, the questions, notes and buttons of an agent card, search results) shows as a skeleton until it arrives: still bars in the Raised Sepia tone, in the shape of the rows to come (tree rows with a node square, table rows on the table's columns, card lines). No shimmer and no spinner. If the request fails, one muted line says what did not load, with "Try again". A refresh of something already shown keeps it on screen; only a new lane, a new search or a new card starts from the skeleton. On the desktop a lane pick changes the columns in place, without the phone's page slide. The desk stays one page across a project, its lanes, tasks and plan changes, so the lane search and the scroll stay.

## Do's and Don'ts

### Do:
- **Do** count tasks with the trio everywhere: done, running, waiting.
- **Do** put a question in the card of the agent that asked it, with its id and the waiting time.
- **Do** close a question when the owner answers it in the chat: a hook in the asking agent's session (the babysitter's or the planner's) tells the server, and the row leaves the card.
- **Do** show the agent on every lane and project page, and let the owner drag it out of the way.
- **Do** show a plan change before it is applied, with + − → ~ signs.
- **Do** give every focusable element a 2 px ink focus ring with a 2 px offset.
- **Do** write times as "11:20" for today and "Nov 13, 20:30" for another day.

### Don't:
- **Don't** use red for a question, an error or anything that does not run.
- **Don't** add an accent color, a gradient, glass, blur or a second attention color.
- **Don't** put a list of questions on a page; questions live in the agent card.
- **Don't** write a state word ("asleep", "working") next to an agent; the ring says it.
- **Don't** add Approve or Reject to a plan change.
- **Don't** use a font size outside 12, 14, 15, 16, 20 and 28 px, or cut a title with "…".
- **Don't** draw drag handles or drop zones for tasks; the tree is never edited by hand.
- **Don't** use real client, project or task names in designs or code; sample data is made up.

### Open points
- Done and running squares differ only by hue (1.64:1). The labels say the state in words; a mark inside the red square was tried and left out.
- The settings page is not drawn. There is no Archive and no eval page.
- Dark Sepia is drawn only for the projects page and a lane tree.
