# Changelog — Interior Life Mapping, Brief Edition

## v1.1 — 10 October 2026
**Added**
- Access window enforced on Cloudflare's server (`src/worker.js`). The site is open from
  `OPEN_FROM` to `CLOSE_AT` in `wrangler.toml`: 9 Oct 2026, 12:00 am to 19 Oct 2026, 3:00 pm
  (Malaysia time). Outside it, visitors see an "Opening soon" or "This edition has now closed" page.
- Mistyped dates keep the site closed rather than open.
- Name required before starting (in "Before you begin"), carried into the report and saved files.

**Changed**
- `wrangler.toml` now runs a Worker in front of the static files (`main`, `binding`,
  `run_worker_first`, `[vars]`).
- README rewritten for the access window, deployment and troubleshooting.

## v1.0 — 6 October 2026
- First release: 35 statements across five rooms, four-tier scoring, room colours and icons,
  radar chart, "Save my map" PDF report and phone image, Brief Edition wording.
