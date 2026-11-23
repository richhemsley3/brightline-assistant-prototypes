# Re-planning the prototype against the v2 flow

November 22, 2026. Written to agree before building. The v2 flow is `~/Desktop/Claude/Agent Assist Research/Engineer-Onboarding-Flow-Plan.md`; this document says what it means for the prototype in this folder, what stays, what changes, what is new, and the decisions that are Rich's before any of it is built.

## The brief, restated for v2

Priya is handed a direct network connection on March 10 with a first ramp step promised for May 14. Most of those ten weeks are other people's moves. The one thing she must see first is still **the integration the assistant drew from her description, with the next thing to do already prepared**, and now also **what has been started on her behalf and whose move it is**. The register is unchanged: the Brightline Assist grammar, the drawn integration as the route's instrument, two sentences a turn, parts carrying the numbers, chips for asks and buttons for acts.

Standing rules this plan keeps: the drawn integration with the figure tiles and the floating note is the route (V10 baseline); no stepper, no row-list route, no timeline instrument; taps explain and never launch; the route turn is an outline and decisions happen inside steps; nothing moves without her.

## What v2 asks of the prototype

| v2 principle | Prototype today | What has to change |
| --- | --- | --- |
| Two tracks from day one | One linear list of eight steps; `curStep` is the first not done | A long-lead track with owner, raised date, due date and state, beside the build steps |
| Waits are turns | Nothing between a receipt and the next step | A wait turn: whose move, since when, what changed, what she can do meanwhile, a nudge |
| Time passes | Everything happens "today" | A demo clock, a return briefing ("since March 10…"), dates on the route |
| Map the messages | Absent | A build step with the scenario grid, agent-run, mismatches opening the reason |
| The back office | Settlement and disputes are only configuration values | A step with finance and operations: sample file, reconciliation checklist, test dispute |
| People coordinated | Only Dana, by one note | Dana Iverson, Marcus Bell, Ana Okafor, her network team, finance, operations: drafts, tickets, owners on waits |
| Launch is a ramp | Activation at 6:00 AM, first-hour chart | Pilot cohort, 10%, 50%, 100%, each gated by the first file reconciling; reroute always present; hypercare; retirement |
| Events honesty | Fork: webhooks · MCP subscription · polling | Fork: webhooks · polling; the agent's watch of the sandbox is an inline act while she builds |
| Two layers | Answer turns exist (scope, cases, why, fix, fail) | Keep; add the reasons the new steps need (a mismatch, the ramp thresholds, what am I waiting on) |
| The route firms up | Weeks are a static sum | Near steps carry dates; far steps carry estimates with the assumption; both re-derive at gates |
| Metrics | None shown | Time to first call on step 1's receipt; rounds on certification; the margin's "at risk" line |

## Keep · change · add

**Keep as is.** The home (the ask alone, the known line). The route turn's shape: two sentences, the figure tiles, the drawn integration, the floating note with "Change this", the legend. The margin drawing. The engine: trace → voice → parts → prepared → sheet → receipt → next; chips and buttons; the bar's intents; the `?auto=` test hook and the screenshot walk. The two diagnostic beats. The scope and cases answer turns.

