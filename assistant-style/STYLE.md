# Assistant prototypes: style instructions

The visual language shared by three prototypes:

| Prototype | Folder | What it is |
|---|---|---|
| Brightline Onboarding | `~/Desktop/Claude/brightline-onboarding/` | Priya's technical onboarding, guided by the assistant turn by turn, with a step rail and a reference pane |
| Brightline Assist | `~/Desktop/Claude/brightline-assist/` | The three Brightline portals (Dana, Marcus, Priya) with the assistant built into each home |
| Network Assist | `~/Desktop/Claude/payments-assistant-direction/experience/` | The payments assistant for Halden Supply Co.; public reference build for the Figma instructions |

This file is the rule set. `CHARTS.md` beside it is the chart rule set. The Figma build guide (`payments-assistant-direction/figma/network-assist-figma-instructions.md`) is the same language specified to the pixel for Network Assist. Where this file and a stylesheet disagree, this file is the intent.

Last updated November 23, 2026. Each rule carries the reason Rich gave, so it can be applied to cases this file does not list.

---

## 1. The rules

1. **Colour comes from Design System Labs, by its semantic tokens.** Never pick a colour by feel and never build a palette when the system has a role for it. *Rich: "this palette sucks. use our design labs palette instead."*
2. **The AI flourish is the multicolour flow, and only on what the assistant owns.** A 1.5px gradient border of blue #3144B7, periwinkle #9EAAFC and orange #FE6200 drifts along the ask field, the assist bar and a prepared action, with a soft glow of the same colours behind it; the assistant's mark is a ring in those colours, and so is the trace spinner. The border must show all the way round, not just the glow. It never touches money: figures, tables, the confirm sheet and the commit button stay plain. *Rich: "I want the multicolored gradient back"; "bring back the color gradient border … Not just the glow."*
3. **No other gradients.** No background washes, gradient tiles, chart fills or brand marks. *Rich: "ditch the gradient. it's out of place."*
4. **Language on the page, objects in cards.** The assistant's sentences, the person's question, the work trace and the asks sit on the page. Composed objects are white cards: home figures and insights; in a turn the figure, charts, tables, drafts, code and receipts. *Rich: "I don't want literally everything to be in a card", then "it needs cards when appropriate."*
5. **Home is a normal page; assist mode is a conversation.** Home fills the page container, left aligned, on a card grid, with a page title. The centred reading column appears only once the assistant is active. *Rich: "I don't want this centered column by default, only when in assist mode."*
6. **The home ask sits high.** On home the ask field sits between the figures card and the insights, in the page flow, easy to see and reach. It is never moved to the end and never pinned. Once the assistant is active it travels to the bar pinned at the bottom. *Rich: "it shouldn't sit at the bottom of the home page. it should be higher up so it's easier to see and access. Once it's in active mode, then it moves to the bottom."*
7. **Turns read, then explain, then act.** The question, the work summary, the assistant's sentence; then the evidence; then the prepared action and the asks, ending just above the bar. *Rich: "Think about logical ordering based on reading, comprehension, and then action."*
8. **Asks are chips; acts are buttons.** An ask to the assistant is a chip. An act on the platform is a button: one navy commit in view, secondary buttons outlined. No text links as actions, no arrows.
9. **Every chip row says what it is for.** A framing label when there is one ("Before you decide", "Meanwhile"), otherwise "Suggested" ("Suggested next" after an approval). Never a bare row of chips or a vague "Next". *Rich: "I want the buttons below to say 'recommended' or 'suggested' … Otherwise these buttons aren't clear."*
10. **Suggestions do not persist.** Once the person acts (clicks an ask, accepts the bar's suggestion, approves), the suggestion rows in earlier turns leave the feed; they are not greyed out and kept. New suggestions appear at the end of the latest turn. Choices she made (Onboarding's forks) and standing acts ("Always here") stay. *Rich: "Suggested actions for agent assist shouldn't persist in the feed once an action has been taken… they shouldn't live forever in the feed higher up."*
11. **Nothing under 14px, on an 8px grid.** Line heights 24 (28 for the lead), spacing in multiples of 8.
12. **No dead space.** A block waiting to appear takes no space until it does. The room under a conversation is the bar's height plus 32. *Rich: "Sometimes there's dead space when I scroll in agent assist mode."*
13. **Charts are instruments.** The form follows the reader's job; no bar whose length means nothing; every mark has a tooltip. See `CHARTS.md`. *Rich: "Make sure we don't just use progress bars when they're not useful."*
14. **Honour decisions already made.** Before reordering or restyling, check the decision log in `HANDOFF.md`. *Rich: "You ignored decisions we made before."*

