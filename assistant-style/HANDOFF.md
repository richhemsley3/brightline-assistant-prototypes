# Handoff: the assistant prototypes

For any Claude session (or person) picking up Brightline Onboarding, Brightline Assist or Network Assist. Read this first, then `STYLE.md` (the rules) and `CHARTS.md` (the chart rules). Last updated November 23, 2026.

**Before changing anything:** read the decision log (§5). Rich's sharpest feedback has been about changes that undid an earlier decision.

---

## 1. Where things are

| Prototype | Source | Published | Current |
|---|---|---|---|
| Brightline Onboarding | `~/Desktop/Claude/brightline-onboarding/` | Public: https://richhemsley3.github.io/brightline-assistant-prototypes/brightline-onboarding/ · private artifact https://claude.ai/artifact/DdtQ3R5fxAvRetZrwWKoTC | Version 25 |
| Brightline Assist | `~/Desktop/Claude/brightline-assist/` | Public: https://richhemsley3.github.io/brightline-assistant-prototypes/brightline-assist/ · private artifact https://claude.ai/artifact/1ULrcgke34wgcgtFrV9NkT | Version 20 |
| Network Assist | `~/Desktop/Claude/payments-assistant-direction/experience/index.html` | Public: https://richhemsley3.github.io/network-assist/experience/ (repo richhemsley3/network-assist, `main`) | Commit 4f104d9 |
| Figma build guide | `~/Desktop/Claude/payments-assistant-direction/figma/network-assist-figma-instructions.md` | Same repo, `figma/` | Version 3 |
| Shared rules and tools | `~/Desktop/Claude/assistant-style/` (this folder; `repo-root/` holds the repo landing page, README and .gitignore) | Public: github.com/richhemsley3/brightline-assistant-prototypes, `assistant-style/` | |

