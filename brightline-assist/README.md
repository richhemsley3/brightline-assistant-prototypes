# Brightline Assist

A concept prototype: the three Brightline portals after onboarding, with the assistant from Network Assist built in. You land on a briefing. When you ask, the assistant takes over the page the way the Network Assist prototype does: the question becomes the title, the work shows in the open, the answer composes from a figure, the causes, a chart and one prepared action, and anything that changes the world is approved on the platform's own sheet, with a receipt and a window to take it back.

No demo controls, no marketing site. Refresh to start over.

## Who and what

Sign in as one of three people on the morning of June 2, 2026. Each has one story in three turns.

Each story runs on actions. The first answer ends in a prepared action; a drill-down carries the same action with it; approving it gives a receipt and the next steps that follow from it, each an action of its own, until the chain ends back at the briefing.

| Seat | Ask → first action | Next steps that follow |
| --- | --- | --- |
| Dana Iverson, VP of Partnerships, Brightline Bank · Partner Portal | Which disputes do I need to respond to? → Counter dsp_41e (sheet, withdrawable ten minutes); the evidence rows can be unticked and the counter follows | Answer dsp_41d's retrieval (sheet) → add a rule for retrievals like it (sheet, Turn off) · Tell me when the issuer decides (in place, Turn off) · Acknowledge Release 26.2 (sheet, final) |
| Marcus Bell, Operations lead, Discover Global Network · Agent Portal | Which partners are behind their plans? → Book Halcyon into June 1 to 5 (sheet, slot releasable ten minutes) | Send Grace the week's details (sheet, Recall) · Hold the week on Ana's calendar (in place, Release) · Answer Devin Marlow about the letter (sheet, Recall) → Remind me if the letter doesn't come (in place, Clear) |
| Priya Raghavan, Lead integration engineer, Brightline Bank · Developer Portal | What failed overnight? → Retry evt_89f5b9 now (sheet, can't be recalled) | Shorten the retry schedule (sheet, Put it back) · Alert me when a delivery fails twice (in place, Turn off) · Send Cedar Books the 400 report (sheet, Recall) |

The charts are instruments for the decision, not summaries, and they are built to be read at a glance: Dana sees what cases like dsp_41e won by what was sent, with the prepared set on top; Marcus sees what each certification week does to Halcyon's go-live and can pick a week, which rewrites the booking, its sheet and its receipt; Priya sees her endpoint's answers by hour since the failure, the one red hour, and the scheduled retry waiting at the end. The home's sparkline shows the value and its day or hour on hover.

Each home is the assistant's briefing: a byline, a violet headline, the day's figure with a sparkline and three side figures, the ask field with one suggested question, then the lead insight with its evidence rows and the page's one button, and two more insights.

## How it moves

- The ask field sits in the page between the figures and the insights. Click it and the question types in place while the rest of the page dims. Nothing happens until you send.
- On send the field drops to the bottom as the assist bar, the question rises into the title, the sidebar steps aside and the header stays.
- The work shows as steps with results, then folds into one line ("Read … · as of …") with a steps toggle that opens the query.
- The answer's words arrive one at a time. The figure counts up, the split fills, the causes land, the chart draws, and the prepared action blooms once.
- Before a decision the assistant offers a way to look closer ("Before you decide"); the first also waits inside the bar with a Tab key. After a receipt it offers the next steps that follow from what was just done ("Next"), each leading to an action. Actions that only change a setting of your own happen in place with an undo; everything else goes through the platform's sheet. The prototype never moves on without you.
- One rule for controls: anything you say to the assistant is a violet chip (the home suggestion, "Prepare the counter" on the lead card, "Before you decide", "Next", "Continue", the question offered on an unbuilt page); there are no text links. Anything that acts on the platform or the page is a button, Heritage for the one commit on screen and tonal for the rest (Not now, Withdraw, Edit, Back to the briefing).
- The briefing's chart is bars from zero, one per day or hour, with a dotted grid and its scale on the left, a dated axis and the last bar dark and labelled; hover any bar for its value and day. No line, no curve, no fill.
- The header is the portal's own, as in the Brightline demo (mark, organisation, find box, the needs-you count, Help, the person). When the assistant is active the find box steps back. The close button on the assist bar at the bottom (always on screen), Escape, or the portal mark returns you to the briefing with the sidebar back, and the conversation is kept: the briefing offers "Continue: …" to pick it up where you left it. Asking a new question replaces it.
- The confirm sheet is the platform's, not the assistant's: no ring, no violet. The receipt shows what happened, with a countdown on the cancel where one exists.

## Files

- `index.html`, `assist.css`, `assist.js`, `data.js`: the prototype. All content, including the 18 flows, is in `data.js`.
- `design-system/icons.js`: the demo's icon set, used by the header and sidebar.
- `dist/artifact.html`: the same page without the document skeleton, for publishing as a claude.ai artifact.
- `img/`: the three portraits.
- `_v1/`: the first, rejected build (gn.css look, header ask field), kept as source for reference; it no longer runs here since the gn.css copies were removed.
- `BRIEF.md`: the brief this was built to.

Serve the folder statically (launch config `brightline-assist`, port 8100).

Everything in it is invented: Brightline Bank, its merchants, the people, every figure.

## Look (Nov 23, 2026)

Restyled onto the Brightline Onboarding v5 language by `assist-v5.css`, loaded after `assist.css`: Design System Labs semantic tokens (`tokens/colors.css`), Proxima Nova (`fonts/`, replacing the Figtree stand-in), nothing under 14px in the assistant's page, an 8px grid. Titles 28/32, the voice 17/28 in the system's info colour, figures 48 light, section heads 17. Surfaces only for what waits or floats: the prepared action with the Ring, the ask field and the bar, the sheet, menus; the home's three insights are a quiet toned group. Turn content sits on the page, turns divided by one rule, and each turn puts the prepared action and the asks before the evidence (DOM order in `runFlow`). The one commit is navy; asks are white chips with navy text. Charts use the system's series (navy, teal, light blue) with 14px labels. The AI flourish keeps the multicolour flow on the Ring, mark and spinner. The portal header and sidebar keep their layout and sizes (13px counts and group labels included); only the family and token colours changed there. `?fast` skips the timing for checks.

**Nov 23, 2026, cards where they belong** (the Network Assist v2.1 rule): language on the page (titles, trace, the assistant's sentences, asks), composed objects in white cards on a warm grey 025 page (home figures and insights; in a turn, the figure, charts, tables, drafts, code and receipts). The ask field, bar and prepared action keep the 1.5px multicolour border over their fill, with the glow. Portal header and sidebar unchanged.

- Nov 23, 2026 (V14): reading, comprehension, then action. Each answer turn now reads sentence, evidence (figure, charts, tables, drafts, code), the prepared action, then the asks, just above the bar. On home the ask field comes after the figures and insights as the last row, sticky to the window bottom so it stays in reach.

- **Charts, Nov 23, 2026.** Rebuilt to the shared CHARTS.md (in brightline-onboarding/design): every chart is HTML with true-size text and a tooltip per mark. Home and hourly series are columns from zero on a dated axis, the latest in navy; the week picker is a pickable timeline (plan hollow, landing filled, today dashed) that still rewrites the booking; win rates are a meter list out of 100%; issuer p99 is ranked bars on a stated millisecond scale. Receipt progress bars that only timed the cancel window are gone (the countdown says it); the 24-cases meter stays.


## Shared style and handoff

The rules this prototype follows, the chart rules, the cross-session handoff (how to run, check and publish all three assistant prototypes, and the decision log) and the check tools are in `~/Desktop/Claude/assistant-style/`: `STYLE.md`, `CHARTS.md`, `HANDOFF.md`, `tools/`. Read `HANDOFF.md` before changing Brightline Assist.
