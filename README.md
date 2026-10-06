# Interior Life Mapping — Brief Edition

A ten-minute **self-reflection map** of the interior life across five rooms,
*from the mirror to the door*. Take it, see your map, and carry it into a
seminar, a journal, or a trusted conversation. No account, no AI, no coaching
layer — just you and an honest picture of this season.

Companion resource to *Emotionally Whole: From the Mirror to the Door* by
**Winston H.K. Chew**.

- **35 statements**, five domains, about ten minutes.
- Items adapted from validated psychological instruments (cited in-app).
- Automatic scoring, reverse-item handling, a radar chart, an interior-life
  map, per-domain bands, and a clean **Print / Save-as-PDF** results page.
- **No backend, no build step, no tracking, no personal data collected.**
  One self-contained HTML file.

---

## The five domains

| # | Domain | Room | Anchor |
|---|--------|------|--------|
| 1 | Self-Awareness | The Mirror | Psalm 139:1 |
| 2 | Self-Regulation | The Furnace | Genesis 39:9 |
| 3 | Motivation | The Ruins | Nehemiah 1:4 |
| 4 | Empathy | The Border Crossing | Ruth 1:16 |
| 5 | Social Skills | The Door | Acts 16:15 |

Each domain score is the **average of its seven responses** on a 1.0–5.0 scale.
Reverse-worded items are scored inversely so a higher number always reflects
greater strength.

| Score | Status |
|-------|--------|
| 1.0 – 2.4 | Priority — formation work is needed here |
| 2.5 – 3.4 | Developing — present but inconsistent |
| 3.5 – 4.2 | Strength — operating well; maintain and deepen |
| 4.3 – 5.0 | Exceptional — a formation asset; ensure it serves others |

---

## Repository layout

```
.
├── public/            ← the static assets the Worker serves
│   ├── index.html     ← the entire app (HTML + CSS + JS in one file)
│   ├── jspdf.umd.min.js ← jsPDF 2.5.2 (MIT), self-hosted, builds the PDF report
│   └── _headers       ← security & caching headers (honoured by Workers static assets)
├── wrangler.toml    ← Worker config: name "ilm-brief", assets from ./public
├── .gitignore
└── README.md
```

There is **nothing to compile**. `public/index.html` is the whole application.
This is a pure static site with no `package.json` or build tooling. The
`wrangler.toml` tells Cloudflare Workers to serve `./public` as static assets —
there is no Worker script (see *Troubleshooting* below).

---

## Save my map (phones and laptops)

On the results page, participants can add an optional name and tap
**Save my map**. The app builds two files **on the device**: a two-page A4
**PDF report** (page 1 is the map and score guide, page 2 is the five rooms)
and a **phone-sized PNG image** for Photos.

- **Phones:** the button opens the phone's share menu, so people can choose
  Save to Files, Save Image, or send it to themselves on WhatsApp or email.
- **Laptops:** both files download.
- Smaller links let people save just the PDF, just the image, or print.

Nothing is uploaded: the files are made in the browser, and jsPDF is served
from this site (no CDN), which fits the `script-src 'self'` policy.

---

## Run it locally

Any of these work — pick one:

```bash
# 1. Simplest: just open the file in a browser
open public/index.html          # macOS  (or double-click the file)

# 2. Serve it (matches production paths)
npx serve public                        # then visit the printed URL
python3 -m http.server 8000 -d public   # then visit http://localhost:8000
```

---

## Deploy to Cloudflare Workers (Git-connected)

1. Create a repository named **`ilm-brief`** on GitHub and push this project:
   ```bash
   git init
   git add .
   git commit -m "Interior Life Mapping (brief) v1.0"
   git branch -M main
   git remote add origin https://github.com/<you>/ilm-brief.git
   git push -u origin main
   ```
2. **Cloudflare dashboard** → **Workers & Pages** → **Create** →
   **Import a repository** (Workers tab), and pick `ilm-brief`.
3. Build settings:

   | Setting | Value |
   |---|---|
   | Project / Worker name | **`ilm-brief`** (must match `name` in `wrangler.toml`) |
   | Build command | *(leave empty)* |
   | Deploy command | `npx wrangler deploy` *(the default)* |
   | Root directory | `/` |

4. **Deploy.** You get `https://ilm-brief.<your-subdomain>.workers.dev`.
   Every push to `main` re-deploys automatically.

Manual alternative from your PC: `npx wrangler deploy` in this folder.

---

## Troubleshooting

**"Missing entry-point to Worker script or to assets directory".**
`wrangler.toml` is missing the `[assets]` block. It must contain
`[assets]` / `directory = "./public"` (the shipped file does).

**Build fails with a name mismatch / "Worker name does not match".**
The Worker name in the dashboard must equal `name = "ilm-brief"` in
`wrangler.toml`. Change one so they match, then retry.

**Deployed page is a 404 or the README.**
The `directory` in `[assets]` is wrong — it must point at `./public`.

**Build tries to run `npm install` / a framework build.**
Clear the **Build command** field entirely; keep only the deploy command.

**Fonts don't load / a security warning in the console.**
The Content-Security-Policy in `public/_headers` already allows Google Fonts.
If you host the fonts elsewhere, update the `style-src` / `font-src` lines.

---

## Customizing the instrument

Everything lives in `public/index.html`:

- **Items, verses, and bands** — the `DOMAINS` array near the top of the
  `<script>` block. Each item is `{ t: "statement", s: "citation" }`; add
  `r: true` to mark a reverse-scored item.
- **Scoring thresholds** — the `tierOf()` function.
- **Colours, fonts, spacing** — the CSS variables in `:root` at the top of the
  `<style>` block (`--ink`, `--brass`, the per-room hues, etc.).

After editing, refresh locally to confirm, then commit and push (auto-deploys) or
re-run `npx wrangler deploy`.

---

## Notes

- **Scoring formula:** the original paper form printed "÷ 7 × 5," which would
  score the lowest answers highest. This app uses the **item mean (raw ÷ 7)**,
  which is what the 1.0–5.0 reference bands actually describe.
- **No LLM / no server:** all scoring runs in the visitor's browser. Cloudflare
  only serves the static file; nothing is sent anywhere.
- **Fonts** load from Google Fonts (Fraunces + Hanken Grotesk) with system
  fallbacks, so the page still renders cleanly if fonts are blocked.

---

*Interior Life Mapping* and its items are © Winston H.K. Chew, companion to
*Emotionally Whole: From the Mirror to the Door*. This instrument is a
conversation starter, not a diagnostic.