## 2. Colour

Every value is a Design System Labs semantic token (`tokens/colors.css` in each project; Network Assist inlines the light set). Hex values are for reference.

| Role | Token | Hex |
|---|---|---|
| Page canvas | `--sds-color-warm-gray-025` | #FAF8F5 |
| Cards, chrome, AI objects, sheet | `--sds-bg-page` | #FFFFFF |
| Subtle tone (query block, key cap, approved action, hover) | `--sds-bg-subtle` | #F4F1EB |
| Text | `--sds-text-primary` · `-secondary` · `-tertiary` | #1C1A17 · #54514D · #6B6760 |
| The assistant's voice (its sentences, chip-row labels, suggested question) | `--sds-status-info-text` | #0C4A69 |
| Commit button, send, checkbox on, chip text | `--sds-interactive-primary` (hover `-hover`) | #013D5B (#05314D) |
| Chip edge | `--sds-color-blue-200` | #A6CBD6 |
| Secondary button | `--sds-interactive-secondary` + 1px `-secondary-border` | #FFFFFF + #302D28 |
| Selected nav item, selected filter, picked row | `--sds-nav-item-active-bg` + `-active-text` | #D9EBED + #013D5B |
| Rules inside cards and between turns | `--sds-border-subtle` | #EBE6DD |
| Card edge, chrome edge, chart baseline | `--sds-border-default` | #E0DCD3 |
| Status words | `--sds-status-success-text` · `-error-text` · `-warning-text` | #62800B · #BF5547 · #8A7515 |
| Chart series | `--sds-chart-1` · `-2` · `-3` | navy #013D5B · teal #4F8AA0 · light blue #A6CBD6 |
| The AI flow (only exception to the palette) | n/a | #3144B7 · #9EAAFC · #FE6200 |

Status is a coloured word, never a pill or badge.

## 3. Type

Proxima Nova, weights 300, 400 and 600; tabular figures everywhere; SF Mono for code. The font files are licensed: they live in each project's `fonts/` and are never committed to a public repo (Network Assist names Proxima Nova and falls back to the system sans).

| Use | Size / line | Weight | Colour |
|---|---|---|---|
| Large figure | 48 / 48 | 300 | text/primary |
| Medium figure | 28 / 32 | 300 | text/primary |
| Page title, question title | 28 / 32 | 600 | text/primary |
| Briefing sentence on a home | 22 / 32 | 400 | voice, figures 600 primary |
| Prepared action title, sheet title | 22 / 32 | 600 | text/primary |
| Answer sentence (lead) | 17 / 28 | 400 | voice, facts 600 primary |
| Section title in a card | 17 / 24 | 600 | text/primary |
| Everything else | 14 / 24 | 400 or 600 | per role |
| Commit button | 15 / 24 | 600 | white |

Phone (below 600–760): titles 22 / 28, lead 16 / 24, briefing 17 / 28, large figure 40 / 48.

## 4. Space, radii, surfaces

- Spacing: 4 (inside small controls), 8, 12, 16, 24, 32, 48. Cards pad 24 (16 on phone). Gaps between cards 24; between turns 48 with a 1px rule.
- Radii: 12 cards and AI objects, 10 buttons and chips, 8 nav items, filters, tooltips and the query block, 4 bars and checkboxes, 16 the sheet.
- **Card:** white, radius 12, shadow `0 0 0 1px border-default, 0 1px 2px rgba(28,26,23,.04)`. Hover on a clickable card: the edge darkens to border-strong with `0 8px 24px -12px rgba(28,26,23,.18)`; nothing moves.
- **AI object:** white fill, no card shadow, the gradient border (`.ring::after`, 1.5px) over it and the glow (`.ring::before`) behind. The host needs `isolation:isolate`, or its own fill hides the border.
- **Sheet:** floats with `0 0 0 1px border-default, 0 16px 40px -16px rgba(28,26,23,.28)`. It is the platform's: no AI styling.
- **Chrome:** header and sidebar white, each with a 1px border-default edge against the warm-grey canvas.

## 5. Components

