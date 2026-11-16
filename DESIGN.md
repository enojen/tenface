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
  diff-add: "#cdecd3"
  diff-add-word: "#9bd8aa"
  diff-add-ink: "#0f5c25"
  diff-remove: "#f6d5cf"
  diff-remove-word: "#eaaea5"
  diff-remove-ink: "#9a0f22"
  dark-diff-add: "#183a24"
  dark-diff-add-word: "#2a6b3e"
  dark-diff-add-ink: "#8ee4a8"
  dark-diff-remove: "#43201f"
  dark-diff-remove-word: "#7a2e2e"
  dark-diff-remove-ink: "#ffa9a6"
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
  row:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "22px"
  tag:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: "18px"
    letterSpacing: "0.06em"
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
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: "22px"
    fontFeature: "tabular-nums"
  id:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "22px"
    fontFeature: "tabular-nums"
rounded:
  step-dot: "2px"
  mark: "4px"
  node: "3px"
  row: "12px"
  card: "18px"
  panel: "20px"
  column: "24px"
  project: "28px"
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
    rounded: "{rounded.mark}"
    padding: "0"
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
  tree-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.row}"
    height: "30px"
  tree-row-picked:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    typography: "{typography.row}"
    height: "30px"
  diff-line-added:
    backgroundColor: "{colors.diff-add}"
    textColor: "{colors.ink}"
    typography: "{typography.row}"
    height: "30px"
  diff-line-removed:
    backgroundColor: "{colors.diff-remove}"
    textColor: "{colors.ink}"
    typography: "{typography.row}"
    height: "30px"
  new-lane-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.capsule}"
    padding: "0 8px"
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

The surface is light Sepia, also on a phone or computer set to dark. The dark Sepia twins live under `data-theme="dark"`. The theme switch in the nav sets it, and the device remembers the choice; the system setting does not change it. There is no accent color. Hierarchy comes from tone, weight and position. Shapes follow Apple's current capsule forms without the glass: capsule buttons and tabs, round agent rings, softly rounded cards, all opaque and flat.

The phone answers "what now"; the desktop shows project, lane and task side by side.

**Key Characteristics:**
- Done is a filled gray square, running a filled red square, waiting an empty square with a gray outline; these marks draw the tree. The lane progress bar uses the same gray and red.
- A lane tree and a question list read as tables: a line number, the content, and a short column at the right.
- Red means running and nothing else. A question for the owner is never red; it is a count on the asking agent's ring. The one exception is the lane diff, which uses git's green and red.
- Every question has an id (Q12) that is unique across the whole system.
- Ink marks where the owner is: the current tab, the selected row, the last pick.
- An error of the whole panel is an ink strip at the top of every screen.
- A plan change is read-only; the owner answers it in the planner's chat.
- A lane is one tree with lines from root to leaf.

## Colors

A warm, low-chroma Sepia neutral scale with a single blood red; each tone has a dark twin.

### Primary
- **Blood Red** (`running`; dark twin `dark-running`): what runs now. The running note and the running part of the lane progress, the running tree node, the arc of a working agent, the running count. On dark Sepia the red is lighter, because the light-theme red does not read on a dark ground.

