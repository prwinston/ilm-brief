# Interior Life Mapping — Brief Edition

A ten-minute **self-reflection map** of the interior life across five rooms,
*from the mirror to the door*. Take it, see your map, and carry it into a
seminar, a journal, or a trusted conversation. No account, no AI, no coaching
layer — just you and an honest picture of this season.

Companion resource to *Emotionally Whole: From the Mirror to the Door* by
**Winston H.K. Chew**.

- **35 statements**, five rooms, about ten minutes.
- **Name required** before starting; it appears on the participant's report.
- Automatic scoring, a radar chart, a colour-coded map and a card for each room.
- **Save my map:** a two-page PDF report and a phone-sized image, made on the device.
- **Access window:** the site is open only between two dates you set.

---

## The access window

The site is served through a small Cloudflare Worker (`src/worker.js`) that
checks the date **on Cloudflare's server** before sending anything. Outside the
window, every visitor sees a short "Opening soon" or "This edition has now
closed" page instead of the app. It can't be bypassed from the browser.

The dates live in `wrangler.toml`:

```toml
[vars]
OPEN_FROM = "2026-10-09T00:00:00+08:00"
CLOSE_AT  = "2026-10-19T15:00:00+08:00"
```

- `+08:00` means Malaysia time. The format is `YYYY-MM-DDTHH:MM:SS+08:00`.
- Leave a value empty (`""`) for no limit on that side.
- If a date is mistyped, the site stays **closed** (safer than staying open by accident).

**To change the dates:** on GitHub, open `wrangler.toml` → pencil icon → edit
the two lines → **Commit changes**. Cloudflare redeploys within a minute or two.
Change them here, not in the Cloudflare dashboard: each deploy resets dashboard
variables to what's in this file.

**The welcome-page banner** shows the same dates and the time left. The Worker
writes them into the page, so there is nothing to edit in `index.html` when the
dates change. (Opened as a local file, the banner simply stays hidden.)

**Someone mid-assessment at closing time** can finish: the whole app is already
loaded on their phone, and the report is made on the device.

---

## The five rooms

| # | Domain | Room | Anchor |
|---|--------|------|--------|
| 1 | Self-Awareness | The Mirror | Psalm 139:1 |
| 2 | Self-Regulation | The Furnace | Genesis 39:9 |
| 3 | Motivation | The Ruins | Nehemiah 1:4 |
| 4 | Empathy | The Border Crossing | Ruth 1:16 |
| 5 | Social Skills | The Door | Acts 16:15 |

Each room score is the **average of its seven responses** on a 1.0–5.0 scale,
rounded to one decimal place. Reverse-worded items are scored inversely so a
higher number always reflects greater strength.

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
├── public/                  ← the static files the Worker serves
│   ├── index.html           ← the entire app (HTML + CSS + JS in one file)
│   ├── jspdf.umd.min.js     ← jsPDF 2.5.2 (MIT), self-hosted, builds the PDF report
│   └── _headers             ← security & caching headers
├── src/
│   └── worker.js            ← access window check + "closed" page
├── wrangler.toml            ← Worker name, assets folder, access dates
├── .gitignore
└── README.md
```

---

## Deploy to Cloudflare Workers (Git-connected)

1. Push this project to the GitHub repository **`ilm-brief`**.
2. **Cloudflare dashboard** → **Workers & Pages** → **Create** →
   **Import a repository**, and pick `ilm-brief`. (Already connected? Just push.)
3. Build settings:

   | Setting | Value |
   |---|---|
   | Project / Worker name | **`ilm-brief`** (must match `name` in `wrangler.toml`) |
   | Build command | *(leave empty)* |
   | Deploy command | `npx wrangler deploy` *(the default)* |
   | Root directory | `/` |

4. **Deploy.** Your address is `https://ilm-brief.<your-subdomain>.workers.dev`.
   Every push to `main` redeploys automatically.

---

## Save my map (phones and laptops)

On the results page, the participant's name is already filled in (they can
edit it). **Save my map** builds two files **on the device**: a two-page A4
**PDF report** (page 1: map and score guide; page 2: the five rooms) and a
**phone-sized PNG image** for Photos.

- **Phones:** the button opens the share menu: Save to Files, Save Image, or
  WhatsApp/email to themselves.
- **Laptops:** both files download.
- Smaller links save just the PDF, just the image, or print.

Nothing is uploaded: the files are made in the browser, and jsPDF is served
from this site (no CDN), which fits the `script-src 'self'` policy.

---

## Troubleshooting

**Build fails with a name mismatch.** The Worker name in the dashboard must
equal `name = "ilm-brief"` in `wrangler.toml`.

**"Missing entry-point to Worker script or to assets directory".** Check that
`wrangler.toml` has `main = "src/worker.js"` and the `[assets]` block, and that
`src/worker.js` was uploaded to GitHub.

**Everyone sees the closed page.** Check the two dates in `wrangler.toml`: the
format must be exactly `2026-10-19T15:00:00+08:00`. A typo keeps the site closed.

**Build tries to run `npm install`.** Clear the **Build command** field entirely.

---

## Customizing the instrument

Everything lives in `public/index.html`:

- **Items, verses, and descriptions** — the `DOMAINS` array near the top of the
  `<script>` block. Add `r: true` to mark a reverse-scored item.
- **Scoring thresholds** — the `tierOf()` function.
- **Colours and fonts** — the CSS variables in `:root`.

---

*Interior Life Mapping* and its items are © Winston H.K. Chew, companion to
*Emotionally Whole: From the Mirror to the Door*. This instrument is a
conversation starter, not a diagnostic.
