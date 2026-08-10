/**
 * Interactive QA sweep. Catches the class of defect that static checks cannot:
 * layout overflow, broken images, runtime console errors, and dead
 * interactive affordances.
 *
 *   BASE=https://… node scripts/qa-sweep.mjs
 *
 * Exits non-zero if anything fails.
 */
import { chromium } from "playwright";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const WIDTHS = [390, 768, 1280, 1920];
const PAGES = [
  "/",
  "/about",
  "/treatment",
  "/treatment/detoxification",
  "/who-we-treat/veterans",
  "/locations/orange-county",
  "/insurance",
  "/tour",
  "/contact",
  "/blog",
  "/faq",
  "/privacy-policy",
];

const failures = [];
const note = (m) => failures.push(m);

const browser = await chromium.launch({ channel: "chrome" });

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  for (const path of PAGES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text().slice(0, 160));
    });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 160)));

    let res;
    try {
      res = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
    } catch (e) {
      note(`${width} ${path} — navigation failed: ${e.message.slice(0, 90)}`);
      await page.close();
      continue;
    }
    if (!res || res.status() >= 400) {
      note(`${width} ${path} — HTTP ${res ? res.status() : "?"}`);
      await page.close();
      continue;
    }

    // Let lazy images settle.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const out = { vw, hScroll: 0, overflowers: [], brokenImgs: [], noAlt: 0 };

      out.hScroll = Math.max(
        0,
        document.documentElement.scrollWidth - document.documentElement.clientWidth
      );

      // Elements crossing the right edge or starting left of 0.
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || cs.position === "fixed") continue;
        // Deliberately parked off-screen: the spam honeypot sits at -9999px,
        // and sr-only content uses the same trick. These are techniques, not
        // layout overflow, so treating them as failures just trains people to
        // ignore the report.
        if (el.closest('[aria-hidden="true"]') || el.closest(".sr-only")) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.left < -1000) continue; // off-screen by design, not by accident
        if (r.right > vw + 2 || r.left < -2) {
          // Ignore elements that are themselves scroll containers (by design).
          const scroller = el.closest("[class*='overflow-x-auto'],[class*='overflow-auto']");
          if (scroller && scroller !== el) continue;
          out.overflowers.push(
            `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 2).join(".")} L${Math.round(r.left)} R${Math.round(r.right)}`
          );
        }
      }
      out.overflowers = [...new Set(out.overflowers)].slice(0, 4);

      for (const img of document.images) {
        if (img.complete && img.naturalWidth === 0) {
          out.brokenImgs.push((img.currentSrc || img.src || "?").slice(-70));
        }
        if (img.getAttribute("alt") === null) out.noAlt++;
      }
      out.brokenImgs = [...new Set(out.brokenImgs)].slice(0, 4);
      return out;
    });

    if (report.hScroll > 0) note(`${width} ${path} — page scrolls horizontally by ${report.hScroll}px`);
    for (const o of report.overflowers) note(`${width} ${path} — element past viewport: ${o}`);
    for (const b of report.brokenImgs) note(`${width} ${path} — broken image: ${b}`);
    if (report.noAlt) note(`${width} ${path} — ${report.noAlt} <img> with no alt attribute`);
    for (const e of [...new Set(errors)].slice(0, 3)) note(`${width} ${path} — console: ${e}`);

    await page.close();
  }
  await ctx.close();
  console.log(`  swept ${PAGES.length} pages @ ${width}px`);
}

/* ---- interactive spot checks ---- */
console.log("\n  interactive checks:");

// Mobile drawer at 390
{
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.click('button[aria-label="Open menu"]');
  await p.waitForTimeout(450);
  const open = await p.evaluate(
    () => getComputedStyle(document.querySelector("div.fixed.inset-0.lg\\:hidden")).visibility
  );
  if (open !== "visible") note("390 mobile drawer did not open");
  else console.log("     mobile drawer opens: ok");
  await p.keyboard.press("Escape");
  await p.waitForTimeout(450);
  const shut = await p.evaluate(
    () => getComputedStyle(document.querySelector("div.fixed.inset-0.lg\\:hidden")).visibility
  );
  if (shut !== "hidden") note("390 mobile drawer did not close on Escape");
  else console.log("     mobile drawer closes on Escape: ok");
  await p.close();
}

// FAQ accordion
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/treatment/detoxification", { waitUntil: "networkidle" });
  const btn = p.locator('button[aria-controls^="faq-answer-"]').nth(1);
  if (await btn.count()) {
    const before = await btn.getAttribute("aria-expanded");
    await btn.click();
    await p.waitForTimeout(400);
    const after = await btn.getAttribute("aria-expanded");
    if (before === after) note("FAQ accordion did not toggle aria-expanded");
    else console.log(`     FAQ accordion toggles: ok (${before} -> ${after})`);
  } else note("FAQ accordion buttons not found on /treatment/detoxification");
  await p.close();
}

// Gallery lightbox
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/tour", { waitUntil: "networkidle" });
  const tile = p.locator('button[aria-label^="View "]').first();
  if (await tile.count()) {
    await tile.click();
    await p.waitForTimeout(500);
    const shown = await p.locator("text=Close").count();
    const box = await p.evaluate(() => !!document.querySelector(".fixed.inset-0.z-\\[80\\]"));
    if (!box) note("gallery lightbox did not open");
    else console.log("     gallery lightbox opens: ok");
    await p.keyboard.press("Escape");
    await p.waitForTimeout(400);
    const gone = await p.evaluate(() => !document.querySelector(".fixed.inset-0.z-\\[80\\]"));
    if (!gone) note("gallery lightbox did not close on Escape");
    else console.log("     gallery lightbox closes on Escape: ok");
  } else note("gallery tiles not found on /tour");
  await p.close();
}

// Lead form client-side behaviour
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await p.fill("#firstName", "QA");
  await p.fill("#phone", "zzz");
  await p.check('input[name="consent"]');
  await p.click('button[type="submit"]');
  await p.waitForTimeout(2500);
  const msg = await p.locator('[role="alert"]').first().textContent().catch(() => null);
  if (!msg) note("lead form gave no visible error for an invalid phone");
  else console.log(`     lead form surfaces an error: ok ("${msg.trim().slice(0, 62)}…")`);
  await p.close();
}

await browser.close();

console.log(`\n  ── failures: ${failures.length} ──`);
for (const f of failures) console.log("   ✗ " + f);
process.exit(failures.length ? 1 : 0);
