import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:3000';
const b = await chromium.launch({ channel: 'chrome' });
const LABELS = ['About','Programs','Who We Treat','Locations','Insurance'];
let fails = 0, checked = 0;

for (const width of [1024, 1152, 1280, 1366, 1440, 1512, 1680, 1920]) {
  const p = await b.newPage({ viewport: { width, height: 900 } });
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  console.log(`\n  ── viewport ${width}px ──`);
  for (const label of LABELS) {
    const btn = p.locator(`nav[aria-label="Primary"] button:has-text("${label}")`).first();
    // HOVER, not click: mouseenter already opens it, and a click would toggle
    // it straight back shut — which is how the previous run ended up
    // measuring closed panels.
    await btn.hover();
    await p.waitForTimeout(300);
    const r = await p.evaluate((lbl) => {
      const id = 'nav-menu-' + lbl.replace(/\s+/g,'-').toLowerCase();
      const wrap = document.getElementById(id);
      if (!wrap) return null;
      const card = wrap.firstElementChild;
      const cr = card.getBoundingClientRect();
      return {
        visible: getComputedStyle(wrap).visibility === 'visible',
        expanded: wrap.parentElement.querySelector('button')?.getAttribute('aria-expanded'),
        left: Math.round(cr.left), right: Math.round(cr.right), w: Math.round(cr.width),
        vw: document.documentElement.clientWidth,
        inlineLeft: getComputedStyle(wrap).left,
      };
    }, label);
    if (!r) { console.log(`     ${label}: panel missing`); fails++; continue; }
    checked++;
    const off = r.left < 0 ? `OVERFLOWS LEFT ${-r.left}px` : r.right > r.vw ? `OVERFLOWS RIGHT ${r.right-r.vw}px` : 'ok';
    if (off !== 'ok' || !r.visible) fails++;
    console.log(`     ${label.padEnd(13)} open=${r.visible} exp=${r.expanded} left=${String(r.left).padStart(5)} right=${String(r.right).padStart(5)} w=${r.w} inline=${r.inlineLeft.padStart(9)}  ${off}`);
  }
  await p.close();
}
console.log(`\n  checked ${checked} panel/width combinations — failures: ${fails}`);
await b.close();
process.exit(fails ? 1 : 0);