**Change.**
- `STEPS` becomes the v2 list (intake, day one, 1 to 10, operate) with a `track` on each (build or long-lead) and a date range computed from the clock, not a static week count. `weeksLeft()` becomes "first ramp step May 14 · on track / at risk by N days", derived from the latest long-lead due date and the certification assumption.
- The figure tiles on the route turn: **Weeks** (to the first ramp step) · **Steps** · **Out with others** (count, and the next one due) · **First ramp step** (May 14). Cases move into step 7's receipt, where they are known.
- The margin reads "Step 4 of 11 · about 4 weeks left · first ramp step May 14" and, under the drawing, up to three lines of their moves: owner · item · due. Not a card, not a grid.
- The drawn integration: the host → authorization connection shows a waiting state while connectivity is out (hollow segment, the owner's initial), and its note says whose move it is and when it is due. Tokens stay deferred as today.
- The events fork drops the MCP subscription as a production choice. "Watch the sandbox from my agent" becomes an inline act in step 4, in place with an undo, like local forwarding.
- Step 8 (go-live) is replaced by the ramp. The first-hour chart becomes the cohort instrument.
- People get their names from the story: Dana Iverson (sponsor), Marcus Bell (the network's operations lead, who holds the allowlist, the production objects and the activation plan), Ana Okafor (certification: the window and the round reviews). Her own side: the network team (firewall and the CA), finance, operations, on-call.

**Add.**
- **Day one.** A checklist of the five long-lead items with owner and due date, and the requests prepared. See decision 4 for how many sheets.
- **The clock.** `R.today`, shown in the header as "Mar 10 · day 1". Time moves only when the viewer moves it (decision 3). Moving it produces a return briefing turn: "Since March 10: the allowlist opened on the 22nd, the chain was issued on the 21st, the firewall change is booked for April 2." Rows, then the next step prepared.
- **Wait turns.** A flow kind with the owner, since, due and what changed as rows; chips under "Meanwhile" for the build steps she can do now; a standing tonal button "Nudge" that opens a sheet with the drafted note. No prepared card, because nothing is hers to approve.
- **Step 3, map the messages.** The scenario groups as the chart (passed over total per group, the same part certification uses), an inline act "Run the group from my agent" that fills the group, one mismatch that opens the reason (the field, her value beside the expected one, the rule), and the grid completing. Nothing through the sheet.
- **Step 5, the back office.** Rows for the reconciliation checklist, a draft to finance, acts: deliver the sample file (sheet), send a test dispute (sheet), send the checklist (sheet with To · Says · Then, like the note to Dana). Finance's sign-off is a wait.
- **Certification in rounds.** After the run, "Submit the round" (sheet) leads to a wait on Ana (two to three days on the clock); her comments return as rows; a second round passes; "Confirm the window". The round count shows on the receipt.
- **Step 9, readiness and go/no-go.** The production objects as a checklist (requested on day one, landing as the clock passes), the readiness rows, the go/no-go note to Dana and Marcus (sheet), "Record the decision".
- **Step 10, the ramp.** The cohort instrument (approvals, declines, round trip, deliveries against the gateway's baseline), a prepared card per step with its gate stated, the gate as a one-day wait on the clock ("the first file reconciled at 6:14 AM"), a standing "Reroute to the gateway" button, the hypercare schedule and the retirement date on the receipt.
- **Reasons.** What am I waiting on (the long-lead rows with owners and dates), a mismatch (step 3), the thresholds (step 10). Existing: why these steps, the scopes, the cases, the chain, the rounding rule.
- **Intents.** "what am I waiting on", "nudge marcus", "skip ahead", "reroute", "how many rounds".

## The demo arc, with the clock

| Clock | Turn | What happens | Ends in |
| --- | --- | --- | --- |
| Mar 10 | Home → route | She describes; the integration is drawn; the tiles say 10 weeks, 11 steps, 5 out with others, May 14; the lead names the gate at risk (connectivity) | Next: day one |
| Mar 10 | Day one | The five items with owners and dues; the requests go out | Receipts; the margin shows their moves |
| Mar 10 | Step 1 · first call | As today, plus the time-to-first-call figure on the receipt (11 minutes) | Next: agents · map · tell Dana |
| Mar 10 | Step 2 · agents | As today | Next: map the messages |
| Mar 10 → 24 | Step 3 · map | The grid fills by group; one mismatch opens the reason; the clock advances two weeks when she is done | Next: events |
| Mar 24 | Return briefing | Since March 10: allowlist open, chain issued, firewall booked Apr 2, Ana held the week of Apr 13 | Next: events |
| Mar 24 | Step 4 · events | Webhooks or polling; test event; forward to localhost; agent watch | Next: back office |
| Mar 26 | Step 5 · back office | Sample file, checklist to finance, test dispute | Wait on finance |
| Mar 26 → Apr 2 | Wait turn | Finance's move, since Mar 26; meanwhile: read the reference, add tokenization later | Clock to Apr 7 |
| Apr 7 | Step 6 · secure | Handshake fails; the chain diagnosis; the corrected chain; handshake | Next: configuration |
| Apr 8 | Step 7 · configuration | Confirm; 21 cases; certification re-estimated to two rounds | Next: certify |
| Apr 8 → 29 | Step 8 · certify | Run; three fare-capping cases fail; the fix; submit round 1; wait on Ana; her two comments; round 2 clean; window confirmed | Next: readiness |
| Apr 29 → May 11 | Step 9 · readiness | Production objects land; readiness rows; go/no-go note; decision recorded | Next: ramp |
| May 14 → 28 | Step 10 · ramp | Pilot cohort; first file reconciles; 10%; 50%; 100%; reroute never pressed; hypercare | Hand-off |
| May 28 | Operate | Continue in the Developer Portal; the route shows one remaining step: retire the gateway on Sep 25 | End |

Every arrow in the table is a click. The clock moves only on the viewer's act.

## What has to be built (engine)

- **Route state.** `R.today`; `R.long` (five items: owner, raised, due, state: not raised · out · landed); `R.rounds`; `R.ramp` (cohort · 10 · 50 · 100, and the reconciled gates); dates on steps.
- **Flow kinds.** `wait` (rows + Meanwhile chips + standing Nudge). `return` (the since-briefing). The existing step flow with a `checklist` part (rows with state, owner, due; the prepared card is the next unchecked item; approving re-renders the checklist in place).
- **Parts.** Checklist (a `rows` variant with a state column and owner). The cohort instrument (the existing `drawChart` lines with a baseline series). The scenario grid reuses the certification chart.
- **Acts.** Standing acts outside the prepared card (Nudge, Reroute): a tonal button in the turn's foot that opens a sheet. Draft acts are sheets with To · Says · Then rows, as the note to Dana is today.
- **The clock control.** The header date chip opens a small menu: "Skip ahead to the next move" (and "Start the route over", moved here from the person menu). Skipping redraws the route, the margin and the tiles, and opens the return briefing turn.
- **The drawing.** A `waiting` state on edges with an owner mark; note text with owner and due.
- **The margin.** Their-moves lines under the drawing; the at-risk line.
- **Data.** All copy for day one, the return briefings, the waits, steps 3, 5, 9 and 10, the new reasons, Ana's comments, the thresholds; `INFO` and `INTENTS` extended; the events fork reduced; names corrected.
- **Tests.** `?auto=<turn>&today=YYYY-MM-DD&done=…&long=allowlist:landed,…`; the screenshot walk of every turn before publishing; README and PLAN updated.

## Order of work

1. Route state, the clock, dates on the route, the tiles and the margin lines. Screenshot the route turn and the margin.
2. Day one and the wait turn kind, with the first return briefing. Screenshot.
3. Step 3 (map) and step 5 (back office), with their reasons. Screenshot.
4. Certification in rounds, readiness with the go/no-go, the ramp. Screenshot.
5. Events fork reduced; names; intents; README and PLAN. Phone pass. Publish.

Each numbered item ends with a screenshot walk shown to Rich before the next begins, so a wrong turn costs one pass, not five.

## Decisions for Rich before building

1. **Scope.** Build the whole v2 arc (all five passes above), or the structural passes first (1 and 2: the clock, day one, waits, the two tracks on the route and margin) and show that before the new steps. *Recommended: structural first.* It is where the risk is, and it changes every turn that exists today.
2. **The long-lead track's instrument.** No timeline: the count and next due in the tiles, their-moves lines in the margin, the waiting state on the drawing, and the rows inside the wait and "what am I waiting on" turns. Or a compact two-track band under the drawing on the route turn only. *Recommended: no timeline.* The band is the pattern "the timeline looks claude generated" already rejected; the tiles, margin and notes carry the same facts in the assist vocabulary.
3. **How time passes.** A date chip in the header with "Skip ahead to the next move", which opens the return briefing turn. Or a chip inside each wait turn that jumps to when it resolves. *Recommended: the header date chip.* A chip is something she says to the assistant; skipping time is the viewer's act, not hers, and the return briefing is the real behaviour (she comes back days later and the briefing tells her what moved).
4. **Day one's acts.** One sheet per item (five), or grouped by owner (one request to Marcus covering the allowlist, the production credentials and the window hold; one CSR to her CA; one ticket to her network team). *Recommended: grouped by owner, three sheets.* It is how the requests actually go out, and the checklist still shows five items with their own dues.

Taken by default unless Rich says otherwise: the clock's dates as in the demo arc table; two certification rounds; Ana's two comments as the realistic review; the pilot cohort is Marlow & Third (one merchant from the story); hypercare two weeks; gateway retirement 120 days after 100%; metrics shown only where they land (step 1's receipt, step 8's receipt, the margin).

## Decided, November 22

Rich answered the four decisions the same day:

1. **Scope: the whole arc.** All five passes, with a screenshot walk after each, and one review at the end. Not structural-first.
2. **The long-lead track: no timeline.** The count and next due in the tiles, their-moves lines under the margin drawing, the waiting state on the drawn connection, rows inside the wait turns.
3. **The clock: the header date chip.** "Skip ahead to the next move" opens the return briefing turn. Skipping is the viewer's act.
4. **Day one: grouped by owner, three sheets.** One request to Marcus (allowlist, production credentials, window hold), one CSR to her CA, one ticket to her network team. The checklist shows five items with their own dues.

The defaults above stand. Build to this document; record what differs in the building under "Built" when it is done.

## Built, November 22

Built the same evening, as one hybrid: the engine and every design decision in one hand; the seven content parts drafted in parallel by agents working from a written contract (`v2-contract.md`: the facts sheet, the schemas, the voice rules) and a checker that validates a draft against the engine's schema, each draft then critiqued for voice and rules by a second agent and the seven reconciled together by a third; then every turn state walked by screenshot (39 states, desktop and phone) and the defects fixed.

What differs from the plan above:

- **Content lives in `data-v2.js`**, assembled from the seven parts and loaded after `data.js`, rather than edited into `data.js`. The engine data (route state, the clock, the long-lead items, the steps, the drawing's waiting state) is in `data.js`; the v1 turns stay there and are overridden where v2 changes them.
- **`R.done` is keyed by step key**, not number; acts carry `step:'s4'` and may carry `steps:['s1','agents']` when one approval completes two steps (the MCP first call also connects her agents).
- **Everything on the clock is derived**, not scripted: the long-lead landings from the day-one requests, Leah's sign-off a week after the checklist, Ana's review five days after a submission, each ramp gate the morning after a step. "Skip ahead" jumps to the earliest of them; the return briefing lists what passed and what is still to come. The test hook (`?auto=…&today=…&acts=…`) replays any state.
- **The gate is a field on a step** (`gate: R → wait id`): a step that cannot start redirects to its wait turn, so the same chip ("Secure the connection") opens the wait before the moves land and the step after.
- **Sequences and standing acts.** A step may carry `acts:[…]` approved one at a time, re-drawing its checklist after each (day one, readiness); or `standing:[…]` for a button that is always there (Reroute to the gateway; a Nudge inside a wait), which opens the sheet and leaves a receipt in place without advancing.
- **The drawing's waiting state** is a dotted connection with an amber sub-label ("waiting on 3 moves · due Apr 2") and a note that names the owners; no second instrument was added.
- **Phone width** needed the date chip to shorten to "Mar 20" and table cells in the descriptive columns to wrap.

## Applied: the v5 design on the live prototype (built Nov 22)

Rich, Nov 22: "run this for the rest of the prototype." The agreed screens are `design/a5.html`, `b5.html`, `c5.html` on `design/v5.css` (Design System Labs tokens from `design/tokens/colors.css`, no gradients, white page ground, 14px minimum text, 8px grid, the action before the evidence). Plan, from reading the engine:

1. **Stylesheet.** Add `onboard-v5.css` after `onboard.css`, restyling the engine's own classes on the `--sds-*` tokens: `.appbar`, home (`.home`, `.bh`, `.reply`, `.sugg`, `.known`), `.qtitle`, `.trace`/`.step`, `.summary`, `.said`, `.lead-p`, `.figure`, `.paycard`/`.pays`, `.chartsec` and the SVG `.orow .fill/.trk`, `.code`, `.draft`, `.routemap`/`.imap`/`.rnote`, `.prepared`, `.receipt`, `.recs .chip`, `.standing`, `.btn`/`.tonal`, `.scrim .sheet`, `.toast`, `.menu`, `.composer`. Copy the Proxima Nova files and `tokens/colors.css` beside it.
2. **Left step rail.** Make `#rail` a fixed left column in answer state (288px; `.s-answer` padded left) and rewrite `drawRail()` to list steps (clock, "Their moves" with `R.long` items and dates, "Your build" with done / now / waiting from `R.done`, `curStep()` and each flow's `gate`) instead of the compact drawing. Show it from the route turn on.
3. **Turn head card.** In `openTurn`, create a `.thead` card holding the title and trace; in `runFlow`, `runChoice` and `hear`, put `said`, `.summary` and `.lead-p` into it, and move a `fig` part into it in `buildParts`. `.turn` becomes a single-column stack.
4. **Reading pane.** Add `#pane` (fixed right, 432px; the column re-centres when closed), a `DOCS` file with six reference pages (authorization response and partial approvals; events and signatures; mutual TLS and the chain; certification cases and rounding; the settlement file and reconciliation; the ramp thresholds), and a reference row in each step that has one.
5. **Verify.** Walk all 39 states at 1600 and 400 with `walk.js`, check text ≥ 14px and no card overflow, then republish the artifact with the new files.

**Built, Nov 22.** All five steps. `onboard-v5.css` (after `onboard.css`), `docs.js` (six pages, `refs` by turn id), `tokens/colors.css` and `fonts/` beside the engine. The engine changes: `drawRail()` lists the clock, their moves and your build, with steps that open their turns (a strip under 1000px that opens on tap); `.thead` holds summary, title, said, lead, the head figure, the route's figures and the reference row; CSS `order` puts the prepared action, standing acts and asks before the evidence; option charts are HTML bars; `openPane()` shows a reference page or the drawing, follows the turn while it is open, and floats over the column under 1280px. Walked all 39 states at 1600 and 400: no page errors, no text under 14px, nothing past its card, no page overflow. Artifact DdtQ3R5fxAvRetZrwWKoTC version 17.

**Changed, Nov 23.** Rich: the integration drawing "seems pointless" → removed (route turn, rail link, pane view, notes, styles). Its lines repeated their labels and its states repeated the rail. The route turn keeps its four figures; the lead names the assumptions and says to correct them in the bar. Rich: "I don't want literally everything to be in a card" → a surface only for the prepared action (with the Ring), the bar, the rail, the pane and the sheet; the turn head, the evidence and receipts sit on the page, turns divided by one rule. The multicolour flow is back on the Ring, mark and spinner.

**Changed, Nov 23 (later).** Rich, after Network Assist v2.1: cards "when appropriate", applied here too. Language on the page (the turn head, asks, standing acts); composed objects in white cards (charts, tables, drafts, code, figure, receipts) on a warm grey 025 page. The prepared action keeps the multicolour border over its fill.