**Repos:** Network Assist is github.com/richhemsley3/network-assist. Both Brightline prototypes and this folder are github.com/richhemsley3/brightline-assistant-prototypes (public, Pages from `main`, landing page https://richhemsley3.github.io/brightline-assistant-prototypes/). Both are mirrors of the local folders, pushed by the scripts in §4.

Project notes: Onboarding `README.md`, `PLAN-v2.md` (the arc and every change, dated); Brightline Assist `README.md`, `BRIEF.md`; Network Assist the repo `README.md`. The artifacts are private: people Rich shares them with need the Share menu on the page.

## 2. Run

Servers are in `~/Desktop/Claude/.claude/launch.json` (start them with the app's preview tools, not a shell):

| Name | Port | Serves |
|---|---|---|
| `brightline-onboarding` | 8101 | Onboarding (`/?fast` skips timing; `?auto=<turn>&done=…&today=…` drives to a state, see `onboard.js` test hook) |
| `brightline-assist` | 8100 | Brightline Assist (`?fast`) |
| Network Assist | 8102 | `node assistant-style/tools/serve.js ~/Desktop/Claude/payments-assistant-direction/experience 8102` (`?to=1..5` opens a chapter: home, query, answer, drill-down, retry) |

## 3. Verify (run after every change)

All tools are in `assistant-style/tools/` and drive headless Chrome over CDP (`shot.js`). Screenshots land in `tools/shots/`.

| Command | Covers | Pass |
|---|---|---|
| `node tools/walk5.js 1600,400` | Onboarding, 39 states (`walk.json`) | no ERRORS, PAGE-OVERFLOW, SMALL (text under 14) or OVER (wider than its card) lines; "wrote 78 shots" |
| `node tools/bawalk.js 1600,1100,400` | Brightline Assist, three seats home → answer → drill → sheet → receipt | no ERR or OVER; `chrome<14 N` is the portal chrome's own small text and is expected |
| `node tools/na-walk.js` | Network Assist, six states at 1440 and 390 | no ERRORS, SMALL, OVER; `HSCROLL 394` at 390 is a clipped pseudo-element and harmless |
| `tools/gapprobe.txt` | Paste as the eval argument to `shot.js` | "below" ≈ composer height + 32 at the end of a turn; no invisible-but-sized blocks mid-build |

Then look at the screenshots yourself. The probes catch errors and overflow, not layout that reads wrong (axis labels drifting from marks, empty card space, collisions). Mid-build behaviour needs a shot taken a few seconds into an answer, not with `?fast`.

## 4. Publish

- **Onboarding:** Artifact publish `dist/artifact.html`, root `brightline-onboarding`, files `onboard.css`, `onboard-v5.css`, `onboard.js`, `data.js`, `data-v2.js`, `docs.js`, `design-system/icons.js`, `img/av-priya.webp`, `tokens/colors.css`, `fonts/ProximaNova-{Light,Reg,Sbold}.otf` (contentType `font/otf`). On a small change send only the changed files; the rest are kept.
- **Brightline Assist:** Artifact publish `dist/artifact.html` with `url` https://claude.ai/artifact/1ULrcgke34wgcgtFrV9NkT, root `brightline-assist`, files `assist.css`, `assist-v5.css`, `assist.js`, `data.js`, `design-system/icons.js`, `img/av-{dana,marcus,priya}.webp`, `tokens/colors.css`, `fonts/*.otf`.
- **Network Assist:** `bash tools/push-network-assist.sh "message"` (add `README=path` to update the repo README; fetch the current one first with `gh api repos/richhemsley3/network-assist/contents/README.md --jq .content | base64 -d`). It commits through the GitHub API because local `git` fails until the Xcode licence is accepted (`sudo xcodebuild -license`). Never commit the font files: the repo is public and Proxima Nova is licensed. Pages rebuilds in about a minute.
- **Brightline repo:** `node tools/push-brightline.js "message"` mirrors `brightline-onboarding/`, `brightline-assist/`, `assistant-style/` and `assistant-style/repo-root/` (the repo root) to github.com/richhemsley3/brightline-assistant-prototypes through the API. It uploads the whole tree, so a file deleted locally is deleted in the repo. It never uploads font files or check-tool output. Pages rebuilds in about a minute.
- **After any change:** publish the artifact and push the repo, so both stay current.
- **Rich's standing rules:** artifacts stay private; Nov 23 he asked for everything in GitHub ("I want everything in Github"), public, with Pages.

## 5. Decision log (newest last)

November 22:
- Onboarding v2 built to "the ideal flow in reality, not the constraints of what we already built": two tracks, other people's long-lead moves, a clock.
- The redesign brief: "it's just a bunch of cards with lists, the list of tasks scrolls out of view, there's no connection to documentation… teh styling is very generic looking like claude." Result: the step rail, the reference pane, turn-by-turn chat.
- Colour: "this is terrible. learn about color theory," then "this palette sucks. use our design labs palette instead." Design System Labs semantic tokens only.
- "ditch the gradient" (the page wash), "the background should be lighter" (white then warm-grey canvas).
- "run this for the rest of the prototype": the v5 design applied to the whole engine.

November 23:
- "we lost the AI flourish" → "I want the multicolored gradient back": the Ring in #3144B7 / #9EAAFC / #FE6200, on the assistant's objects only.
- The integration drawing "seems pointless": removed. Choices change by saying so in the bar.
- "I don't want literally everything to be in a card" → later "it needs cards when appropriate": language on the page, composed objects in cards.
- Use the onboarding UI as the basis for the Figma instructions and restyle Network Assist and Brightline Assist ("Both"; Network Assist keeps its layout).
- "bring back the color gradient border … Not just the glow": the ring's host needs `isolation:isolate`.
- Home: "I don't want this centered column by default, only when in assist mode… There's no clear boundary between nav and the page container." Full-width home, white chrome with a 1px edge.
- Turns: "Think about logical ordering based on reading, comprehension, and then action." Evidence, then the prepared action and asks.
- "The assist bar shouldn't stick to the bottom until it's in an active assist mode," then "You ignored decisions we made before… it should be higher up": the home ask sits between the figures and the insights (the decision from the first Network Assist rounds), in the page flow; it moves to the pinned bar only in assist mode.
- Charts: "Make sure we don't just use progress bars when they're not useful, and charts are functional and responsive." See `CHARTS.md`.
- "Sometimes there's dead space when I scroll in agent assist mode": blocks waiting to appear take no space; bottom room = bar height + 32.
- Chip rows: "say 'recommended' or 'suggested' when there isn't another prompt like 'before you decide'."
- "Suggested actions for agent assist shouldn't persist in the feed once an action has been taken." Used suggestion rows are hidden (`.recs.done`, not forks) in all three; new ones appear at the end of the latest turn.
- The shared style guide, chart rules, this handoff and the check tools moved to `~/Desktop/Claude/assistant-style/`. The Figma instructions became version 3: one current spec with a change log.
- "I want everything in Github": both Brightline prototypes and this folder went to a new public repo with Pages; font files left out.

Earlier standing rules still in force:
- Brightline Assist's portal chrome keeps its layout and sizes; only colour, font and the edge changed. The exit is the close button beside the bar plus Escape.
- Every answer carries an action; next steps follow from the action just taken; nothing progresses without a click.
- Charts never use a line through discrete totals.
- Network Assist's confirm sheet and receipt are the platform's: no AI styling.

## 6. Gotchas found the hard way

- **The gradient border vanishes** when the ring's host has a background and no `isolation:isolate`: the host's fill paints over its own `::after` border.
- **Grid with competing rows:** in Network Assist, the bar and the view both claimed row 3 on home and the grid grew a second column, collapsing the app to 110px on phone. The app is pinned to one column.
- **Rows that share an axis** need fixed column widths. Brightline Assist's timeline drifted 65px from its axis because each row's value column sized itself.
- **Used suggestion rows** are hidden by CSS on `.recs.done` (Onboarding and Brightline Assist exclude `.fork`). Code that marks a row done to stop its gate now also removes it from view; if a row must stay visible after use, give it another class.
- **Hidden-but-sized blocks:** `.reveal` elements at opacity 0 hold their space. They are `display:none` until revealed now; any new code path that adds a `.reveal` element must add `in`.
- **Sticky or absolute children** lose their anchor if a parent's `position` changes (the home scope line overflowed when the ask section became `static`).
- **Full-page screenshots** of Network Assist need the body's height and overflow lifted first (see `na-walk.js`), because the app scrolls inside its own view.
- **Screenshot tool profiles:** `shot.js` now gives Chrome a temp profile and deletes it; before, every run left a profile beside the tool (1.3GB by the end of Nov 23).
- **Shell quoting:** an apostrophe in CSS comments breaks `node -e '…'`. Write scripts to a file.
- **Dark mode:** the Design System Labs `colors.css` has a dark set. Onboarding and Brightline Assist import it whole and have not been checked in a dark OS theme. Network Assist inlines the light set only.

## 7. Open

- Tooltip placement was checked in code and screenshots, not by hovering in a live browser.
- Dark OS theme in Onboarding and Brightline Assist (above).
- The Network Assist repo's root `index.html` (the preview-frame version with notes) keeps the older Material look; only `experience/` follows `STYLE.md`.
- Proxima Nova shows only where it is installed; public visitors to Network Assist see the system sans.
- The Figma instructions describe Network Assist only; Brightline Assist and Onboarding have no Figma spec.

## 8. Working with Rich

- He reviews visually and fast; show the screen, say what changed in plain sentences, no em dashes.
- Ask before large deliverables or restructures; small fixes he expects done.
- Look at your own screenshots before reporting. Report what you could not verify.
- Memory for these projects: `project_brightline_onboarding`, `project_brightline_assist`, `project_network_assist`, `feedback_reading_order`, `feedback_charts`, `not-everything-a-card`, `feedback_color_theory` in the Claude memory folder.
