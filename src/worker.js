/**
 * Interior Life Mapping — Brief Edition
 * Access window: the site is served only between OPEN_FROM and CLOSE_AT
 * (set in wrangler.toml → [vars]). Outside that window every request gets
 * a short "not open / now closed" page instead of the app.
 *
 *   OPEN_FROM / CLOSE_AT — ISO date-times with offset, e.g. 2026-10-19T15:00:00+08:00
 *   Leave one empty for "no limit" on that side. A value that can't be read
 *   keeps the site closed (safer than accidentally leaving it open).
 */

const TZ_OFFSET_MIN = 8 * 60;          // Malaysia time (UTC+8) for the dates shown to visitors
const TZ_LABEL = 'Malaysia time';

export default {
  async fetch(request, env) {
    const now = Date.now();
    const open  = readTime(env.OPEN_FROM);
    const close = readTime(env.CLOSE_AT);

    const isOpen =
      open !== 'bad' && close !== 'bad' &&
      (open === null || now >= open) &&
      (close === null || now < close);

    if (isOpen) {
      const res = await env.ASSETS.fetch(request);
      // Hand the window dates to the welcome-page banner (#accessNotice), so the
      // banner always matches wrangler.toml with nothing to edit in the page.
      if (!(res.headers.get('Content-Type') || '').includes('text/html')) return res;
      return new HTMLRewriter().on('#accessNotice', {
        element(e) {
          if (typeof open === 'number')  e.setAttribute('data-open',  String(open));
          if (typeof close === 'number') e.setAttribute('data-close', String(close));
        }
      }).transform(res);
    }

    if (open === 'bad' || close === 'bad') {
      console.error('Access window misconfigured:', { OPEN_FROM: env.OPEN_FROM, CLOSE_AT: env.CLOSE_AT });
    }
    const early = typeof open === 'number' && now < open;
    const when = early ? open : close;
    return closedPage(early, typeof when === 'number' ? when : null);
  }
};

function readTime(v) {
  if (v === undefined || v === null || String(v).trim() === '') return null;
  const t = Date.parse(String(v).trim());
  return Number.isNaN(t) ? 'bad' : t;
}

function fmt(ms) {
  if (typeof ms !== 'number') return '';
  const d = new Date(ms + TZ_OFFSET_MIN * 60000);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let h = d.getUTCHours(); const m = d.getUTCMinutes();
  const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12;
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${h}:${String(m).padStart(2,'0')} ${ap} (${TZ_LABEL})`;
}

function closedPage(early, when) {
  const title = early ? 'Opening soon' : 'This edition has now closed';
  const lead = early
    ? (when ? `Interior Life Mapping opens on <b>${fmt(when)}</b>. Please come back then.` : 'Interior Life Mapping is not open yet. Please come back soon.')
    : (when ? `The seminar window for Interior Life Mapping closed on <b>${fmt(when)}</b>. Thank you to everyone who took part.` : 'Interior Life Mapping is not available at the moment.');
  const after = early
    ? 'Ten quiet minutes, five rooms, one honest picture of where your interior life stands today.'
    : 'If you saved your map, keep it close. The questions it opened are still worth carrying, from the mirror to the door.';

  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Interior Life Mapping · Brief Edition</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,400&family=Hanken+Grotesk:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{--ink:#1B2A2E;--paper:#ECEAE1;--lift:#F5F3EC;--brass:#A9853F;--mute:#5C6461;--faint:#8A8F89;
        --serif:'Fraunces',Georgia,serif;--sans:'Hanken Grotesk',-apple-system,'Segoe UI',sans-serif;}
  *{box-sizing:border-box} body{margin:0;background:var(--paper);color:#22282A;font-family:var(--sans);font-size:19px;line-height:1.6;
        min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{max-width:620px;width:100%;background:var(--ink);color:#EDECE4;border-radius:16px;padding:48px 40px 40px;box-shadow:0 8px 30px rgba(27,42,46,.12)}
  .eyebrow{font-family:var(--serif);font-style:italic;color:#C9B98F;font-size:20px;margin-bottom:14px}
  h1{font-family:var(--serif);font-weight:500;font-size:clamp(32px,7vw,44px);line-height:1.12;margin:0 0 18px;color:#F6F3EA}
  p{margin:0 0 14px;color:#C9D1CE} p b{color:#F6F3EA;font-weight:600}
  .dots{display:flex;gap:10px;margin:26px 0 22px}
  .dots span{width:16px;height:16px;border-radius:50%}
  .foot{margin-top:26px;padding-top:18px;border-top:1px solid rgba(255,255,255,.14);font-size:15px;color:#9DA9A5}
  .foot i{font-family:var(--serif);color:#DCE2DF}
  @media (max-width:560px){.card{padding:36px 24px 30px} body{font-size:18px}}
</style></head>
<body><main class="card">
  <div class="eyebrow">Interior Life Mapping · Brief Edition</div>
  <h1>${title}</h1>
  <p>${lead}</p>
  <div class="dots" aria-hidden="true">
    <span style="background:#2F80C0"></span><span style="background:#E2582B"></span><span style="background:#C08F12"></span><span style="background:#2E9E68"></span><span style="background:#8A4FC2"></span>
  </div>
  <p>${after}</p>
  <div class="foot">Companion resource to <i>Emotionally Whole: From the Mirror to the Door</i> · Winston H.K. Chew</div>
</main></body></html>`;

  return new Response(html, {
    status: 403,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; base-uri 'none'; frame-ancestors 'self'"
    }
  });
}
