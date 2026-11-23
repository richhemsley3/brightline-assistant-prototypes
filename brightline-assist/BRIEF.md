# Brightline Assist: brief

Written November 21, 2026, revised the same day after the first build was rejected.

## What Rich asked for

A new prototype that builds on the Brightline demo and uses the AI capabilities from the Network Assist work. Start after onboarding, when someone logs in to take action or review data. Package it without demo controls and without the marketing site.

After the first build: "a mix of Network Assist exactly and elements of the portal. Bring an insightful homepage as the landing, and then the assist takes over when active, like the prototype we made." Start over on the flows. All three seats. Same arc as the Network Assist story. Header stays, sidebar collapses when the assist is active.

## The one job

Show how the assistant earns its place inside a working portal: the person lands on a briefing that already knows what matters, asks one question, sees the answer composed from the records, drills into the evidence, and approves one action on the platform's terms.

## Register

The Network Assist experience, unchanged: Material surfaces on the #F6F6FB ground, the Ring (a drifting gradient edge with a soft glow) on what the assistant owns, its words in Primary violet, figures in ink, Heritage orange on at most two things per screen. Density from the Network Assist density pass. Figtree stands in for Proxima Nova.

Portal elements around it, taken from the Brightline demo value for value (gn.css): the 56px white header with the mark, the organisation and its state, the find box, the needs-you count, Help and the person; the tone sidebar with the navigation groups, icons and counts, which steps aside when the assistant is active. The header stays throughout and carries a Close control while the assistant is active (Escape does the same).

After every answer the assistant recommends follow-ups: the story's next step first, then a way to dig deeper and a neighbouring question. Rich asked for these on November 21 ("help me follow up on something or dig deeper").

## The arcs (revised November 21, after "the story doesn't flow")

Rich's critique of the first chains: follow-ups were a menu, three ended in tables with nothing to do, and the charts summarised instead of deciding anything. The arcs now run on actions:

- The first answer ends in a prepared action. A drill-down carries the same action with it, and where it shows rows they do something: Dana's evidence rows can be unticked and the counter's wording follows.
- Approving gives a receipt, and under the receipt the next steps that follow from it ("Next"), each an action of its own. Actions that change only a setting of the person's own happen in place with an undo (reminders, holds, alerts); everything that reaches another party or a record goes through the platform's sheet with a cancel window where one exists.
- Every chain ends with "Back to the briefing".
- Charts are instruments, and after Rich's second note ("not useful or easy to read") they are plain: one row per option with a 15px label and a bar, or hourly bars with two captions. Dana: cases like dsp_41e by what was sent (the prepared set is the top row). Marcus: what each week does to Halcyon's go-live, pickable; a pick rewrites the prepared action. Priya: the endpoint's answers by hour since the failure. The issuer p99 bars stay only in the "Why was 2 AM slow?" branch, where they are the diagnosis.
- The exit is not a Close in the portal header (Rich: "makes no sense") and not a back link at the top of the answer (Rich: "I have to scroll all the way up"). It is a close button beside the assist bar, which is the assistant's own and always on screen; leaving keeps the thread and the briefing offers to continue it.
- The home's chart is bars from zero (Rich: "it's not the chart type, it's the soft curve"): daily and hourly totals are discrete, so no line is drawn through them. Dotted grid, scale on the left, dated axis, last bar dark and labelled, hover for any bar.
- One rule for controls (Rich: "links sometimes for actions and button shapes for others", then "I still see links for recommendations"): asks to the assistant are violet chips everywhere, including the home suggestion, the lead card's "Prepare the counter", "Before you decide", the next steps after a receipt and "Continue"; no text links. Acts on the platform or the page are buttons, Heritage for the one commit, tonal for the rest.

Dana: counter dsp_41e → answer dsp_41d's retrieval → a rule for retrievals like it; tell me when the issuer decides; acknowledge Release 26.2. Marcus: book Halcyon's window → send Grace the details; hold Ana's mornings; answer Devin Marlow → remind me on day 10. Priya: retry evt_89f5b9 → shorten the retry schedule; alert on two failures; send Cedar Books the 400 report.

## Rules kept

- Nothing progresses until the person interacts: the field waits for a click, the question waits for send, the follow-up waits for Tab or a click, the action waits for the sheet.
- No blue links, no arrows, no badges, no pills, no paragraph insights, no idle pulses. Insights are one number and one sentence with evidence rows.
- The sheet and the receipt are the platform's: no ring, no violet, money in ink.
- The pages behind the sidebar are not built; they say so and offer the question.

## Decisions Rich has not confirmed

- The portal's find box hands off to the assistant's field on the home (one entry point) rather than running its own search.
- Which actions are "in place with undo" versus "on the sheet": the line drawn is whether anything leaves the person's own settings.
- The next-step actions themselves (rules, reminders, alerts, the retry schedule, the Cedar Books report) were written without a brief; the three first actions come from the Brightline story.

**Nov 23, 2026.** Restyled onto the Brightline Onboarding v5 language (Design System Labs tokens, Proxima Nova, 14px minimum, surfaces only for what waits or floats, action before evidence); the Network Assist experience, its Ring and the portal chrome are unchanged in behaviour. See README, "Look".
