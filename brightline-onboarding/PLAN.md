# Priya's onboarding, guided by the assistant: the plan

November 22, 2026. Written to agree before building.

Rich: *"I want the assist to help guide through the process and I want it to have forks and different options. For example, she may want to connect to our MCP for certain things, and use API or other integration types for others. It should ask what your goals are with real world examples, and guide through the path, kind of like a choose your own adventure based on her goals and technical needs."* Scope: the whole arc, from the first sandbox call to activation morning.

## The brief

Priya Raghavan, lead integration engineer at Brightline Bank, has one job across onboarding: prove the direct connection is feasible, build it, certify it, launch it. Today the Developer Portal shows her the steps; it does not know what she is trying to do, so every step is the same for everyone and four of her seven pages tell her to wait.

The one thing she must see first: **the route the assistant has drawn for her, from her goals, with the next thing to do already prepared.**

Register: the Network Assist experience as built in Brightline Assist (Material surfaces, the Ring, the violet voice, the portal's own header and sidebar). Reference products: Stripe's onboarding checklist and Plaid's quickstart for the shape of "pick, then do", and the Brightline story's own rules for what the network asks of a partner.

Honesty rule for the forks: **MCP is for building and operating, not for the authorization path.** Connecting her agent to the network's MCP server lets it read the reference, send test cards, query logs, run certification cases and watch deliveries from her own tooling. The live authorization leg stays on the API, mutual TLS and all, because it answers in 44 milliseconds and the network certifies the message, not the tool that sent it. The assistant says this plainly when she chooses, with the numbers.

## How it moves

The assistant is the guide. It opens by asking what she is here to build, in her words, with real-world examples to pick from. From the answers it draws a **route**: which of the six technical steps apply, in what order, roughly how long, and whose move each is. Then it walks the route one step at a time. Where a choice is real it forks and shows what each branch costs and gives; where it isn't, it doesn't pretend. Every step ends in a prepared action she approves (a key issued, an endpoint added, a chain uploaded, a configuration confirmed, a window booked, a date confirmed), and every receipt is followed by the next step on her route. She can re-choose a fork later; the route redraws and says what changes. Nothing moves without her.

The route is the page's instrument: a horizontal map of the six steps with her forks marked under each, the current step lit, the network's moves in grey, hers in blue. It stays at the top of the conversation and updates as she goes.

## Stage 0 · Goals

The assistant asks: **"What are you here to build? Pick what fits, or tell me."** Chips, multi-select, each phrased as an outcome with a real-world example:

| Goal | The example under it | What it switches on |
| --- | --- | --- |
| Approve authorizations in-house | "Our host decides over ISO 8583 today, through a gateway. We want the network directly." | Authorization API, connectivity, the core certification groups |
| Receive events as they happen | "Decisions, disputes and settlement land in our systems within a second, not in tomorrow's file." | Events step (webhooks or MCP subscription), the events certification group |
| Settle and reconcile in our ledger | "Daily net, a wire reference, totals that match our host each morning." | Settlement path (file or API), settlement cases, daily balancing owner |
| Work disputes where we work today | "Our team lives in a case tool and a spreadsheet; we want evidence and deadlines there, not in email." | Disputes API or portal, dispute cases |
| Let our team's agents operate the sandbox | "Engineers use Claude and Cursor; we want them to send test cards, read logs and run cases without a browser." | MCP server, scoped agent key, MCP path on steps 1, 3 and 6 |
| Add network tokenization | "Cards reissued by the issuer keep working; wallets and card-on-file come later." | Tokenization step (optional, can follow go-live), its cases |

Priya's answers on the Brightline spine: the first four plus the agents, tokenization later.

## Stage 1 · Technical needs

Five questions, each with options and a stated consequence. Asked one at a time, in the assistant's voice, each prefilled where the deal already said:

| Question | Options | Consequence on the route |
| --- | --- | --- |
| **What answers authorizations today?** | In-house host on ISO 8583 (prefilled from the technical review) · A gateway we keep · Nothing yet | ISO host: the assistant offers the message mapping guide and the two-week bridge estimate; gateway: a parallel-run step; nothing: the SDK path |
| **How do you want to receive events?** | Webhooks to our endpoint · Subscribe from our agent over MCP · Poll the API | Webhooks: endpoint, secret, retries, deliveries; MCP: subscription from her tooling, no endpoint until production; polling: no events step, a note on latency |
| **How should settlement reach you?** | Daily file to our SFTP · The settlement API and the settlement.posted event · Both | File: SETL cases and the dry-run night; API: settlement endpoints and event; both: both case sets |
| **Where will disputes be worked?** | Our case tool through the API · The Partner Portal · Email, as today | API: dispute endpoints, evidence upload cases; portal: nothing to build, Dana's seat; email: the assistant says what that costs ($18 to $25 a case against $4.50) |
| **What does your team build in?** | Node · Python · Java · cURL and Postman · Our agents over MCP | Snippets, SDK, Postman collection, or the MCP connect step, on every page that shows code |

From Stage 0 and 1 the route is drawn. Three example routes the prototype carries:

- **Brightline's** (the spine): ISO host, webhooks, settlement file and event, disputes by API, Node plus agents over MCP, tokenization later. Six steps, about ten weeks, certification 21 cases.
- **Agent-first**: a team that wants its agents to do the sandbox and certification work. Same six steps; steps 1, 3 and 6 take the MCP branch; the route shows what stays on the API.
- **Minimal**: authorizations only, polling, settlement file, disputes in the portal. Four steps, 12 cases, about six weeks.

## The arc, step by step

Each step: what the assistant says, the fork if there is one, what it composes, the prepared action, and what follows the receipt.

### 1 · Sandbox and the first call (Evaluate)
- Says: the sandbox is hers in a minute; a key of her own; one authorization back approved proves the shape.
- Fork: **How do you want to make the first call?** cURL · Node, Python or Java SDK · Postman collection · **Connect your agent (MCP)**. The MCP branch issues a scoped agent key, shows the one-line connect, and the agent's first run appears as a trace in the conversation. The others show the exact snippet with her values filled in.
- Composes: the snippet or the connect card; the first request and response in the log, as rows; the test cards.
- Prepared action: **Issue a sandbox key** (sheet; the key is shown once; rotate any time). On the MCP branch, **Issue a scoped agent key** (read, send test cards, read logs; no production).
- After the receipt: the first call runs (her tooling or the console), the log row arrives, the route lights step 1 done. Next: *Tell Dana it's feasible* · *Set up events* · *Read the authorization reference*.

### 2 · Feasibility (Evaluate)
- Says: nothing is committed; one sentence to Dana moves the deal.
- Composes: what she has done so far (calls, cards tried, the reference read), drafted into the note.
- Prepared action: **Send the feasibility note to Dana** (sheet; recall ten minutes). The network does not gate it.
- Next: *Set up events* · *See what the deal has already filled in*.

### 3 · Events (Build)
- Fork: **Webhooks** · **MCP subscription** · **Polling** (carried from Stage 1, re-choosable here). The assistant shows the six events and what each carries, and for the chosen branch what she has to build.
- Composes: the event catalogue as rows; on webhooks the endpoint card (URL, secret, events, retries); on MCP the subscription from her agent with the same six events; on polling a plain note on latency and a cursor example.
- Prepared action: **Add the endpoint and send a test event** (sheet) or **Subscribe your agent** (in place, undo). Then the delivery row: 200, or 503 and the retry, exactly as in Brightline Assist.
- Next: *Connect for real: chain and allowlist* · *Forward events to localhost while you build*.

### 4 · Connectivity (Build)
- Says: endpoint, allowlist, mutual TLS both ways; the certificate's expiry is read on the first handshake.
- Composes: the four objects as a checklist (staging chain, allowlist range, endpoint, handshake), each with its state.
- Prepared action: **Upload the staging chain** (sheet; replaceable) and **Open the allowlist for 203.0.113.0/24** (in place, undo).
- The diagnostic beat from the story: the handshake fails twelve times in four minutes; the assistant matches the error to a missing intermediate, shows the expected chain in order, and prepares **Upload the corrected chain**. Three minutes, not a ticket.
- Next: *Confirm the configuration* · *See the handshake log*.

### 5 · Configuration (Build)
- Says: the deal already filled most of it; confirming generates her certification cases.
- Composes: the four sections (Acceptance, Settlement, Disputes, Connection) as rows with the value and where it came from (the agreement, the technical review, her sandbox run); the ones still empty marked.
- Fork inside: the settlement and disputes choices from Stage 1 are shown as the values they became, re-choosable here.
- Prepared action: **Confirm the configuration** (sheet; a change later regenerates cases and says so). The receipt counts the cases generated for her route: 21 for Brightline's, 12 for the minimal one, 29 with tokenization.
- Next: *Run certification* · *Book the window*.

### 6 · Certification (Certify)
- Fork: **Run the cases from your host** · **Let your agent run them (MCP)**. Either way the cases turn green as the network sees them.
- Composes: the groups and counts (Authorization, Declines, Events, Settlement, Disputes, Tokenization if chosen) as the chart: a row per group, passed over total, filling as the run goes; a failing case opens to the request that failed, the diagnosis and the fix.
- Prepared actions: **Request the certification window** (sheet; Ana books it; the week options, as in Marcus's chart, from her side) and after a clean run **Submit for validation**.
- The story beat: three fare-capping cases fail on a rounding rule; the fix is a one-line config value; rerun passes.
- Next: *Get ready for production* · *Add tokenization now*.

### 7 · Production readiness (Launch)
- Says: four production objects and a date; a dry run of the first file with someone on call that night.
- Composes: the checklist (production key, production chain, production endpoint, activation date) each with state and the action; the dry-run plan.
- Prepared actions: **Issue the production key**, **Upload the production chain**, **Add the production endpoint** (each a sheet), **Confirm May 14** (sheet; Marcus is told).
- Next: *What happens on the morning* · *Who is on call*.

### 8 · Go-live (Launch)
- Says: activation at 6:00 AM, live traffic the same day, first settlement the following morning.
- Composes: the first-hour instrument (requests, errors, deliveries by minute, from zero) once live; before that, the morning's timeline.
- Prepared action: none hers; the network activates. Receipt: **Live since 6:00 AM** with the first figures.
- Next: hands off to Operate, which is Brightline Assist's Priya seat as built (what failed overnight, retries, alerts).

## The forks, in one table

| Fork | Where | Options | What changes downstream |
| --- | --- | --- | --- |
| First call | Step 1 | cURL · SDK · Postman · MCP | Snippets everywhere; agent key; agent traces in the conversation |
| Events | Stage 1, step 3 | Webhooks · MCP subscription · Polling | Endpoint objects; events cases; production endpoint at step 7 |
| Settlement | Stage 1, step 5 | File · API · Both | SETL cases; dry-run night; reconciliation owner |
| Disputes | Stage 1, step 5 | API · Portal · Email | Dispute cases; evidence upload; Dana's seat instead |
| Certification runner | Step 6 | Host · Agent over MCP | Who sends the cases; nothing in the cases themselves |
| Tokenization | Stage 0, step 6 | Now · After go-live · No | Eight more cases; a two-week track alongside |

Six forks, each with a stated cost and gain, each re-choosable. The route map shows the choice under its step.

## What has to be built

- **Route state.** One object: goals, the five answers, the fork choices, the step states. Every flow's text reads from it (the snippet language, the events branch, the case count). Choosing again rewrites the route and the prepared actions, the way Marcus's week pick rewrites the booking today.
- **Choice turns.** A new turn type beside question turns: the assistant asks, chips answer (multi-select for goals, single for the rest), the answer is spoken back and the route redraws. Chips are the one shape for anything she says to the assistant, as agreed.
- **The route map.** A new instrument: six steps across, forks marked under each, current step lit, hers in blue and the network's in grey, with the estimate. It sits above the conversation and updates.
- **Step turns.** Each step is a flow with a prepared action, built on the Brightline Assist engine (trace, voice, figure or rows, prepared, sheet, receipt, next). New blocks: the snippet card with her values, the connect card for MCP, the checklist with states, the certification groups chart.
- **The MCP branch.** A connect card (server, scope, the one line), an agent key with scope shown on the sheet, and agent runs that appear as traces so the person sees what their agent did.
- **Packaging.** Its own experience at `~/Desktop/Claude/brightline-onboarding/`: the Developer Portal shell with Getting started as the first nav item pre-live, the assistant as the Getting started page. Sign in as Priya only. Refresh restarts; the route can be reset from the map.

Order of work: route state and choice turns with the goals and five questions → the route map → steps 1 to 3 on Brightline's route → steps 4 to 8 → the agent-first and minimal routes → the diagnostic beats (missing intermediate, rounding rule) → phone pass → publish.

## Revised the same day, after Rich's notes

Rich: *"what's the point of having the assist text field if she's making selections throughout? What if we have her describe their technical needs and then it guides?"* and *"Priya doesn't necessarily know about the payments goals for the business and will be focused on technical implementation."* So Stage 0 and Stage 1 are no longer a questionnaire. She describes the setup in the field (the demo types Brightline's description, written as an engineer writes), the assistant reads it, draws the route, and says what it assumed where she didn't say. The goals became technical needs (authorization path, event delivery, settlement delivery, dispute integration, agent tooling, tokenization) and every option is phrased in implementation terms. The questions survive only as "Change" turns from the margin. The route instrument was rebuilt in the assistant's own vocabulary (a figure and trace-style rows) after *"the timeline looks claude generated."*

## Built, November 22

Rich said "Build to it", so the six decisions below were taken as written: the six goals with Brightline's five preselected; MCP for building and operating only; Getting started inside the Developer Portal; forks re-choosable at any time (every choice turn has Change, and steps with a fork carry it as chips); the three routes carried through the choices; both diagnostic beats. Two things differ from the plan in the building: the route map is drawn inside the turn where it appears rather than pinned above the conversation (it updates everywhere it appears), and the "agent-first" and "minimal" routes are reached by answering differently rather than preset.

Later the same day (V6), after "it's just lists on lists": the route is no longer rows. The assistant answers her description with a drawing of the integration, her systems left and the network's right, each connection labelled with her choice, dashed where assumed, the ring gradient on the connection the current step builds, green when done. The same drawing, small, is the margin from the first step on. Options are chips. Then (V7), after "a wall of text, I want more UI to frame content": every lead cut to two sentences, the numbers moved into figure tiles above the drawing and figure cards inside the steps, her description folded once read, the home's prose replaced by four tiles of what the deal settled. Then (V8), after "the landing page makes no sense. What is this big box?": the landing is the ask alone, the field with one line of what is already known under it; nothing is drawn before she writes. Then (V9), after "these are clickable but that's not useful to just run through a bunch of questions": a tap on a connection opens a note that explains it (what, which step, said or assumed); changing it is a chip inside the note, never the tap itself. Then (V10), after "this card is mega but the answers are down at the bottom": the note floats at the tapped connection, not at the foot of the card; tap outside or Escape closes it. Then (V11), after six alternative patterns and a progressive outline were all rejected ("you're over solving with this pattern"): the route turn was cut to two sentences, one figure and the next asks. Rich: "this is worse. There's no detail now. Go back to where we were before you started creating new patterns." V10 restored. Then (V12, Rich away, "refine this overall flow… assistive, have guidance, allow me to take action, and not simply be a wall of text"): a walk of every turn by screenshot; the "Before you decide" chips became questions that inform the decision (two new answer turns, scopes and cases, each ending in the step's own action); weeks left and the activation date in the margin and the Weeks tile.

## Decisions for Rich before building (as written before the build)

1. **The goal list.** The six above, or different ones; and whether Priya's answers are preselected on the spine or she picks from nothing.
2. **MCP's reach.** Building and operating only (as written), or do we also show an MCP route for the authorization leg and have the assistant argue against it with the numbers?
3. **Where it lives.** Getting started inside the Developer Portal (as written), or a standalone onboarding experience without the portal's sidebar.
4. **Re-choosing.** Forks re-choosable at any time with the route redrawing (as written), or locked once a step is done.
5. **How many routes to carry.** Three (Brightline's, agent-first, minimal), or only Brightline's with the forks visible but shallow.
6. **The two diagnostic beats.** Keep both (chain, rounding rule) as moments where the assistant earns its place, or one.
