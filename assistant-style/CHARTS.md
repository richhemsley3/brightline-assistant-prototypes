# Charts across the assistant prototypes

Shared by Brightline Onboarding, Brightline Assist and Network Assist. Written November 23, 2026, after Rich: "Make sure we don't just use progress bars when they're not useful, and charts are functional and responsive. Right now they look off."

## 1. Pick the form by the job

| The reader must… | Form | Not |
|---|---|---|
| Count discrete items and see which passed or failed (scenarios, cases, attempts) | **Cell grid**: one row per group (name, a short description), one 16px cell per item, a count at the end ("38 of 41 · 3 missed") | A bar sized by the group's total |
| Read one ratio per row, each against its own whole (win rate, share approved) | **Meter list**: name, a track that is the whole, the filled part, the figure; the scale is stated once ("of 100%" or "of N") | Tracks with no stated whole |
| Compare magnitudes across a few categories | **Ranked horizontal bars** from zero, largest first unless the order is natural, value at the end | Bars whose length is not on a stated scale |
| See change over time | **Columns from zero** on a dated axis, the latest column in the emphasis colour and labelled, a few grid lines with values | A line or area through daily or weekly totals |
| See where something lands in time against a plan or a gate (go-live, windows, deadlines) | **Timeline**: a date axis, the plan as a hollow marker, the projection as a filled marker, a line between them for the slip, today as a vertical rule | Bars whose length is "days behind" |
| See one whole split into parts, with the figures listed beside it | **Thin segmented bar**, no text on it, above a list where each row carries a swatch, a name and an amount | A donut |
| One number that leads | **Figure**: 48 light, label above or below, a delta | A one-bar chart |

If a bar's length does not encode a quantity on a stated scale, it is decoration: remove it.

## 2. Marks

- Columns are at most 40px wide and centred in their slot; gaps stay at least 4px. Horizontal bars are 12–16px tall. Data ends are rounded 4px, anchored to the baseline.
- Segments in a segmented bar are separated by a 2px gap.
- Grid lines are dotted `--sds-chart-grid`; the baseline is a solid 1px `--sds-border-default`. Three grid lines at most.
- Cells are 16 × 16, radius 3, gap 4, wrapping inside their row.

## 3. Colour (Design System Labs)

- **Emphasis first.** The item that matters is `--sds-chart-1` (navy); context is `--sds-chart-3` (light blue). Use `--sds-chart-2` (teal) for a second series or a reference line.
- Not yet run or empty: `--sds-chart-grid` fill.
- Failures: `--sds-status-error-text` fill, always with a text count beside it. Status colours are never series colours.
- Text never wears a series colour; values and labels are text tokens.

## 4. Text

All chart text is real HTML text at 14px or larger: axis labels in `--sds-chart-axis-label`, values in `--sds-text-primary`. No labels inside a scaled SVG.

## 5. Interaction

Every bar, column and cell has a hover tooltip (dark `--sds-chart-tooltip-bg`, white text, 8px radius, two lines: what and how much), positioned to stay inside the chart. Hit targets are the full slot, not just the mark.

## 6. Responsive

- Check at 1600, 1100 and 400 wide. No text may overlap a mark or another label; nothing may overflow its card.
- Narrow: horizontal-bar and meter rows drop the bar under the name; columns keep every bar but label every other date; a value that does not fit inside a column moves above it or is dropped in favour of the tooltip.
- Charts fill their card's width; their height is fixed per form (columns 160–200, cells and bars by row).