| Component | Spec |
|---|---|
| Header | 56 high, white, 1px bottom edge; mark (24, navy, radius 6), org and state, nav items or search, help, the person. In Brightline Assist the portal chrome keeps its own layout and sizes (Rich: "you dramatically changed our nav"); only colour, font and the edge changed. |
| Sidebar (Brightline Assist) | White, 1px right edge; collapses in assist mode. |
| Page header (home) | Title from the nav item ("Overview", "Your turn", "Home"); under it the byline with the assistant's mark; then the briefing sentence. |
| Figures card | A large figure with its delta and a small dated column chart; a column of three side figures divided by rules. Phone: side figures become rows, label left, figure right. |
| Insight card | Label, figure, the assistant's sentence; the lead insight carries its evidence rows and its own action. Clickable as a question. |
| Ask field (home) | 56 min height, radius 12, AI border, mark, placeholder, send (40, navy when ready). A "Suggested" label and chip under it; a scope line ("Looking at …") after typing. |
| Question title | 28 / 32, the person's words, ink. |
| Work trace, summary | Steps with spinner then check; folds into a one-line summary with "N steps" (dotted underline) when done, leaving no gap. |
| Prepared action | The one surface in a turn: label with the mark ("Waiting for your approval"), title 22, meta line, commit button on the right (under the meta on phone). Approved: subtle tone, no border, label in success text. |
| Asks row | Label in the voice colour with the mark, then chips (40 high, white, 1px blue-200 edge, navy text). Removed from the feed once she acts. |
| Evidence cards | Figure and split (thin segmented bar above swatched rows), charts per `CHARTS.md`, tables (48 rows, rules between, header in tertiary), code (dark block, 14 mono), draft, receipt (success label, title 17, a progress bar only when it has a stated whole, Undo or Cancel). |
| Assist bar | Pinned in assist mode only: 56 min height, radius 12, AI border, mark, text (suggested question in the voice colour with a Tab key cap), send; close button beside it (56 wide). On a warm-grey band so the page passes under cleanly. |
| Step rail (Onboarding) | Fixed left, 288 wide, white with a right edge: the date and day, their moves with dates, your build with done, now and waiting states; each step opens its turn. Phone: a strip that opens. |
| Reference pane (Onboarding) | Fixed right, 432 wide, opened from a turn's Reference links; the column re-centres when it closes; floats over the column below 1280. |
| Confirm sheet | Platform-owned: title, figure, definition rows, Not now and the commit, a note that it is not generated. |

## 6. Layout

- **Home:** full width, left aligned, max 1440, padding 40 (16 on phone). Grid of three columns, gap 24: page header; figures card across all three; the ask section across all three; the lead insight across two columns spanning two rows, the other two insights stacked in the third. Two columns below about 1100–1240; one on phone.
- **Assist mode:** the centred column (896 content, 960 with padding), one column, gap 24–32; the bar pinned at the bottom; the room under the last turn is the bar's height plus 32.
- **Onboarding:** the step rail on the left, the column centred in the remaining space, the reference pane on the right when open.

## 7. Motion

- The AI border drifts 10 s each way, forever; the glow brightens while the assistant works and blooms once when a prepared action lands.
- The question rises from the field into the title (FLIP); the field travels to the bar.
- Trace steps appear, run, check; the trace folds into the summary.
- The answer sentence fades in word by word (28 ms apart).
- Blocks rise in when they appear (opacity and 10px, 700 ms); a block waiting to appear takes no space.
- Columns grow from the baseline (staggered 70 ms); figures count to their value.
- Reduced motion: everything appears in its final state.

## 8. Where it lives in code

| Prototype | The language | Notes |
|---|---|---|
| Onboarding | `onboard-v5.css` after `onboard.css` | Engine `onboard.js`; content `data.js` + `data-v2.js`; reference pages `docs.js`. Turn order by CSS `order`; cells charts by `cellsHTML`. |
| Brightline Assist | `assist-v5.css` after `assist.css` | Engine `assist.js`; content `data.js`. HTML chart builders in `assist.js`. |
| Network Assist | the last `<style id="v5">` block in `experience/index.html` (and the light tokens in `<style id="tokens">`) | One self-contained file. `?to=1..5` opens a chapter. |

## 9. Never

- A colour picked by feel; a gradient anywhere but the AI flourish; the AI border reduced to a glow.
- A card around the assistant's words, the trace or the asks; a composed object loose on the page.
- The centred column on a home; the home ask at the bottom or pinned.
- An action or ask above the evidence it depends on.
- An unlabelled chip row; an old suggestion row left in the feed after she acted; text links or arrows as actions; a second commit in view.
- Text under 14px; dead space you can scroll into.
- A progress bar that measures nothing; a line through daily or weekly totals; chart labels in a scaled SVG.
- Template vocabulary: pill badges, icons in rounded squares, numbered eyebrows, greeting copy, all-caps labels (except where the portal chrome already has them), lifting cards on hover.
- Em dashes in copy; sales-demo narration in product screens.