### Neutral
- **Sepia Ground** (`ground` / `dark-ground`): the page.
- **Paper Tile** (`tile` / `dark-tile`): tables, cards, columns, the agent ring.
- **Raised Sepia** (`raised` / `dark-raised`): the current tab, card bands, table head rows, the picked task row.
- **Lift** (`lift` / `dark-lift`, #fffdf9 / #403a31): the desktop lane and task cards, the card of a picked lane row, the bar of a new lane in a plan change.
- **Ink** (`ink` / `dark-ink`): main text, the error strip, outlines that mark a selection, the arc of an idle agent, the box and the tag of a new lane in a plan change.
- **On Running** (`on-running` / `dark-on-running`): an icon or text on red, for example the step icon on a red step tile.
- **Soft Ink** (`ink-soft` / `dark-ink-soft`): secondary text, notes. `on-ink-muted` is the muted text on an ink row.
- **Muted** (`muted`, `muted-soft` and their dark twins): labels, meta, ids, times, placeholders.
- **Line** (`line`, `line-strong` and their dark twins): table and card borders, dividers, the ring's track.
- **Gray Mark** (`mark` / `dark-mark`): the outline of a waiting square, tree lines, the edges of buttons and search fields.
- **Done Mark** (`mark-done` / `dark-mark-done`): the done square, a closed tree node, a done step.
- **Empty Mark** (`mark-empty` / `dark-mark-empty`): the tile behind a step icon.

### Diff
The lane diff of a plan change, and only it, uses git's colors. Each tone has a dark twin (`dark-diff-*`).
- **Diff Add** (`diff-add`): the fill of an added line. `diff-add-word` marks the changed words in it, and `diff-add-ink` colors its number, its "+" and the "+N" count.
- **Diff Remove** (`diff-remove`): the fill of a removed line. `diff-remove-word` marks the removed words, and `diff-remove-ink` colors its number, its "−" and the "−N" count.

### Named Rules
**The Red Means Running Rule.** Red marks what runs now and nothing else. No red for a question, an error, a link, a brand or decoration. A question is a count on the asking agent's ring; an error is ink. The diff red is not Blood Red. It is a separate token that lives only inside the lane diff.

**The No Accent Rule.** There is no second color. Selection, focus and "current" are shown with ink, weight and tone. The diff green and red are the one exception, because the owner reads a diff in git's colors.

**The Pick Rule.** The picked task row in the tree is a Raised Sepia row across the full width of the tree, and its title is semibold. Its node keeps a 2 px Raised Sepia gap around it. The selected lane row in the desktop lanes table rises as a light card: the Lift fill, a 1 px `line` ring and a soft 2 px / 6 px shadow (`--shadow-pick`). The current tab keeps its 1.5 px ink border. The panel has no ink row: the owner wants it light everywhere.

## Typography

**Body Font:** Inter (with system-ui, sans-serif)
**Mono Font:** JetBrains Mono (with ui-monospace, monospace)

**Character:** Inter carries every word at a calm, tight scale, ids too: a task id, a question id or a PR number is Inter with tabular figures, so the ids in a column line up. JetBrains Mono is left only for text the owner types into a chat ("Q16 ok") and for the source lane name in "Split off from lane api".

### Hierarchy
- **Display** (700, 28px, 34px): page titles: Home, Projects.
- **Headline** (700, 20px, 26px): the title of the "not here" page.
- **Card Head** (700, 12px, 16px, uppercase, 0.08em, soft ink): what a card is, with its short name: "Project · sample", "Lane · api", "Task · SAM-103", "Plan change · Q16", "Babysitter · api". On a project page the project head is the page title (h1).
- **Subject** (500, 16px, 22px): the sentence under a card head: the lane's description, the task title, the plan change topic.
- **Title** (500, 15px, 20px): the name in a projects or lanes table row.
- **Body** (400, 14px, 20px): notes, button text, error text.
- **Row** (400, 13px, 22px): a line of a lane tree, a lane diff and the question table of an agent card. The picked task is 600. A lane diff title and a new lane bar are 13px at 600.
- **Label** (600, 12px, 16px): table headers, meta, times, counts, step names, line numbers, nav labels. Weight 400–500 for muted meta.
- **Tag** (700, 11px, 18px, 0.06em, uppercase text): the "NEW LANE" capsule and the "now" / "after the change" heads of a lane diff (600).
- **Id** (Inter with `tabular-nums`, the size and weight of its line): SAM-102, Q12, PR #418. In a tree row the id is muted; in an agent card it is ink at 600.

### Named Rules
**The Card Head Rule.** A card opens with its head on a band: the Card Head line, then the Subject, on a Raised Sepia band that runs to the card's edges and its top corners. The project card, the lane card, the task card, the agent card and the task sheet have it. The head is the strongest line of its card and the Subject sits under it, quieter; a level below is never heavier than the level above. A Card Head outside a card (the phone plan change) has no band.

**The Project Holds Rule.** On the desktop the project card holds the page: its band runs the full width ("Project · sample", a red "running" when a lane runs, the back arrow and the P ring), the lanes list is its own content without a frame, and the lane card and the task card sit inside it in Lift white. The lane and task bands share one row, so they have the same top and height (CSS subgrid). The task card keeps its band when nothing is picked: "Task" and "No task selected", and an empty body. On the phone each level is its own page, so cards do not nest: a "‹ Projects" or "‹ sample" back link names the level above, and the page is one card with its band.

**The Sizes Rule.** Only 11, 12, 13, 14, 15, 16, 20 and 28 px exist. 13 px is for table lines (tree, diff, questions) and 11 px only for a tag or a diff head. The one exception is the 9 px mark drawn inside a small icon: the letter or count of an agent icon. A long title wraps; it is never cut with "…".

## Layout

The phone is the first target (designed at 390 px), with a 16 px side gutter and 44 × 44 px tap targets. Spacing steps are 4, 8, 12, 16, 24 and 32 px.

**Phone.** Every screen has the floating capsule nav at the bottom center: two tabs, Home and Projects, then a thin line and the theme switch. The agent of the page floats over it as a 56 px ring, 8 px from the right edge and 104 px from the bottom; the owner can drag it, and it snaps to the nearest edge. A lane page shows the lane's babysitter (B), a project page and a plan change show the project's planner (P), and Home, Projects and a task show no agent. Tapping the ring opens its card full width, over a page dimmed with ink at 32%: above the ring, or below it when the ring is in the upper half of the screen. When the card does not fit on that side, it slides toward the ring, and under it, until the whole card shows 16 px from the screen edges; a card taller than the screen scrolls.

**Tables.** Projects and lanes use one table kit: an optional section title, a "Search …" capsule field, a header row and rows at least 56 px high. The phone shows five rows per page with a pager ("1–5 of 10" between two arrows); a question list in an agent card shows three. Projects: Project | Needs you (one agent head per asking agent, P and/or B); under the project name a red "running" when one of its lanes runs. A project: Lane | Needs you (a B head when the lane's babysitter asks something); under the lane name a red "1 task running" / "3 tasks running". A row with nothing running shows only its name.

**Lane.** A "‹ sample" back link, then one card: its band has the head "Lane · api", the one-line description of the lane and its progress, and the card holds one tree. A lane holds one root tree, because one babysitter does not take more. The tree indents only at a fork; an only child stays in its parent's column.

**Lane tree.** The tree is a table with four columns: the line number (#), the tree graph, the task (its id, then its title) and the step. The head row of the table sits flush under the lane band and runs to the card's edges: a Raised Sepia row with `line-strong` borders above and below and 12 px muted labels "#", "task" and "step". Rows are at least 30 px high, in the Row type. A title wraps under itself, not under the id. Below 400 px of tree width the graph cells are 14 px instead of 22 px, and the step column shows only the time, not the step name. The owner can select the text of a row without opening the task.

**Task.** A bottom sheet over the lane, dimmed with ink at 32%: a grab handle and the head band ("Task · SAM-103" and the title, with the PR and Tracker links at its right) and the steps. The task has no note. The sheet closes with a pull down, a tap on the dimmed page or Escape. The PR link is a 40 px capsule with the GitHub mark and "#418"; the Tracker link is a 40 px round button with only its icon, because the id is already on the band.

**Steps.** The steps are a table like the lane tree, flush under the band: # | node | step | started | time. The node line runs straight from the first step to the last, with the same squares as the tree. A step cell holds a 14 px step icon and the step name. The rows follow the runs in the order they ran. A step that runs again gets a new row: the first run is "build", the next ones are "build #2", "build #3". A step without a run stays at its place among the eight: plan, approve, build, debug, eval, PR, merge, close. A step the project does not use has a dashed `line-strong` node, a pale icon, "not used" in muted italic and no time. A done step looks like a closed task in the tree: a Done Mark node, and its name and time in `muted-soft`. The running step is red at 600 and a step that asks the owner is ink at 600. "started" is the clock time of the run ("14:38", or "Nov 13, 20:30" on another day). A step that has not started shows "–" as its time. The last row, under a `line-strong` rule, is the total time of the task.

**Desktop.** The floating nav sits at the bottom center here too. The projects page is the same table, wide, with every row on one page. A project page is one project card (see the Project Holds Rule) with three columns inside: the lanes list, the lane card (its tree and the B ring) and the task card. The project card fills the screen width with 32 px side gutters and reaches down to the nav: the lanes list is 22% of the screen (340 to 420 px), and the lane and task cards share the rest equally; below 1200 px the gutters are 16 px and the lanes list is 340 px. The task card has no close button; the owner picks another task or lane instead. It shows whatever the owner picked last: a task, or the plan change of a planner question. A plan change needs the room for its two sides, so it spans the lane and task columns and becomes the page's main content; the lane card leaves until the owner picks a task again. An agent card opens in place under its ring, without dimming the page.

### Named Rules
**The Last Pick Rule.** The detail column shows the last pick. The picked task stays a Raised Sepia row in the tree. The selected lane row is a lifted card while its task is shown, and only a 2 px ink outline, without the card, while a plan change is shown.

**The Error Rule.** An error of the whole panel (offline, the tracker late) is an ink strip at the top of every screen, with "Try again" only when the owner's action can fix it. An error of one thing stays where that thing is. No red.

**The Offline Rule.** Offline, the panel shows the last known state under the strip: the running notes, the lane progress and the ring keep their last colors, and the strip alone says the panel is offline. Only the running node turns into a 2 px gray outline, and its step tile turns gray, "last known".

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

Capsules for everything you press: buttons, the copy-id pill, tabs, the nav (999px). The agent ring is a circle. Agent cards have 18 px corners, tables 20 px, desktop columns 24 px, the project card 28 px, the task sheet 32 px top corners, a selected lane row, the lane diff cards and the box of a new lane 12 px. A tree row and a table head row have no corners; they run to the card's edges. The lane progress bar is 8 px high and 220 px at most, a capsule; tree nodes are 11 px with 3 px corners, and the square of a step cell is 8 px with 2 px corners. The steps of a task use the same 11 px nodes. No glass, no blur, no transparency in surfaces.

## Components

Clear like a tool: the same shape for the same job on every screen.

### Buttons
- **Outline:** a capsule 44 px high with a 1 px gray-mark edge, ink text and an optional icon: Chat, Copy handover prompt, Try again. In the task head the PR and Tracker links are the same outline at 40 px: "#418" with the GitHub mark, and the tracker icon alone.
- **Copy id:** the id as plain ink text at 600 with a 12 px copy icon after it, without a frame. A hover underlines it; a click copies the id for the chat, and for a moment the id turns into a small ink chip with a check icon. The owner has not decided yet whether the copy icon stays.
- A button that only repeats an action says what it does, for example "Try again: load lane billing".

### Running notes and the lane progress
Each place shows only what the owner needs there. A project row says only whether something runs: a red "running" under the name. A lane row says how many tasks run: a red "1 task running" under the name. Both are 12 px, 600, Blood Red, and a row with nothing running shows only its name.

The lane head shows everything: the counts in words ("1 running · 5 waiting · 1 done"; running in red 600, waiting in soft ink, done muted; a zero count is left out; "No tasks yet" when the lane is empty) and under them a capsule bar 8 px high, at most 220 px: done in the done mark, running in red, waiting the empty part inside a 1.5 px gray-mark ring. The bar is hidden from screen readers; the words say it.

**The Need-to-Know Rule.** A table row carries only the one fact its level needs; the full count lives in the lane head.

### Tree nodes
11 px squares with 3 px corners on a 1 px gray-mark line from root to leaf: closed is a filled done mark, in progress is red, to do is empty with a 1 px gray-mark outline. A task with an open question has a 2 px ink outline on the tile color; its step cell tells screen readers "the babysitter asks you".

### Step cell
The step column of a tree row says the step aloud: an 8 px square with 2 px corners, the step name and its time ("build 12m"). A running task's cell is red at 600 with a red square. A task that asks the owner is ink at 600 with a 1.5 px ink outline. A waiting task says "waiting" and a closed task "done" (with a done-mark square), both muted and without a time. Offline, the running cell turns muted with a gray outline. The full eight steps live only in the task.

### Agent ring (signature)
A robot head with P (planner) or B (babysitter), in a ring that fills with the context use. The arc is red while the agent works and ink while it waits. A fixed tick at 35% marks where an idle agent hands over to a new session; the Copy handover prompt button copies that prompt. A small card on the orbit, at the upper right, counts its open questions: "1", "2" … "9+". 48 px in a desktop header, 56 px floating on the phone.

### Agent card (signature)
Opens from the ring. A head band with a 40 px ring, the Card Head ("Babysitter · api"), the context line ("Context 62% · 124k / 200k") and a notes button; no state word, the ring's color says it. Then the questions, in the same table style as the lane tree: a Raised Sepia head row flush under the band ("#", "needs you", "id", "waiting"), then one 13 px row per question, oldest first, with `line` dividers. A row holds its number, the question title with its task id (or "lane api") under it in 12 px muted, the id as a copy id, and the waiting time. The title of a planner question is an underlined link to its plan change; other titles are plain text. Then Chat and Copy handover prompt. The notes view has a back button and lists what the agent did, with times and a kind (stuck, idea, handover).

### Plan change (signature)
The planner's change to the lanes is read-only. Its band has "Plan change · Q16", the topic and "From the planner · 12 min".

**Lanes table.** Flush under the band, a table in the lane tree's style lists every lane the change touches, the changed lanes first: # | lane | change | what happens. The lane name links to its diff. "change" says "changed", or shows the NEW LANE tag. "what happens" holds the counts ("+2" in `diff-add-ink`, "−2" in `diff-remove-ink`) and a short sentence: "7 tasks move to search-index", "split off from search". Below 520 px the change column goes away. Under the table, one "Why" line holds the planner's reason.

**Lane diff.** Each changed lane is a split diff, like a git review. A title line holds the lane name (15 px, 600) and the counts: "+3" in `diff-add-ink`, "−1" in `diff-remove-ink` and "2 moved out" muted. Under it, two cards side by side: "now" at the left and "after the change" at the right, each with a Raised Sepia head and 12 px corners. Each line has the line number, a sign ("+" or "−"), the tree graph, the task id and title, and the step cell. An added line has the Diff Add fill and a removed line the Diff Remove fill; inside a changed title, only the changed words carry the stronger word tone. Where one side has no line, the cell is a hatched gap. A task that leaves for another lane says "→ lane" after its title, as a link to that lane's box. Runs of unchanged tasks fold into one "⋯ 4 unchanged tasks" button, which opens them in place. Below 600 px of width only the right card shows, with the head "now and after the change"; below 1000 px the step cell shows only the time.

**New lane.** A new lane is its own box under the right card, so it lines up with "after the change". The box has a 1 px ink border, 12 px corners, and a Lift bar with a "NEW LANE" capsule tag, the lane name and "+N". When the lane splits off from another lane, a dashed joint above it says "Split off from lane api", and its first task says "← from api". Every line of a new lane is an added line.

The planner sends every task it moves as its own line, one node per task. The panel cannot open a summary line such as "SAM-305 … SAM-310". The signs are images with a name for screen readers. No Approve and no Reject: the page ends with "Answer in the planner chat with the id, for example Q16 ok."

### Navigation
The floating capsule nav with Home and Projects, on the phone and the desktop; the current tab is a raised capsule with a 1.5 px ink border. After a 1 px `line-strong` divider, a 56 px round theme switch shows the moon in light Sepia and the sun in dark Sepia: the icon is the theme the owner gets. Its name says the same ("Dark theme" / "Light theme").

### Error strip
An ink strip at the top with an icon, one line of what is wrong and one line of what happens now ("You see the last known state. The panel reconnects by itself."). On the desktop it is at least 56 px high with 24 px side padding.

### Loading
What the panel already has shows at once: a lane's header and progress, the agent card's header. What comes from the server (a lane's task tree, the questions, notes and buttons of an agent card, search results) shows as a skeleton until it arrives: still bars in the Raised Sepia tone, in the shape of the rows to come (tree rows with a node square, table rows on the table's columns, card lines). No shimmer and no spinner. If the request fails, one muted line says what did not load, with "Try again". A refresh of something already shown keeps it on screen; only a new lane, a new search or a new card starts from the skeleton. On the desktop a lane pick changes the columns in place, without the phone's page slide. The desk stays one page across a project, its lanes, tasks and plan changes, so the lane search and the scroll stay.

## Do's and Don'ts

### Do:
- **Do** show in a row only what runs: "running" for a project, "N tasks running" for a lane; the lane head gives all three counts.
- **Do** put a question in the card of the agent that asked it, with its id and the waiting time.
- **Do** close a question when the owner answers it in the chat: a hook in the asking agent's session (the babysitter's or the planner's) tells the server, and the row leaves the card.
- **Do** show the agent on every lane and project page, and let the owner drag it out of the way.
- **Do** show a plan change before it is applied, as a split lane diff: "+" and "−" lines, the changed words marked, and "→ lane" for a task that moves.
- **Do** give every focusable element a 2 px ink focus ring with a 2 px offset.
- **Do** write times as "11:20" for today and "Nov 13, 20:30" for another day.

### Don't:
- **Don't** use red for a question, an error or anything that does not run.
- **Don't** add an accent color, a gradient, glass, blur or a second attention color.
- **Don't** put a list of questions on a page; questions live in the agent card.
- **Don't** write a state word ("asleep", "working") next to an agent; the ring says it.
- **Don't** add Approve or Reject to a plan change.
- **Don't** use a font size outside 11, 12, 13, 14, 15, 16, 20 and 28 px, or cut a title with "…".
- **Don't** use the diff green or red outside a lane diff.
- **Don't** draw drag handles or drop zones for tasks; the tree is never edited by hand.
- **Don't** use real client, project or task names in designs or code; sample data is made up.

### Open points
- Done and running squares differ only by hue (1.64:1). The labels say the state in words; a mark inside the red square was tried and left out.
- The settings page is not drawn. There is no Archive and no eval page.
