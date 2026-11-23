# Brightline assistant prototypes

Two concept prototypes of an AI assistant inside the portals of a card network, for Brightline Bank (fictional), plus the style and handoff docs shared with [Network Assist](https://github.com/richhemsley3/network-assist).

**Open them:** https://richhemsley3.github.io/brightline-assistant-prototypes/

| Folder | What it is | Live |
|---|---|---|
| `brightline-onboarding/` | Priya's technical onboarding, guided by the assistant turn by turn: her route, the long-lead requests other people hold, a step rail and reference pages | [/brightline-onboarding/](https://richhemsley3.github.io/brightline-assistant-prototypes/brightline-onboarding/) |
| `brightline-assist/` | The three portals (Partner, Agent, Developer) with a briefing home and the assistant built in | [/brightline-assist/](https://richhemsley3.github.io/brightline-assistant-prototypes/brightline-assist/) |
| `assistant-style/` | `STYLE.md` (the visual language), `CHARTS.md` (chart rules), `HANDOFF.md` (run, check, publish, decision log) and `tools/` (headless-Chrome checks, a static server, the Network Assist push script) | |

Each prototype is static HTML, CSS and JavaScript with no build step. Serve a folder and open its `index.html`; add `?fast` to skip the animation timing.

## Notes

- Brightline Bank, its people, partners and figures are invented.
- The typeface is Proxima Nova, which is licensed, so the font files are not in this repo. Pages show it where it is installed and the system sans elsewhere. Locally, put the three `.otf` files in each prototype's `fonts/` folder.
- Colour comes from the Design System Labs tokens in each prototype's `tokens/colors.css`.
