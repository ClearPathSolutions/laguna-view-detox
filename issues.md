# Laguna View Detox — Issue Register & Task Plan

**Generated:** 2026-08-07
**Repo:** `/Users/benjamincastro/Laguna View Detox` (branch `main`, commit `46749ac`)
**Production:** https://lagunaviewdetox.com · **Preview build:** https://laguna-view-detox.vercel.app

---

## Sources

| # | Source | Scope | Rows pulled |
|---|---|---|---|
| 1 | **Code audit** — clean production build + full crawl of all 77 internally-reachable routes + headless a11y/perf probes, run 2026-08-07 | This repo | 22 findings |
| 2 | **QHG tracker sheet** → tab `Vercel Build Issues` ([link](https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8/edit)) | LVD-specific + portfolio-wide | **10 LVD** + 13 ALL SITES + 13 other-facility rows that name LVD |
| 3 | **QHG tracker sheet** → tab `Visual Issues` | LVD content/layout QA | 233 rows (IDs 1087–1319) + **2 QHG rows about LVD** |
| 4 | **QHG tracker sheet** → tab `Broken Internal Links` | — | 0 rows for LVD (only Dallas + Fort Worth have broken links) |
| 5 | **QHG tracker sheet** → tab `Verification Log` | Verdicts + buried findings | **17 entries naming LVD** |
| 6 | **Live production checks** against `lagunaviewdetox.com`, run 2026-08-07 | Cutover risk | 16 URL probes |
| 7 | **QHG staff bios master doc** ([link](https://docs.google.com/document/d/1MWL4ki6HDCcUN-1mh2EFU-6eoMVpwpSSRMDm58Me3oA/edit)) | Current portfolio staff roster + full bios | **11 LVD-relevant staff**, bios written and ready |
| 8 | **QHG facility master data row** (supplied 2026-08-07) | NAP, levels of care, bed count, established year, GMB | 1 row, 13 fields |
| 9 | **Staff headshot library** — `~/Downloads/Staff Headshots/` | Portfolio headshots, 122 files | **12 LVD-relevant images**, all located (T-42) |
| 10 | **LVD brand asset library** — `~/Downloads/Laguna View Detox/` | 95 photos, 3 logos, 2 videos (1.7 GB) | Audited against all **176** site image refs (T-47) |

Source 7 is bios only — no facility, program, or licensing content. Its value here is that it is the **authoritative current staff roster**, and it settles two open questions from T-00.

### Source 8 — facility master data, checked field by field

| Field | Master data | Site | Result |
|---|---|---|---|
| Company | Laguna View Detox | same | ✅ |
| Site URL | `https://lagunaviewdetox.com/` | — | ⚠️ **trailing slash** — corroborates T-35/T-41 |
| LOC | **Detox & Res** | 4 "Levels of Care" advertised | ⚠️ **T-46** |
| SUD | ✔ | yes | ✅ |
| MH | **(blank)** | dual diagnosis + MH treatment marketed | ⚠️ **T-46** |
| In-patient beds | 6 | "six-bed" / "6-Bed" | ✅ |
| Address | 31305 Ceanothus Dr | `lib/site.ts:13` | ✅ |
| City / Zip | Laguna Beach, CA / 92651 | `lib/site.ts:14,16` | ✅ |
| Website # | 866-932-3206 | `lib/site.ts:8` | ✅ |
| **Est** | **2020** | **"Since 2015" ×5** | ❌ **T-44** |
| GMB review link | `g.page/r/CUMi-UYjQ10wEAI/review` | absent from codebase | ❌ **T-45** |

NAP data is clean — address, phone, zip and bed count all reconcile exactly, which matters for local SEO and is one less thing to fix.

Tab `Legend` defines the verdict vocabulary used below: `CONFIRMED`, `CONFIRMED_AMENDED` (real, but the original row's wording or fix was wrong), `NOT_CONFIRMED`, `DUPLICATE`, `BY_DESIGN`.

### Extraction completeness

Three passes were needed. Each found something the previous one missed.

**Pass 1** — filter on the `Facility` column. Under-counted: the write-up captured only 6 of the 10 LVD build rows because the terminal dump was truncated.

**Pass 2** — scan every cell of all 5 tabs for `laguna|LVD`:

| Tab | Rows naming LVD anywhere | Caught by facility filter | Recovered |
|---|---|---|---|
| Vercel Build Issues | 30 | 17 | **13** (LVD named in `Issue`/`Fix`/`Correction` of other facilities' rows) |
| Visual Issues | 235 | 233 | **2** (QHG rows about LVD's parent-site entry) |
| Verification Log | 17 | 0 | **17** |
| Legend | 1 | 0 | 1 |
| Broken Internal Links | 0 | 0 | 0 |

**Pass 3** — structural audit that does not rely on keywords at all: count non-empty rows per tab, enumerate every distinct `Facility` value, and join the `Verification Log` to build rows **by Issue ID**. This is what surfaced the four missing LVD rows and four log entries that never say "laguna".

| Tab | Rows total | Non-empty | Notes |
|---|---|---|---|
| Vercel Build Issues | 996 | **102** | 0 non-empty rows have a blank facility — nothing hidden by the filter |
| Broken Internal Links | 994 | **31** (29 issues + 2 header) | Dallas 16, Fort Worth 13, **LVD 0** — confirmed |
| Visual Issues | 2000 | **1810** | LVD IDs 1087–1319 contiguous, zero gaps, zero blank-facility rows |
| Verification Log | 1000 | **74** | 4 entries for LVD/ALL-SITES rows contain no "laguna" keyword |
| Legend | 1000 | **27** | read in full |

All 5 tabs are `state="visible"` — there are no hidden sheets. Distinct facility values were enumerated across every tab; `Laguna View Detox` is spelled one way and there is no alternate label. The numeric facility values in Visual Issues (`2318`, `2330`, …) are column-misaligned Marina Harbor rows, verified not LVD.

**Recovered into this document:** tasks **T-35 – T-41** and portfolio rows **V0048 / V0091 / V0128**. The four LVD rows missed in pass 1 — **V0115, V0119, V0120, V0121, all `HIGH`** — are now T-36, T-39, T-40 and T-41.

### Legend caveats that change how to read the sheet

- **34 of 118 rows are `NOT YET VERIFIED`**, including all 29 broken-link rows. Legend: *"Treat their counts and fix instructions with the same caution the verified set earned — roughly two thirds of verified rows needed a correction."*
- **8 rows had a wrong or unsafe Fix**: 3 cited URLs that 404 or redirect, 3 would have deleted a working phone line, 2 would have deleted a live page. Two of those unsafe fixes are LVD's (V0063, V0064) — both retracted below.
- **`ID STABILITY`**: IDs V0001–V0118 were re-locked on 2026-07-28. Anything referencing these IDs from before that date must be re-checked.
- LVD's four new rows (V0115, V0119–V0121) came *out of* the verification pass rather than being re-tested by it. I independently confirmed three of them against this repo and live production — see each task.

---

## ⚠️ Read this before starting: the sheet and this repo are not the same build

The sheet audited a deployed build that **contains content this repo does not have**. Verified 2026-08-07:

| Sheet references | In this repo? |
|---|---|
| Team members "Christi Llamas, SUDRC" and "Lamont Damon, AMFT" (rows 1318–1319) | ❌ absent from `lib/data.ts` — **but confirmed as current LVD staff with full bios in the staff doc (source 7). The sheet is right and this repo is stale. See T-42.** |
| Byline names "Kris Brace, CADC II" / "Riky Hanaumi, LCSW" | ⚠️ **Riky Hanaumi confirmed** — real LCSW, Clinical Director for QHG California (source 7). **Kris Brace is absent from the staff roster entirely.** See T-11 and T-43. |
| "Table of Contents" component | ❌ absent |
| "They Trusted Us With Their Recovery" Google-reviews slider | ❌ absent |
| Editorial Policy page | ❌ absent |
| Row 1177 "What is Cocaine?" on the `/meth` page | ❌ not reproducible — `/meth` headings are all Meth-specific. **Sheet typo**; the intent (add program widgets to the "What is Meth?" section) still applies |

**T-00 below is a blocking prerequisite.** Do not start Appendix A content work until it is resolved, or you will rebuild content against the wrong baseline.

---

## Status summary

| Priority | Count | Theme |
|---|---|---|
| **P0 — ship blockers** | 11 | Baseline drift, **dead lead delivery**, **182-pair cutover redirect map**, **broken canonical targets**, **`/insurance` URL structure**, **missing production post**, blog crawlability, `/blog` metadata, homepage title, analytics, mobile keyboard trap |
| **P1 — high** | 16 | **Outdated staff roster**, **medical-review program**, **est-year conflict**, **brand-photo migration**, **unused GMB profile**, **scope-of-care verification**, image delivery, carrier graphic accuracy, meta descriptions, footer link integrity, E-E-A-T bylines, content restoration, schema, stale blog slugs, stray root-level post, no `/faq` page |
| **P2 — medium** | 9 | H1s, competing luxury pages, form placement, thin pages, TOC, at-a-glance, layout patterns |
| **P3 — low** | 13 | Lint, rate limiting, copyright year, casing, robots, FAQ a11y, misc polish |
| **Portfolio** | 11 | Owned outside this repo — slug standards, trailing slash, cutover, **inbound equity**, **phone contamination** |
| **Closed** | 2 | By design / no action |

---

## Implementation status — verified 2026-08-07

Build clean (exit 0, **237 static pages**). Crawl of every internally-reachable route: **232 pages, 0 broken links, 0 canonical problems, 0 duplicate titles/descriptions, 0 H1 problems, 0 missing alt, 0 thin pages, 0 orphans**. Keyboard probe at 390px and 1440px: **0 tab stops in hidden/inert content, no horizontal overflow, no JS errors**.

| Metric | Audit baseline | Now |
|---|---|---|
| Pages reachable by crawl | 77 | **232** |
| Missing canonicals | 1 | **0** |
| Over-length titles | 31 | **0** |
| Over-length meta descriptions | ~65 | **3** |
| Images > 500 KB | ~20 | **0** |
| Tab stops in closed mobile drawer | 18 | **0** |
| JSON-LD types | MedicalBusiness only | + BreadcrumbList ×228, BlogPosting ×158, FAQPage ×11 |

**Done (33):** T-01 T-02 T-03 T-04 T-05 T-06 T-08 T-09 T-10 T-13 T-14 T-15 T-16 T-17 T-18 T-20 T-21 T-22 T-23 T-24 T-25 T-26 T-27 T-28 T-29 T-30 T-31 T-32 T-33 T-38 T-39 T-40 T-41 · plus T-47 hero and T-45 GMB wiring.

**Partially done:** **T-48** — the route now logs a CRITICAL line when `LEAD_WEBHOOK_URL` is unset and `.env.example` documents it, but **the variable itself is still unset: no lead is being delivered anywhere**. **T-21** — component, placements and GMB CTA shipped; `lib/reviews.ts` is deliberately empty pending real Google review data, and no rating schema is emitted until it holds real reviews. **T-47** — hero, CTA band and logo done; who-we-treat/locations/blog imagery blocked on the brand decision. **T-04** — code complete; needs `NEXT_PUBLIC_GA_ID`.

**Blocked on the four questions (8):** T-11 T-35 T-36 T-42 T-43 T-44 T-46, plus T-12/T-19 which need the T-00 content baseline.

**Nothing else is open.** Every unblocked task in this document has been implemented and verified.

---

# P0 — Ship blockers

### T-00 · Reconcile this repo against the audited deployed build
**Priority:** P0 (blocks T-11, T-12, T-16–T-21, T-32 — every task sourced from the sheet's content rows) · **Source:** drift check 2026-08-07 · **Files:** `lib/data.ts`, `content/pages.raw.json`, `content/blog.json`

**Problem:** The sheet's 233 visual issues were written against a build with a 5-person team, a table-of-contents component, a Google-reviews slider, and page bylines. None exist here. Either this repo is behind the deployed build, or the sheet audited a different codebase.

**Fix:**
1. Diff `https://laguna-view-detox.vercel.app` against a local build, page by page, and identify which is authoritative.
2. If the deploy is ahead, pull those changes into this repo **first**.
3. Re-scope Appendix A against whichever build wins.
4. Related: sheet row **V0124** (`CRITICAL`) warns the Vercel builds were generated from a ~15–16 July 2026 content snapshot and production has kept publishing since — 15 pages across the portfolio exist on production but not in the builds. Re-run that diff for LVD before cutover.

**Acceptance:** A written statement of which build is authoritative, and Appendix A re-scoped against it.

---

### T-48 · `LEAD_WEBHOOK_URL` is unset — every lead lives only in server logs
**Priority:** P0 — launch blocker · **Source:** code audit; carried over from the July 2026 remediation and never closed · **Files:** `app/api/lead/route.ts:189`, Vercel project env vars

**Problem:** The lead endpoint forwards to a CRM/inbox webhook only when `process.env.LEAD_WEBHOOK_URL` is set. It is not set. The route degrades safely — it validates, records TCPA consent, `console.log`s the lead and returns success — but **there is no delivery**. Every admissions inquiry exists solely in Vercel function logs, which are retention-limited and not monitored by an admissions team.

This is the same unresolved dependency flagged in the July remediation. The form looks and behaves correctly, which is precisely what makes it dangerous: a person in crisis submits and is told "a member of our admissions team will contact you shortly."

**Fix:**
1. Stand up the destination (CRM endpoint, or an inbox relay) **under a signed BAA** — this carries PHI.
2. Set `LEAD_WEBHOOK_URL` in Vercel for Production and Preview.
3. Submit an end-to-end test lead and confirm it arrives in the destination, not just the log.
4. Add alerting on webhook delivery failure — the route already returns 502 and logs `[lead] delivery failed`, but nothing watches it.

**Acceptance:** A test submission arrives in the live destination. Deliberately breaking the webhook produces a visible alert, not a silent log line.

---

### T-41 · Cutover redirect map — 182 URL pairs
**Priority:** P0 · **Source:** sheet **V0121** (`HIGH`, LVD deep audit 2026-07-28) · **Files:** `next.config.mjs` redirects, or platform-level redirect config

**Problem:** This is the master cutover task, and it reframes several others below. Production and this build use **entirely different URL structures**. 182 pairs need 301s:

| Move | Count | Example |
|---|---|---|
| Blog posts: root `/<slug>/` → `/blog/<slug>` | **158** | `/why-is-crystal-meth-addictive/` → `/blog/why-is-crystal-meth-addictive` |
| Insurance pages → `/insurance/` | 7 | `/anthem` → `/insurance/anthem` |
| City pages → `/locations/` | 6 | `/los-angeles` → `/locations/los-angeles` |
| Population pages → `/who-we-treat/` | 7 | `/women` → `/who-we-treat/women` |
| About / bio pages → `/about/` | 4 | `/about-us` → `/about` |

I verified the pattern live: `lagunaviewdetox.com/insurance/anthem` currently 301s to `/anthem/`, confirming production is root-level.

**This is a migration requirement, not a defect.** The sheet is explicit that internal link integrity on the new build is **clean — 0 broken across 305 distinct internal URLs** (independently confirmed by my own crawl of 77 routes). The redirect map is the remaining cutover risk, not broken links.

**Fix:** Generate all 182 pairs and ship them in **one** redirect config together with T-35's trailing-slash decision — production is slash-canonical, the build is slashless, and doing these as two passes will produce redirect chains.

**Acceptance:** All 182 production URLs resolve to their new counterparts in a single 301 hop. No chains. Verified by script before DNS cutover.

---

### T-40 · One live production post is absent from the build entirely
**Priority:** P0 · **Source:** sheet **V0120** (`HIGH`) · **Verified against this repo 2026-08-07** · **Files:** `content/blog.json`

**Problem:** `Luxury Drug Rehab: What Five-Star Recovery Really Looks Like` is live and indexed on production (HTTP 200) but returns 404 on the build at both `/blog/<slug>` and root. **Confirmed absent from `content/blog.json` here** — no post with that slug, and no post matching "five-star" at all.

Found by diffing production Yoast sitemaps (202 URLs) against the build sitemap (205). It is the **only genuine content gap** among 29 differences — the rest are structural.

**It will 404 at cutover on a URL Google currently has indexed.**

**Fix:** Either port the post into `content/blog.json` at `/blog/luxury-drug-rehab-what-five-star-recovery-really-looks-like`, or declare it retired and 301 the production URL to `/luxury-rehab`. Do not leave it unmapped.

**Acceptance:** The production URL resolves 200 or 301 after cutover — never 404.

---

### T-35 · Every canonical this site emits points at a redirect or a 404
**Priority:** P0 · **Source:** sheet **V0067** + **V0102** (`CRITICAL`) + live production probe 2026-08-07 · **Files:** `lib/seo.ts:36`, `lib/site.ts:7`

**Problem:** The July canonical fix made every page self-referential — but it points them at URLs that **do not resolve**. Probed live against production 2026-08-07:

| Canonical this repo emits | Production response |
|---|---|
| `https://lagunaviewdetox.com/` | **200** ✅ |
| `https://lagunaviewdetox.com/about` | 301 → `/about-us/` |
| `https://lagunaviewdetox.com/insurance` | **404** ❌ |
| `https://lagunaviewdetox.com/blog` | 301 → `/blog/` |
| `https://lagunaviewdetox.com/tour` | 301 → `/tour/` |
| `https://lagunaviewdetox.com/admissions` | 301 → `/admissions/` |
| `https://lagunaviewdetox.com/contact` | 301 → `/contact/` |
| `https://lagunaviewdetox.com/luxury-rehab` | 301 → `/luxury-rehab/` |
| `https://lagunaviewdetox.com/treatment/detoxification` | 301 → `/treatment/detoxification/` |

**Of 9 sampled routes, exactly one resolves cleanly.** The sheet measured the same across all 46 structural pages: 43 canonicals → 301, 1 → 404, 1 → 200.

Root cause is **V0102**: this build emits slashless URLs; production is slash-canonical. A canonical pointing at a redirect is discounted by search engines — so the July fix currently delivers close to zero of its intended benefit. This is the highest-leverage SEO item on the list and it was mis-filed as portfolio-only in the first version of this document.

Two consequences worth noting:
- **`/about` is a double defect** — slug change *and* trailing slash (production slug is `/about-us`, per V0116/V0103).
- LVD is cited as the "working example to copy" in five other facilities' canonical rows (**V0018, V0039, V0058, V0082, V0092**) and in the `Legend` tab. It is the worst-configured build in the portfolio for this. Fixing it here unblocks those.

**Fix:** Decide the trailing-slash convention with QHG (V0102 is portfolio-wide), set `trailingSlash` in `next.config.mjs` to match production, and make `pageMeta()` emit canonicals in that form. Resolve `/about` vs `/about-us` explicitly. Then re-probe all 24 `pageMeta()` routes.

**Acceptance:** Every canonical returns 200 on production with no redirect hop. Re-run the probe table above and confirm 24/24.

---

### T-36 · The entire `/insurance/*` URL structure does not exist on production
**Priority:** P0 · **Source:** sheet **V0115** (`HIGH`) + live production probe 2026-08-07 (extends **V0067**, **V0096**, **V0121**) · **Files:** `app/insurance/page.tsx`, `app/insurance/[carrier]/page.tsx`, `lib/data.ts:145-155`

**Problem:** V0067's verification note said this was *"not currently logged anywhere"* — it was in fact logged as its own row, **V0115**, which I missed on the first pass:

> "Canonical points at a page that does not exist. `/insurance` canonicals to `https://lagunaviewdetox.com/insurance`, which returns HTTP 404 on production, telling search engines the authoritative version of the page is absent." — V0115, `HIGH`

Probing further, the divergence is structural, not a single page:

| This repo | Production |
|---|---|
| `/insurance` (hub) | **404** — and `/insurance/`, `/verify-insurance`, `/verify-insurance/`, `/insurance-verification`, `/admissions/insurance` all 404 too. **No insurance hub exists on production.** |
| `/insurance/anthem` | 301 → **`/anthem/`** — carrier pages live at **root level** |

So all 10 insurance routes (hub + 9 carriers) either canonical to a 404 or to a different path. This is the single largest URL-structure divergence between build and production, and it sits on the **highest-commercial-intent pages on the site**.

**Fix:**
1. Confirm with QHG whether production's root-level carrier slugs (`/anthem/`) or this build's nested ones (`/insurance/anthem`) survive cutover — V0096 proposes `/verify-insurance` as the portfolio standard, which is a *third* option and would strand both.
2. Build the redirect map for all 10 URLs in whichever direction is chosen.
3. Only then fix the canonicals (T-35).

**Acceptance:** A signed-off redirect map covering the hub and all 9 carrier pages; every insurance canonical resolves 200.

---

### T-01 · 144 of 157 blog posts have zero internal links
**Priority:** P0 · **Source:** code audit · **Files:** `components/BlogArchive.tsx:9`, `app/blog/page.tsx`

**Problem:** `/blog`'s static HTML contains only 13 post links. "Load More" and the category filter are client-side state only — there are no paginated routes and no category archive pages. A crawl reached 77 of 210 pages. The sitemap lists all 157 posts, but sitemap inclusion is discovery, not internal link equity. **92% of the content library receives none.** Single biggest SEO defect on the site.

**Fix:**
- Add real paginated routes: `/blog/page/[n]` rendering all posts server-side, `PAGE_SIZE = 12`.
- Add category archives: `/blog/category/[slug]`, generated from `lib/blog.ts` `categories`.
- Keep "Load More" as progressive enhancement; make the paginated URLs the crawlable substrate with `rel="prev"/"next"`.
- Link category archives from the blog index and each post.

**Acceptance:** A crawl from `/` reaches all 157 post URLs. `/blog/page/2` returns 200 with 12 distinct posts.

---

### T-02 · `/blog` has no canonical and inherits the homepage's OpenGraph
**Priority:** P0 · **Source:** code audit + sheet **V0067** (`CONFIRMED_AMENDED`) · **Files:** `app/blog/page.tsx:10`

**Problem:** `app/blog/page.tsx` exports a raw `Metadata` object instead of calling `pageMeta()`. Result, verified in built HTML: **no `<link rel="canonical">` at all**, `og:url` points at the homepage, `og:title` reads "Luxury Drug Rehab in Laguna Beach". It is the only page of 77 missing a canonical — the one page that escaped the canonical fix.

Sheet correction on V0067 also notes the original row wrongly claimed `/blog` carries `robots: index, follow`. It carries **no robots meta** (indexable by default). Confirmed here.

**Fix:**
```ts
export const metadata = pageMeta({
  title: "Addiction Recovery Blog",
  description: "Guidance, education, and encouragement on detox, treatment, and lasting recovery from the Laguna View Detox clinical team.",
  path: "/blog",
});
```

**Acceptance:** `curl .../blog | grep canonical` → `https://lagunaviewdetox.com/blog`; `og:url` matches.

---

### T-03 · Homepage `<title>` has no brand suffix
**Priority:** P0 · **Source:** code audit · **Files:** `app/page.tsx:14-18`

**Problem:** Renders as `Luxury Drug Rehab in Laguna Beach`. Next's `title.template` does not apply to the segment that defines it, and `app/page.tsx` is the same segment as `app/layout.tsx`. `og:title` has the brand; the `<title>` tag does not. Highest-value page on the site.

**Fix:** Set the homepage title explicitly, e.g. `"Luxury Drug Rehab in Laguna Beach | Laguna View Detox"`, or use `title: { absolute: ... }`.

**Acceptance:** `<title>` includes the brand and is ≤ 62 chars.

---

### T-04 · No analytics or conversion tracking anywhere
**Priority:** P0 · **Source:** code audit · **Files:** `app/layout.tsx`, `components/LeadForm.tsx`, `next.config.mjs`

**Problem:** Grep across `app/`, `components/`, `lib/` finds no GA4, GTM, call tracking, or form-conversion events. Not one lead is attributable. On a lead-gen site this is a business defect, not a technical one.

**Fix:**
- Add GA4 (or GTM) via `next/script` with `strategy="afterInteractive"`.
- Fire a conversion event on `LeadForm` success and on every `tel:` click.
- **CSP must be widened** — `next.config.mjs:7-20` currently sets `script-src 'self' 'unsafe-inline'` and `connect-src 'self'`, which will block any tag. Add the specific analytics hosts; do not fall back to a wildcard.
- Add call tracking (CallRail or equivalent) if phone attribution matters — it will, given the phone is the primary CTA.

**Acceptance:** Real-time event visible in GA4 for a page view, a form submit, and a phone click. CSP still has no wildcard.

---

### T-05 · Mobile drawer is a keyboard trap
**Priority:** P0 · **Source:** code audit · **Files:** `components/Header.tsx:266-372`

**Problem:** Measured with a headless keyboard probe at 390px: the **closed** drawer carries `aria-hidden="true"` but keeps **48 focusable elements in the tab order**. 18 of the first 22 tab stops land on invisible drawer links. Focusable content inside `aria-hidden` is an ARIA violation (WCAG 2.1 SC 4.1.2). The drawer additionally has no focus trap, does not move focus on open, does not restore focus on close, and does not close on Escape — all three of which the desktop mega-menu received in the July pass.

**Fix:**
1. Add `inert` to the drawer wrapper when closed (or `visibility: hidden`, which removes descendants from the tab order — the technique already working on the desktop panel at `Header.tsx:164-168`).
2. Move focus to the close button on open; restore to the hamburger on close.
3. Trap Tab within the panel while open.
4. Close on Escape.

**Acceptance:** With the drawer closed at 390px, zero tab stops fall inside it. With it open, Tab cycles within the panel and Escape closes it.

---

# P1 — High

### T-06 · Image delivery: unoptimized, unsized, uncached
**Priority:** P1 · **Source:** code audit · **Files:** `next.config.mjs:40-46`

**Problem:** Three compounding defects.
- `unoptimized: true` → no AVIF/WebP, no responsive `srcset`. A phone downloads the same 526 KB hero as a 1440px desktop.
- Measured initial payload: homepage **~6.4 MB** of images, `/blog` **~7.3 MB**. Largest single assets are 830+ KB blog JPEGs.
- Images serve `Cache-Control: public, max-age=0` — also Vercel's default for `/public` — so 68 MB of assets revalidate on every visit.

**Fix:**
1. Remove `unoptimized: true` and let `next/image` generate AVIF/WebP + `srcset` (`formats` is already configured).
2. Add a long-lived cache header in `headers()` for `/images/:path*`: `public, max-age=31536000, immutable`.
3. Re-compress the ~20 blog JPEGs over 600 KB.

**Acceptance:** Homepage initial image payload under 1 MB on a 390px viewport. `/images/*` returns a 1-year `max-age`.

---

### T-07 · Insurance carriers graphic is inaccurate and off-brand
**Priority:** P1 · **Source:** code audit · **Files:** `components/sections.tsx:90-98`, `public/logos/insurance-carriers.png`, `lib/data.ts:145-155`

**Problem:** A 750×500 raster with a **mustard background baked in**, sitting inside a white card — it reads as a rendering bug. It shows Humana, CareFirst, MVP, Beacon, ValueOptions, Horizon, Independence, Medical Mutual, and **TRICARE** — none of which appear in `lib/data.ts` carriers or in the nav. Its `alt` text describes a different set entirely ("Anthem, Aetna, Blue Cross Blue Shield, Cigna and more").

Advertising TRICARE acceptance you may not hold is an accuracy exposure on a YMYL healthcare site.

**Fix:** Replace the raster with individual transparent-background logos rendered from the `carriers` array, so the graphic and the carrier list can never drift again. Confirm with admissions exactly which carriers are contracted before publishing any logo. Update the `alt` text to match.

**Related:** sheet rows 1259, 1274, 1285 ask for the "Your treatment may be fully covered" insurance tool to be reused on `/locations/san-diego`, `/insurance/aetna`, `/insurance/bcbs` — do that after this component is fixed, not before.

**Acceptance:** Rendered logos match `lib/data.ts` exactly; no baked-in background; every logo confirmed by admissions.

---

### T-08 · ~65 pages have over-length meta descriptions
**Priority:** P1 · **Source:** code audit · **Files:** `content/pages.raw.json` (`metaDescription` per page), `content/blog.json`

**Problem:** Roughly 65 of 77 crawled pages exceed 165 characters, many in the 200–300 range (`/treatment/detoxification` is 269, `/blog/laguna-view-detox-begin-your-journey…` is 305). All truncate in SERPs. Blog `<title>`s run long too — up to 114 characters.

**Fix:** Rewrite to 140–160 chars for descriptions, ≤ 60 for titles. Add a build-time guard in `lib/seo.ts` that warns when either overruns.

**Acceptance:** Zero pages over 165 / 62 chars. Guard fails loudly in CI.

---

### T-09 · Footer link integrity — three separate defects
**Priority:** P1 · **Source:** sheet **V0064** + **V0066** (`CONFIRMED`) + code audit · **Files:** `components/Footer.tsx:13-47`

**Problem:** Three issues in one component.
1. **V0066 (CONFIRMED, no amendment):** the footer's "Who We Treat" column lists 5 of 7 population pages — `/who-we-treat/young-adults` and `/who-we-treat/college-students` are omitted despite both being live.
2. **V0064 (CONFIRMED_AMENDED):** internal-linking priority is inverted. The footer promotes the *thin* root pages (`/drug-addiction-treatment`, `/alcohol-detox-and-treatment-programs`) while the substantial service pages they overlap are absent — `/treatment/detoxification/alcohol` is not in the footer at all. **The sheet's original "301 these as duplicates" fix is wrong and was retracted on verification:** measured overlap is only 23.5% / 26.7% word-level. Do not redirect; re-prioritise the links.
3. **V0063 (CONFIRMED_AMENDED):** header links `/luxury-rehab`, footer links `/luxury-addiction-treatment` — see T-15.

**Fix:** Add the two missing population pages. Promote `/treatment/detoxification` and `/treatment/detoxification/alcohol` into the Programs column. Keep the root pages live but demote them. Make header and footer agree on the luxury page.

**Acceptance:** All 7 `who-we-treat` pages linked; service pages outrank root pages in the footer; header/footer luxury link identical.

---

### T-10 · No `FAQPage` / `BlogPosting` / `BreadcrumbList` schema
**Priority:** P1 · **Source:** code audit · **Files:** `app/layout.tsx:65-112`, `components/Faq.tsx`, `components/PageHero.tsx`, `app/blog/[slug]/page.tsx`

**Problem:** All 77 crawled pages emit only `MedicalBusiness`. Unclaimed rich results, with the source data already in hand:
- **10 pages** have real FAQ accordions (3–7 Q each): `detoxification`, `dual-diagnosis`, `aftercare`, `cocaine`, `heroin`, `addiction-therapies`, `alcohol`, `meth`, `benzodiazepines`, `orange-county-drug-rehab` → `FAQPage`.
- **157 blog posts** carry author + date → `BlogPosting`.
- **Every page** renders visible breadcrumbs → `BreadcrumbList`.

**Fix:** Emit each alongside the existing org JSON-LD. Drive `FAQPage` off the same `page.faqs` array `Faq.tsx` already consumes so they cannot drift.

**Acceptance:** All three types validate in Google's Rich Results Test.

---

### T-11 · Add E-E-A-T bylines (Written By / Medically Reviewed / Last Updated)
**Priority:** P1 · **Source:** sheet rows 1099, 1100 + 15 others (17 total) · **Files:** `lib/content.ts`, `components/ContentPage.tsx`, `content/pages.raw.json`

**Problem:** 17 rows request a byline block on treatment and population pages. For a YMYL healthcare site this is a direct ranking and trust factor, and it is absent everywhere.

Example from the sheet (row 1099, `/treatment/detoxification`):
> Written By: Kris Brace, CADC II · Medically-Reviewed By: Riky Hanaumi, LCSW · Last Updated: May 2026

Row 1100 (`/treatment/dual-diagnosis`) adds `Written on: January 5, 2026`.

**Fix:** Add optional `author`, `reviewer`, `writtenOn`, `lastUpdated` to the `PageContent` type; render a byline block in `ContentPage`; populate per page from the sheet. Feed the same values into the `BlogPosting`/`MedicalWebPage` schema from T-10.

⚠️ **Partially unblocked.** The QHG staff doc confirms **Riky Hanaumi is a genuine LCSW** and Clinical Director for QHG California, so the reviewer byline is safe to publish. **Kris Brace is not in the staff roster** — that byline stays blocked pending HR. See **T-43** for reviewer assignment and the `Dr. Pamela Tambini` option.

**Acceptance:** Byline renders on all 17 named pages; every name confirmed against the current roster and linked to a live bio page.

---

### T-12 · Restore content dropped during the scrape (46 rows)
**Priority:** P1 · **Source:** sheet — 46 rows across Appendix A · **Files:** `content/pages.raw.json`

**Problem:** The largest single theme in the visual-issues tab. 46 rows report paragraphs, bullet lists, and whole sections present on the original site but missing from the rebuild — the scrape into `pages.raw.json` dropped them. This also explains the thin pages found independently in the code audit (`cocaine` 212 words, `benzodiazepines` 245, `drug-addiction-treatment` 286).

Representative:
- 1096 `/treatment/detoxification` — "What Exactly is Detox?" only partially imported
- 1102 `/treatment/dual-diagnosis` — missing the Substance Abuse / Mental Health bullet lists and closing sentence
- 1150–1152 `/treatment/detoxification/alcohol` — missing signs bullets, short/long-term effects bullets, closing paragraph
- 1187 `/benzodiazepines` — entire "Laguna View Detox is a Benzo Detox Center in Orange County" section missing
- 1232 `/who-we-treat/veterans` — entire closing section missing
- 1115, 1116, 1122 — missing "Find Long-Term Recovery Today" and "Resources" sections

**Fix:** Re-scrape from production page by page and diff against `pages.raw.json`. Fix the extractor before re-running — a systematic bullet-list and trailing-paragraph loss is the likely root cause, and hand-patching 46 rows without fixing it guarantees recurrence.

**Acceptance:** Every listed section present; no page under 450 words; a diff script proves parity with production.

---

### T-37 · One blog post sits at root level instead of `/blog/<slug>`
**Priority:** P1 · **Source:** sheet **V0101** correction (`CONFIRMED_AMENDED`) · **Files:** `content/blog.json`, `app/blog/[slug]/page.tsx`

**Problem:** V0101's verification found LVD is **internally mixed** — a detail the original row omitted:

> "TWO SITES ARE INTERNALLY MIXED, which the row does not mention. **Laguna: 158 posts at /blog/slug plus 1 at root level.** So the inconsistency is not only across sites but within them, and a per-site bulk rename would miss the stragglers."

That one stray post will be missed by any bulk migration and, being root-level, risks colliding with a page slug.

**Post counts do not reconcile across four sources — resolve this as part of T-00:**

| Source | Count |
|---|---|
| `content/blog.json` in this repo | **157** |
| V0101 / V0119 — preview build blog slugs | **158** |
| V0101 — plus one at root level | 158 + 1 |
| V0120 — one production post absent from the build (T-40) | +1 |
| V0121 — posts in the cutover map | **158** |

**Fix:** Identify the root-level post, move it under `/blog/`, 301 the old URL, and reconcile the counts so the T-41 redirect map is built against a verified total. **Acceptance:** every post resolves under `/blog/<slug>`; repo, build, and production counts agree.

---

### T-39 · Three blog slugs are stale — including "crystal-math" on a substance page
**Priority:** P1 · **Source:** sheet **V0119** (`HIGH`) · **Verified against this repo 2026-08-07** · **Files:** `content/blog.json`

**Problem:** Production renamed three blog slugs on **2026-07-16 — one day after the build snapshot** — and 301s the old spellings to the corrected ones. This build still carries the old spellings. **All three confirmed present in `content/blog.json`; none of the corrected forms exist here:**

| Stale slug in this repo | Corrected slug on production |
|---|---|
| `why-is-crystal-math-addictive` | `why-is-crystal-meth-addictive` |
| `use-your-gilsbar-health-insurance-to-treat-your-addicition` | `…-to-treat-your-addiction` |
| `addiction-in-the-families-and-love-ones` | `addiction-in-families-and-loved-ones` |

**"Crystal math" is the priority — it is a substance page on a treatment site.** The post's `title` field is already correct ("Why is Crystal Meth Addictive?"); only the slug carries the typo, so the error is invisible in the UI and visible only in the URL.

Of 158 preview blog slugs, 154 match production exactly and 3 are stale. **This is a direct instance of the T-00 snapshot gap** — the same root cause as V0120, V0121 and the portfolio-wide V0124.

**Fix:** Rename all three to the corrected spellings, then 301 the misspelled forms so production's existing redirects are preserved rather than reversed.

**Acceptance:** All three corrected slugs live; old forms 301 in one hop; no reversed redirect chains against production.

---

### T-42 · The team page lists three people who are not on the current staff roster
**Priority:** P1 · **Source:** QHG staff bios doc (source 7) cross-checked against `lib/data.ts` 2026-08-07 · **Files:** `lib/data.ts:200-221`, `app/about/page.tsx`, `app/about/[member]/page.tsx`, `content/pages.raw.json`

**Problem:** The site publishes three staff members. **None of them appear anywhere in the current QHG staff roster:**

| On the site now | In the current roster? |
|---|---|
| Karen Pettit, CADC II — Program Director | ❌ absent |
| David Goodgame — Program Director | ❌ absent |
| Nicole Burson — Clinical Team | ❌ absent |

Meanwhile **11 current staff cover LVD**, all with bios already written and ready to publish:

| Tier | Staff |
|---|---|
| QHG California leadership | Shawn Young (Executive Director) · Michael McArthur (Nursing Director) · **Riky Hanaumi, LCSW** (Clinical Director) · Monica Olivares (Clinical Supervisor) · Jacob Cameron (Client Care Director) |
| Southern California | Justin White (Program Director) · Elizabeth Wald (Program Director) · Jeremiah Ross (Nursing Supervisor) · Alanna McMurtrey (Lead Case Manager) |
| Laguna View Detox site | **Lamont Damon, AMFT** (Therapist) · **Christi Llamas, SUDRC** (Case Manager) |

This is an accuracy problem on a YMYL healthcare site — prospective clients and families are choosing a facility partly on who works there. It also drags three other items with it:

- **Confirms sheet rows 1318–1319.** Those rows name Christi Llamas and Lamont Damon as LVD team members whose cards don't link through. I flagged both as "absent from this repo" — the sheet was right; this repo is stale. **T-32 is real, not a drift artifact.**
- **Changes V0065.** That row asks the QHG parent to stop republishing Karen Pettit's bio. If she has departed, the action is to *remove* both copies, not to canonicalise one to the other. Re-scope before actioning.
- **Partially resolves T-00** for the team question specifically: on staff, the sheet and the staff doc agree, and this repo is the outlier.

**Headshot assets — all 11 located and mapped.** Source: `~/Downloads/Staff Headshots/`. Every person on the roster has an image; **none of the three departed staff do**, which independently corroborates the roster finding.

| # | Person | Role | Source file (under `Staff Headshots/`) | Fmt | Dimensions | Size | Target filename |
|---|---|---|---|---|---|---|---|
| 1 | Shawn Young | Executive Director | `California/CA-Shawn Young.png` | PNG | 1254×1254 **1:1** | 1.8 MB | `team-shawn-young.jpg` |
| 2 | Michael McArthur | Nursing Director | `California/CA-MichaelMcArthur.png` | PNG | 1254×1254 **1:1** | 1.8 MB | `team-michael-mcarthur.jpg` |
| 3 | Riky Hanaumi, LCSW | Clinical Director | `California/CA-Riky Hanaumi.png` | PNG | 1086×1448 (3:4) | 1.9 MB | `team-riky-hanaumi.jpg` |
| 4 | Monica Olivares | Clinical Supervisor | `California/CA-Monica-Olivires.webp` ⚠️ | WebP | 1536×2048 (3:4) | 93 KB | `team-monica-olivares.jpg` |
| 5 | Jacob Cameron | Client Care Director | `California/CA-Jacob Cameron.png` | PNG | 1254×1254 **1:1** | 1.8 MB | `team-jacob-cameron.jpg` |
| 6 | Justin White | Program Director | `California/Cali SOUTH/CA-Justin White.png` | PNG | 1122×1402 (3:4) | 1.8 MB | `team-justin-white.jpg` |
| 7 | Elizabeth Wald | Program Director | `California/Cali SOUTH/CA-Elizabeth-Wald.webp` | WebP | 1536×2048 (3:4) | 48 KB | `team-elizabeth-wald.jpg` |
| 8 | Jeremiah Ross | Nursing Supervisor | `California/Cali SOUTH/CA-Jeremiah Ross.jpg` | JPG | 1254×1254 **1:1** | 251 KB | `team-jeremiah-ross.jpg` |
| 9 | Alanna McMurtrey | Lead Case Manager | `California/Cali SOUTH/CA-Alanna McMurtrey.png` | PNG | 1254×1254 **1:1** | 1.7 MB | `team-alanna-mcmurtrey.jpg` |
| 10 | **Lamont Damon, AMFT** | Therapist (LVD site) | `California/Cali SOUTH/Laguna View/LVD- Lamont Damon.png` | PNG | 1254×1254 **1:1** | 2.2 MB | `team-lamont-damon.jpg` |
| 11 | **Christi Llamas, SUDRC** | Case Manager (LVD site) | `California/Cali SOUTH/Laguna View/LVD-Christi Llamas.png` | PNG | 1169×1345 (3:4) | 2.0 MB | `team-christi-llamas.jpg` |
| — | Dr. Pamela Tambini | Medical Oversight — see **T-43** | `Quadrant/Dr. Pamela Tambini.png` | PNG | 1254×1254 **1:1** | 1.8 MB | `team-pamela-tambini.jpg` |

**Three things to handle when importing:**

1. **Do not commit these as-is.** The 12 files total **17 MB** (avg 1.4 MB). `next.config.mjs` sets `unoptimized: true` (**T-06**), so whatever lands in `public/images/` ships at full size to every visitor. Convert to JPEG at the existing convention — `team-karen-pettit.jpeg` is 1500×2000 at 420 KB — which is roughly a **95% reduction**.
2. **Seven are square (1254×1254) but the card is `aspect-[3/4]`** (`app/about/page.tsx:138`). A 1:1 source in a 3:4 frame crops ~25% off the sides, which on a headshot means clipped shoulders and an off-centre face. Either re-crop each to 3:4 with the face on the upper third, or switch the card to `aspect-square`. Re-cropping is preferable — the four 3:4 sources already suit the existing layout.
3. **Filename says "Olivires", the bios doc says "Olivares."** Use the bios doc spelling for the slug, alt text and display name, and confirm with HR which is correct.

`Quadrant/Cali Leadership/Copy of CA-*.png` are byte-identical duplicates of the five `California/CA-*` files — verified with `cmp`. Ignore that folder.

**Fix:**
1. Confirm with HR which of the 11 should be public and whether the 3 current entries have genuinely departed.
2. Process the 12 headshots per the notes above into `public/images/`.
3. Rebuild `team` in `lib/data.ts` from the confirmed roster; port bios into `content/pages.raw.json`.
4. Generate `/about/<slug>` pages for each; delete or 301 the three departed bio pages — they are live indexed URLs, so add them to the T-41 redirect map.
5. Write descriptive `alt` text per image (currently the team grid passes only `m.name`).

**Note:** `Nicole Burson` has no image today and falls back to an initial-letter tile (`app/about/page.tsx:147-151`) — that fallback should stay, since the staff doc flags missing headshots for several people portfolio-wide.

**Acceptance:** Every published bio matches the current roster and has a processed 3:4 headshot under 500 KB; no departed staff remain reachable; removed bio URLs 301 rather than 404.

---

### T-43 · Stand up a medical-review program with named, credentialed reviewers
**Priority:** P1 · **Source:** QHG staff bios doc (source 7) + sheet's 17 byline rows · **Files:** `lib/content.ts`, `components/ContentPage.tsx`, `content/pages.raw.json`

**Problem:** T-11 needs 17 pages to carry `Written By` / `Medically Reviewed By` / `Last Updated`. The blocker was that I could not verify the names. The staff doc resolves half of it:

| Name | Status |
|---|---|
| **Riky Hanaumi, LCSW** — sheet's proposed reviewer | ✅ **Confirmed.** Erika "Riky" Hanaumi, Licensed Clinical Social Worker, 20+ years in behavioral health, MSW CSU Fullerton 2013, Clinical Director for QHG's California facilities. Credential is genuine and her remit covers LVD. |
| **Kris Brace, CADC II** — sheet's proposed writer | ❌ **Not in the staff roster.** Do not publish this byline until HR confirms. |
| **Dr. Pamela Tambini** — not in the sheet | ✅ Board-certified in **Internal Medicine and Addiction Medicine**; Medical Oversight for QHG. The strongest medical-review credential in the organisation and currently unused on the site. **Headshot available:** `Staff Headshots/Quadrant/Dr. Pamela Tambini.png` (1254×1254, 1.8 MB — process per T-42). |

**Fix:**
1. Confirm Kris Brace's status with HR; substitute a rostered author if she has departed.
2. Use Dr. Tambini for medical review on clinical pages (detox, dual diagnosis, withdrawal) and Riky Hanaumi for therapy and programme pages — match reviewer credential to subject matter rather than applying one name everywhere.
3. Link each byline to that person's bio page (depends on T-42).
4. Feed reviewer identity into the `MedicalWebPage` / `BlogPosting` schema from T-10.

⚠️ Never publish a medical-review byline for someone who did not review the page, or whose credential is unverified. That is the one item on this list with real regulatory exposure.

**Acceptance:** Every byline names a confirmed, currently-employed, credentialed person, links to their bio, and reflects a review that actually happened.

---

### T-47 · Move the site onto brand-approved photography only
**Priority:** P1 · **Source:** brand asset library `~/Downloads/Laguna View Detox/` (95 photos, 3 logos, 2 videos, 1.7 GB), audited against every image reference in the repo 2026-08-07 · **Files:** `components/Hero.tsx`, `components/PageHero.tsx`, `components/sections.tsx`, `lib/seo.ts`, `lib/site.ts`, `lib/data.ts`, `app/layout.tsx`, `content/pages.raw.json`, `content/blog.json`

**Problem:** The site references **176 distinct images. Not one is a byte-exact match to the approved library.**

| Status | Count |
|---|---|
| Exact match with library | **0** |
| Same photo, re-encoded/downscaled in repo | 9 |
| **Not in the library at all** | **167** |
| Library assets unused by the site | **89 of 95** |

The gap includes **the hero**. `/images/lvd-hp-bk-.jpg` is a generic aerial coastline shot that is not the property and not in the library — and it is used in **six** places: `Hero.tsx`, `PageHero.tsx` (default for every interior page), `sections.tsx` (CtaBand), `lib/seo.ts` (`DEFAULT_OG_IMAGE`), `app/layout.tsx` (site OG) and `locations/[slug]`. Replacing it is a single-value change with site-wide reach.

#### Hero replacement — recommendation

I rendered the top six candidates through a simulated hero crop with the existing left-weighted scrim to test headline legibility.

| Rank | Asset | Why |
|---|---|---|
| **1st** | `Copy of NIK_5883.jpg` (6016×4016) | Pool, ocean and the building in one frame — it is the actual property, which the current hero is not. Left third is deck and foliage, so the headline sits cleanly. |
| 2nd | `Copy of NIK_5663.jpg` (6016×4016) | Cleanest text legibility — plain white wall on the left, full Laguna coastline on the right. Calmer, less "luxury" signal. |
| 3rd | `Copy of NIK_5879.jpg` (6016×4016) | Same scene as 1st, pool more central. |
| — | `Copy of NIK_5928.jpg` (5033×3360) | Beautiful sunset, **but the left 40% is a dark building silhouette** that turns to mud under the scrim. Reject as hero — use it for `CtaBand`, which runs at 25% opacity. |

#### Direct swaps — same photo, master available

These nine are already the right image; the repo just holds a re-encoded copy. Re-export from the library masters (several are 6016×4016 originals against 200 KB repo derivatives).

| Repo file | Library master |
|---|---|
| `NIK_5789-scaled.jpg` | `Copy of NIK_5789.jpg` (6016×4016) |
| `NIK_5848-scaled.jpg` | `Copy of NIK_5848.jpg` (6016×4016) |
| `NIK_9847-scaled.jpg` · `NIK_9853-scaled.jpg` | same names (2560×1709) |
| `lvd-tour-22.jpg` | `lvd-tour-22.jpg` |
| `20230113-…-004 / -009 / -021 / -023-Small.jpg` | same names (1024×768 — low-res, see below) |

#### Replacements available in the library

| Current (not approved) | Used by | Replace with |
|---|---|---|
| `lvd-hp-bk-.jpg` **(hero ×6)** | Hero, PageHero, CtaBand, seo.ts, layout, locations | `NIK_5883` (hero) · `NIK_5928` (CtaBand) |
| `lvd-pool-3.jpg` | home, luxury pages | `NIK_5879` / `NIK_5883` / `NIK_5902` |
| `lvd-tour-12.jpg` | home, residential-inpatient | `NIK_5751` / `NIK_5754` / `NIK_5755` (living room, ocean windows) |
| `lvd-tour-25.jpg` | tour, detox, nav feature | `NIK_9847` (bedroom) or `NIK_5795` / `NIK_5812` |
| `Facility-4-1024x683-1.jpg` | gallery | `NIK_5890` / `NIK_5902` (exterior) |
| `shutterstock_1122712238.jpg` | blog index hero + blog default | `NIK_5764` / `NIK_5778` (turret nook) |

#### ⚠️ The library cannot cover everything — a strict "approved only" policy has three gaps

The library is **entirely facility architecture, interiors and grounds. It contains zero photographs of people and zero city/location imagery.** So these cannot be sourced from it:

| Gap | Pages | Current images | Options |
|---|---|---|---|
| **People** | 7 `/who-we-treat/*` | 7 unsplash/shutterstock stock photos | Switch to facility imagery, or commission a people shoot |
| **Cities** | 3 `/locations/*` (Newport, LA, San Diego) | 3 stock city photos | Same choice |
| **Blog** | 143 featured images | all stock | Realistically phased, or standardise on a small approved set |

**This needs a decision before work starts.** "Only use photos from this folder" is achievable today for the hero, homepage, tour, programme, insurance and gallery pages — roughly 33 non-blog images. It is *not* achievable for who-we-treat, locations and the blog without either new photography or accepting facility imagery in place of people.

#### Also in the library and currently unused

- **`Laguna-Logo-Gold.png`** (650×620) — a gold logo variant the site does not have. `logo-color.png` is byte-identical to `Laguna-Logo-Color.png` ✅, but `logo-white.png` is a **500×475 downscale** of the 650×620 `Laguna-Logo-White.png` — re-export at full size.
- **Two brand videos** — `Laguna View Detox Brand Story V2.mp4` (277 MB) and `Copy of lagunadetox_2.mp4` (383 MB). These answer sheet rows **1133** (`/tour` — "Include Laguna View Video under the first paragraph"), **1281** and **1284** (`/insurance/aetna`, `/insurance/bcbs` — "Add laguna view detox video"). They must be compressed and hosted externally or streamed — do not commit 660 MB to the repo.
- The 12 `20230113-*` facility photos are only **1024×768** and are the lowest-quality assets in the library. Where a `Copy of NIK_*` master shows the same subject at 6016×4016, prefer the master.

**Fix:**
1. Decide the people/cities/blog policy above.
2. Swap the hero and `DEFAULT_OG_IMAGE` first — six usages, one value each.
3. Re-export the 9 direct swaps from masters; apply the in-library replacements.
4. Re-export `logo-white.png` at 650×620; add the gold variant if design wants it.
5. Compress and host the brand video; wire into `/tour` and the two insurance pages.
6. **Sequence with T-06.** Masters are 10–25 MB each and `unoptimized: true` means whatever is committed ships as-is. Fix image optimisation first, or process every export down to web size manually.

**Acceptance:** Every non-blog image on the site resolves to an approved library asset or a documented, signed-off exception; hero is property photography; no file over 500 KB in `public/images/`.

---

### T-44 · "Since 2015" contradicts the master record's established year of 2020
**Priority:** P1 · **Source:** facility master data (source 8) vs repo, verified 2026-08-07 · **Files:** `app/about/page.tsx:69,89`, `components/home.tsx:168`, `content/pages.raw.json:63,77`

**Problem:** The master record lists **Est. 2020**. The site claims 2015 in five places:

| Location | Claim |
|---|---|
| `app/about/page.tsx:69` | "Since **2015**" — large gold stat card |
| `app/about/page.tsx:89` | "Since **2015**, our caring and professional staff have helped hundreds of people…" |
| `components/home.tsx:168` | homepage stat: **2015** — "Serving families since" |
| `content/pages.raw.json:63` | About page `metaDescription` — "Since **2015**…" (renders in search results) |
| `content/pages.raw.json:77` | About body — "Since **2015**, we have been helped hundreds of people…" |

**The staff bios doc corroborates 2020**, not 2015: *"In 2020, Joey founded Quadrant Health Group… What began with a single luxury treatment center in Laguna Beach…"* — that single Laguna Beach center is this facility.

The likely reconciliation is that the facility opened in 2015 under prior ownership and was acquired into QHG in 2020, in which case both dates are true of different things. But **"Since 2015, our staff have helped hundreds of people"** is a longevity and experience claim on a YMYL healthcare site, and it currently contradicts the organisation's own master record.

**Fix:** Confirm with leadership which date describes what. Then either keep 2015 with accurate framing (e.g. "Serving families in Laguna Beach since 2015"), or correct all five instances to 2020. Update the `metaDescription` in the same pass — it is the version that shows in search results.

**Acceptance:** One established date, consistent across all five locations and the master record, with framing that matches the ownership history.

---

### T-45 · Google Business Profile review link exists but is unused
**Priority:** P1 · **Source:** facility master data (source 8) · **Unblocks T-21** · **Files:** `lib/site.ts:21-26`, `components/Footer.tsx`, new reviews component

**Problem:** The master record carries a GMB review link — `https://g.page/r/CUMi-UYjQ10wEAI/review` — that appears **nowhere in the codebase**. `lib/site.ts` lists Facebook, Instagram, Yelp and YouTube, but no Google Business Profile.

This is the missing asset for **T-21**. Eight sheet rows (1097, 1103, 1135, 1244, 1277, 1286 + 2) request a "They Trusted Us With Their Recovery" Google-reviews slider, and I had flagged T-21 as blocked because the only testimonials on the site are six unattributed on-site quotes. The review link supplies the real source.

**Fix:**
1. Add `google` to `lib/site.ts` socials; surface it in the footer alongside the other profiles.
2. Add a "Leave us a review" CTA on the aftercare/alumni page — that link is a review *request* URL, which is what it is designed for.
3. Build the reviews component for T-21 from genuine Google review data.
4. Add `sameAs` for the GMB profile to the `MedicalBusiness` JSON-LD in `app/layout.tsx:82-87`.

⚠️ Only mark up `aggregateRating` / `review` with real, verifiable Google data. Do not compute a rating from the six on-site quotes — fabricated review markup is a manual-action risk and the exact trap T-21 was flagged for.

**Acceptance:** GMB linked from the footer and present in `sameAs`; the reviews slider renders real Google reviews; no invented ratings.

---

### T-46 · Confirm the site's advertised scope of care matches licensure
**Priority:** P1 — **compliance** · **Source:** facility master data (source 8) · **Files:** `lib/data.ts:12-49`, `app/treatment/dual-diagnosis/page.tsx`, `content/pages.raw.json`

**Problem:** The master record lists **LOC = "Detox & Res"** and marks **SUD ✔ but leaves MH blank**. The site markets more than that:

- `lib/data.ts` presents **four** offerings as "Levels of Care" — Medical Detox, Residential Inpatient, **Dual Diagnosis**, Aftercare & Alumni — where the master record recognises two.
- `/treatment/dual-diagnosis` is a full programme page: *"integrated care that addresses substance use disorders and co-occurring mental health conditions such as anxiety, depression…"*
- Body copy states LVD *"can provide you with the appropriate mental health treatment."*
- At least 8 blog posts target mental-health queries, including `/blog/mental-health-treatment-laguna-beach-ca`.

**I am not asserting the site is non-compliant** — treating co-occurring conditions within a DHCS-licensed SUD programme is normal and the MH column may simply mean LVD is not a licensed standalone mental-health facility. But the gap between "SUD only" in the master record and a dedicated dual-diagnosis programme page is exactly the kind of thing a regulator, payer, or LegitScript reviewer examines. The portfolio sheet already carries one LegitScript compliance row (V0070) against another facility, so this is a live category of risk here.

**Fix:**
1. Confirm with compliance what LVD is licensed and accredited to treat, and whether the DHCS licence covers co-occurring MH care.
2. Align the site's language to that answer. If dual diagnosis is delivered *within* detox and residential rather than being a distinct level of care, present it as a clinical approach rather than a fourth "Level of Care".
3. Review the MH-targeted blog posts for anything implying standalone mental-health admission.

**Acceptance:** Written confirmation of licensed scope on file; every scope-of-care claim on the site traceable to it.

---

### T-38 · No dedicated `/faq` page
**Priority:** P1 · **Source:** sheet **V0099** verification (`CONFIRMED_AMENDED`) · **Files:** new route, `content/pages.raw.json`

**Problem:** V0099's verification lists LVD among the 7 sites with **no FAQ page under any tested slug**. Notable because the content already exists — 10 pages carry 3–7 FAQs each (see T-10). The material is written; there is simply no hub.

**Fix:** Build `/faq` aggregating the existing `page.faqs` arrays grouped by topic, each linking to its source page. Emit `FAQPage` schema (shared with T-10). Adopts the portfolio standard V0099 proposes at zero content cost.

**Acceptance:** `/faq` live, aggregates all 10 pages' questions, validates as `FAQPage`, linked from nav or footer.

---

# P2 — Medium

### T-13 · Two pages use "Laguna View Detox" as their `<h1>`
**Priority:** P2 · **Source:** code audit — **independently corroborated** by sheet **V0063** verification notes · **Files:** `content/pages.raw.json` → `luxury-addiction-treatment`, `alcohol-detox-and-treatment-programs`

**Problem:** Both render `<h1>Laguna View Detox</h1>`. No keyword value, poor screen-reader landmark. The sheet found the same thing independently, filed as a side-note on a different row:

> "Separate quality issue on the same page: `/luxury-addiction-treatment` has H1 'Laguna View Detox', which is the brand name rather than a descriptive heading. Worth fixing whichever way the consolidation goes." — V0063, batch B12

Two independent audits landing on this raises confidence. Note the sheet caught only one of the two pages; `alcohol-detox-and-treatment-programs` has the same defect.

**Fix:** rewrite both to describe the page. **Acceptance:** every `<h1>` is page-specific.

---

### T-14 · Competing luxury pages
**Priority:** P2 · **Source:** sheet **V0063** (`CONFIRMED_AMENDED`) + code audit · **Files:** `lib/site.ts:52`, `components/Footer.tsx:43`

**Problem:** `/luxury-rehab` (1,277 words here; sheet measured 1,508 on the deploy) is in the header nav; `/luxury-addiction-treatment` (504 / 692) is in the footer. Near-identical title targeting → genuine cannibalisation.

**Do not 301.** The sheet's original fix was retracted on verification: measured overlap is 6.5% 8-gram / 17.8% word-level — ~82% different text. A redirect would delete a distinct live page with its own canonical.

**Fix:** Differentiate the two `<title>` tags so they target distinct queries, and make header and footer point to the same primary page. **Acceptance:** distinct title targeting; one consistent primary link.

---

### T-15 · Lead capture confined to two pages
**Priority:** P2 · **Source:** code audit · **Files:** `components/LeadForm.tsx`, `components/ContentPage.tsx`, `components/Header.tsx`

**Problem:** `LeadForm` appears only on `/contact` and `/insurance`. No inline form on program, detox, location, or who-we-treat pages, and no mobile sticky call bar — on a site where the phone is the primary CTA.

**Fix:** Add a compact form variant to the `ContentPage` sidebar. Add a mobile sticky call/verify bar. **Acceptance:** form reachable without navigation from every program and location page.

---

### T-16 · Add a Table of Contents component (30 rows)
**Priority:** P2 · **Source:** sheet rows 1093, 1108 + 28 others · **Files:** new `components/TableOfContents.tsx`, `components/ContentPage.tsx`

**Problem:** 30 rows — the single most-repeated request — ask for a TOC on long content pages. None exists.

**Fix:** Build one component that derives anchors from `page.sections[].heading` and render it in `ContentPage` above `Prose` on pages with ≥ 4 sections. This resolves all 30 rows at once. Add `scroll-mt` so anchors clear the sticky header. **Acceptance:** TOC on all 30 listed pages; anchors land correctly.

---

### T-17 · "At a Glance" block is mis-populated (20 rows)
**Priority:** P2 · **Source:** sheet rows 1098, 1107 + 18 others · **Files:** `components/ContentPage.tsx:136-139, 158-167`

**Problem:** 20 rows flag this block. Sheet verdicts split two ways — row 1107 says *"Remove section, randomly populated and not used in any section"*, row 1098 says *"At a Glance bullets in the wrong section — add the section to What Exactly is Detox"*.

Root cause is visible in the code: `ContentPage.tsx:136` filters `page.bullets` by `b.length <= 95 && !b.includes(":")` and shows the block whenever ≥ 3 survive. That is a heuristic, not editorial intent — which is exactly why the output looks random.

**Fix:** Replace the heuristic with an explicit, per-page curated `atAGlance` array in `pages.raw.json`. Omit the block where the sheet says remove. **Acceptance:** block appears only where curated; all 20 rows resolved.

---

### T-18 · Hero subtitle duplicated as body copy (21 rows)
**Priority:** P2 · **Source:** sheet rows 1147, 1155 + 19 others · **Files:** `components/PageHero.tsx:69-71`, `components/ContentPage.tsx`

**Problem:** 21 rows say "remove the paragraph under the title". The same text renders as both `heroSubtitle` and the first body paragraph. Per-row intent differs: some say delete, others (1147) say promote it into a new named intro section.

**Fix:** Follow each row's specific instruction — see Appendix A. **Acceptance:** no page repeats its hero subtitle in the body.

---

### T-19 · Create named intro sections (16 rows)
**Priority:** P2 · **Source:** sheet rows 1156, 1164 + 14 others · **Files:** `content/pages.raw.json`

**Problem:** 16 rows ask for a new first section with a specific `<h2>` — e.g. 1156 "Heroin Addiction Treatment", 1164 "Cocaine Addiction Treatment", 1101 "Luxury Dual Diagnosis Program in Orange County" — populated from paragraphs currently missing (overlaps T-12).

**Fix:** For each of the 16 pages, add a new first entry to `sections[]` in `content/pages.raw.json` using the exact heading named in its Appendix A row, populated from the paragraphs restored in T-12. Do T-12 first — the source text for most of these is the content the scraper dropped.

**Acceptance:** all 16 pages open with the named section.

---

### T-20 · Add program-link widgets to body sections (29 rows)
**Priority:** P2 · **Source:** 29 rows · **Files:** new shared component, `components/ContentPage.tsx`

**Problem:** 29 rows repeat: *"Add the different programs as widgets in this section with a link back to the referred page (Detoxification, Residential Inpatient, Aftercare & Alumni)."* This is one reusable component, not 29 edits — and it directly improves the internal linking weakness behind T-01/T-09.

**Fix:** Build a `<ProgramCards>` component reading `programs` from `lib/data.ts`; allow a page to declare where it renders. **Acceptance:** widget on all 29 listed sections; links resolve 200.

---

### T-21 · Add Google Reviews slider (8 rows)
**Priority:** P2 · **Source:** sheet rows 1097, 1103, 1135, 1244, 1277, 1286 + 2 · **Files:** new component

**Problem:** 8 rows request a "They Trusted Us With Their Recovery" Google-reviews slide. Absent from this repo. The 6 testimonials in `lib/data.ts:159-190` are unattributed on-site quotes, not verified Google reviews.

✅ **Unblocked by T-45** — the facility master record supplies the GMB profile (`g.page/r/CUMi-UYjQ10wEAI`), which is the real review source this task was missing.

**Fix:** Build a `<Reviews>` component fed by real Google review data from the GMB profile added in T-45 (`site.social.google`). Render it on the 8 pages named in the Appendix A rows above, headed "They Trusted Us With Their Recovery". Keep the existing `testimonials` block separate and labelled as on-site testimonials, or retire it once real reviews are in.

⚠️ Do not present on-site testimonials as Google reviews. Either embed genuine Google review data or label the existing block accurately. **Acceptance:** reviews shown are real and correctly sourced.

---

# P3 — Low / polish

| ID | Task | Source | Files |
|---|---|---|---|
| **T-22** | Fix broken Yelp footer logo | row 1089 | `components/Footer.tsx:53`, `components/icons.tsx` |
| **T-23** | Link the DHCS licence text to the state licence record ([URL in row 1090](https://geohub-cadhcs.hub.arcgis.com/)) | row 1090 | `components/Footer.tsx:170-173` |
| **T-24** | Create an Editorial Policy page, link beside Privacy in the footer | row 1088 | new route + `Footer.tsx:181-188` |
| **T-25** | Contact map shows no bird's-eye view | row 1136 | `app/contact/page.tsx:31-33` |
| **T-26** | Copyright year freezes at build time (`new Date().getFullYear()` runs during prerender) | code audit | `components/Footer.tsx:180`, `app/privacy-policy/page.tsx` |
| **T-27** | Add rate limiting to the lead endpoint — honeypot only today | code audit | `app/api/lead/route.ts` |
| **T-28** | Install ESLint — no binary, no config, `npm run lint` is a no-op | code audit | `package.json` |
| **T-29** | `robots.txt` does not disallow `/api/` | code audit | `app/robots.ts` |
| **T-30** | "Connecticare" (page title) vs "ConnectiCare" (nav) casing | code audit | `content/pages.raw.json`, `lib/site.ts:150` |
| **T-31** | Collapsed FAQ answers stay in the a11y tree while `aria-expanded="false"` | code audit | `components/Faq.tsx:41-49` |
| **T-32** | Team cards: whole widget should be clickable. **Confirmed real, not drift** — rows 1318–1319 name Christi Llamas and Lamont Damon, both verified as current LVD staff in the bios doc. Do after T-42 | rows 1318–1319 | `app/about/page.tsx:134-160` |
| **T-33** | Paragraph spacing "bulks up" content site-wide | row 1087 | `app/globals.css:74-79` |
| **T-34** | Consider making `/privacy-policy` indexable — currently `noindex` | code audit | `app/privacy-policy/page.tsx:9` |

---

# Portfolio-wide — owned outside this repo

These are `ALL SITES` rows from the sheet that touch LVD. Coordinate with QHG; do not fix unilaterally.

| Row | Priority | Issue | LVD impact |
|---|---|---|---|
| **V0102** | `CRITICAL` | Trailing-slash mismatch across all 1,046 preview URLs. Previews serve slashless at 200; all 12 production sites are slash-canonical and 301 the slashless form. | **Root cause of V0067's canonical-target redirects.** Of 46 LVD structural pages, 43 canonicals point at URLs that 301 and 1 at a 404 — only 1 resolves cleanly. Fix at cutover or every canonical lands on a redirect. |
| **V0124** | `CRITICAL` | Builds generated from a ~15–16 July 2026 snapshot; production kept publishing. 15 pages portfolio-wide exist on production but not in builds. | Freeze publishing or add a re-sync step. Re-run the diff for LVD immediately before cutover. See T-00. |
| **V0116** | `HIGH` | Preview-vs-production slug changes needing cutover redirects. | **LVD production 301s `/about` → `/about-us/`.** This repo serves `/about`. Decide which survives and add to the redirect map. |
| **V0096** | — | `verify-insurance` slug standard. | LVD uses `/insurance`; proposed standard is `/verify-insurance`. Rename + redirect if adopted. |
| **V0097** | — | `/about` slug standard. | LVD preview is already on `/about` and is cited as the reference build — but production diverges (see V0116). |
| **V0065** | — | Karen Pettit's bio is published on both LVD and the Quadrant parent domain (55.5% similarity). | ⚠️ **Re-scope before actioning.** The row assumes she is current staff and proposes canonicalising the parent copy to the facility copy. **Karen Pettit is absent from the current QHG staff roster** (source 7) — if she has departed, the correct action is to remove *both* copies, not canonicalise one. Resolve via T-42 first. |
| **V0100** | `COMPLIANCE` | Privacy-policy standard portfolio-wide. | LVD is compliant; listed only as a noindex exclusion, not a defect. |
| **V0095** | — | Aftercare slug standard. | LVD `/treatment/aftercare` is the **reference build**. No change. |
| **V0094** | — | Treatment hub slug standard: `/treatment` (8 sites), `/treatment-services` (Dallas), `/programs` (Des Moines), `/what-we-offer` (Marina Harbor). | LVD is already on `/treatment` — the proposed standard. **No change.** Listed for completeness. |
| **V0098** | — | Contact slug standard: `/contact` (8 sites), `/contact-us` (Dallas, Fort Worth), `/contact-location` (Marina Harbor), absent on Greater Texas. | LVD is already on `/contact` — the standard. Production 301s only to add the trailing slash, not to a different slug. **No change.** |
| **V0048** | `BLOCKED` | **Marina Harbor's homepage uses LVD's phone number.** Verification enumerated all 9 `tel:` links on the Marina Harbor preview: 7 use their own 866-525-3026; one CTA uses **866-932-3206**. Portfolio scan confirms only LVD and Marina Harbor carry that number, and LVD uses it exclusively. | **Leads intended for Marina Harbor are ringing LVD's line.** Corrupts LVD's call attribution — fix before T-04 analytics, or the baseline is already polluted. Sheet caution: confirm with admissions it is not a deliberate shared/overflow line before anyone deletes it. |
| **V0091** | — | The QHG parent's `/locations` page has **no outbound links to any facility website** — social links only. | **LVD receives zero link equity from its parent domain.** Paired with visual row **1074**: the parent's `/locations/laguna-view-detox` page "needs a button link to the website" next to its call and verify-insurance buttons. Cheapest authority win available; requires only a parent-side change. |
| **V0128** | `HIGH` | QHG parent cutover redirect map, 16 URL pairs — includes `/locations/laguna` → `/locations/laguna-view-detox`. | LVD's parent-site entry is being renamed. Without the redirect, whatever equity V0091 adds is lost at cutover. Sequence: V0128 then V0091. |

---

# Closed — no action

| Row | Verdict | Why |
|---|---|---|
| **V0068** | `BY_DESIGN` | `/privacy-policy` absent from `sitemap.xml`. Correct — it is `noindex`, so excluding it is right. The row was framed as a defect and would have sent someone to add a noindex page to the sitemap. Verified closed in the sheet. |
| **V0065** (bio hub) | no action | Verification notes: *"Unlike Dallas and Hillside, Laguna bios are NOT orphaned — `/about` links this bio directly and the nav has an `/about#team` anchor. So no hub needs building here."* The facility side is already correct; the duplicate-bio action is **parent-side only**. |
| **Broken Internal Links tab** | n/a | Zero rows for LVD. Independently confirmed: a full crawl of 77 routes found **no broken internal links**. |

---

# Suggested execution order

**Cutover track** (T-35, T-36, T-40, T-41 + V0102) is the critical path. It needs a QHG decision, it is date-driven, and nothing else on the list matters if the site launches with 182 unmapped URLs. Start it first and run everything else alongside.

1. **T-00** — reconcile the baseline. Everything in Appendix A depends on it, and T-37/T-39/T-40 are all symptoms of the same snapshot gap.
2. **T-41 → T-35 → T-36 → T-40** — the cutover set, in that order. One redirect config, not four passes: the trailing-slash convention (T-35) and the 182 pairs (T-41) must ship together or you get chains.
3. **V0048** (portfolio) — get LVD's phone number off Marina Harbor's site *before* T-04, or the call-attribution baseline is polluted from day one.
4. **T-39** — three stale slugs; ~10 minutes, and "crystal-math" is embarrassing on a treatment site.
5. **T-02, T-03, T-05** — one afternoon, all small, all high-impact.
6. **T-04** — analytics, so the rest of the work is measurable.
7. **T-01 + T-37** — blog crawlability and the stray root-level post together; both touch blog routing and both feed T-41's map.
8. **T-06, T-08** — performance and SERP presentation.
9. **T-42 → T-43 → T-11 → T-32** — the staff chain, in that order. Bios are already written, so this is mostly data entry once HR confirms the roster. Raise the HR question on day one; it gates four tasks.
9b. **T-45 → T-21** — GMB profile then the reviews slider; closes 8 sheet rows and adds the only third-party social proof on the site.
9c. **T-47** — brand photography. Do the hero + `DEFAULT_OG_IMAGE` swap early (six usages, one value each, biggest visual change for the least work); sequence the bulk re-export **after T-06** so masters aren't shipped at 10–25 MB.
10. **T-12** — content restoration; fix the extractor first.
11. **T-16, T-17, T-20** — three components that close 79 sheet rows between them.
12. **T-38** — `/faq` hub; nearly free once T-10 schema exists.
13. Remainder by priority. Chase **V0091 + V0128** with QHG in parallel — a parent-side change that costs this team nothing.

**Two questions to send today, because they block the most work:**
1. **QHG / platform:** trailing-slash convention and whether production's root-level slugs or the build's nested ones survive cutover (gates T-35, T-36, T-41).
2. **HR:** have Karen Pettit, David Goodgame and Nicole Burson departed, which of the 11 current staff should be public, and what is Kris Brace's status (gates T-42, T-43, T-11, T-32, V0065).
3. **Compliance / leadership:** what is LVD licensed to treat, and does "Est. 2020" supersede the site's "Since 2015" or describe the QHG acquisition (gates T-44, T-46).
4. **Marketing / brand:** the library has no people or city photography — do `/who-we-treat` (7 pages) and `/locations` (3 pages) switch to facility imagery, get a commissioned shoot, or keep licensed stock as a signed-off exception (gates T-47).

---

# Appendix A — Visual issues, all 233 rows by page

Sheet tab `Visual Issues`, IDs 1087–1319, 44 pages. Themes are consolidated into T-16 through T-21; page-specific instructions are below verbatim.

**Recurring themes and their owning task:**

| Theme | Rows | Task |
|---|---|---|
| Missing content from original site | 46 | T-12 |
| Table of Contents tool | 30 | T-16 |
| Program-link widgets | 29 | T-20 |
| "Remove paragraph under the title" | 21 | T-18 |
| "At a Glance" mis-populated | 20 | T-17 |
| Written By / Medically Reviewed / Last Updated | 17 | T-11 |
| Named intro section | 16 | T-19 |
| AI-slop bullets not rendering as lists | 10 | T-12 |
| Google Reviews slider | 8 | T-21 |
| Insurance tool reuse | 6 | T-07 |
| CTA additions | 4 | per-page |
| LVD video embed | 3 | per-page |

#### `/` — 4 items

| Row | Issue | Fix |
|---|---|---|
| 1087 | All Sub pages have a paragraph formatting issue where it bulks up the content | Fix the way the pages present the content with spaces between paragrahs to make it easier to read. |
| 1088 | Needs an Editorial Policy Page | Create Editorial Policy and append to the footer next to privacy page |
| 1089 | Footer Yelp logo is broken | Fix the logo structure for Yelp |
| 1090 | Footer DHCS License missing link | provide the following link to the DHCS page: https://geohub-cadhcs.hub.arcgis.com/datasets/63459617d2604decab840bd2ca047ee2_11/explore?filters=eyJMZWdhbF9FbnRpdHlfTmFtZSI6WyJMQUdVTkEgVklFVyBDRU5URVIsIExMQyJdfQ%3D%3D&location=36.665989%2C-119.372965%2C7&showTable=true |

#### `/treatment` — 2 items

| Row | Issue | Fix |
|---|---|---|
| 1091 | Finding Help at the best addiction treatment center in California. | Should be a header in the page content |
| 1092 | Content under Addiction Treatment Programs in Laguna Beach Title | Should be the first section of content, remove from below the title and create its own dedicated section |

#### `/treatment/detoxification` — 7 items

| Row | Issue | Fix |
|---|---|---|
| 1093 | Needs table of contents tool | Add tool |
| 1094 | Specialized Detox Tracks We Offer In Laguna Beach | Section needs to contain widgets for each Detox type linking back to the referred page |
| 1095 | Missing content for program types | Add "A Full Continuum of Specialized Care in Laguna Beach, CA" with the different programs as widgets with a link back to the referred page. (Detoxification, Residential Inpatient, Dual Diagnosis + Aftercare & Alumni) |
| 1096 | What Exactly is Detox? | Partial content from the original site. Upload the rest of the section from the main site |
| 1097 | Missing Google Review slide "They Trusted Us With Their Recovery" | Add the trust index google reviews slide above "Take Back Your Life Today" |
| 1098 | At a Glance bullets in the wrong section | Add the section to What Exactly is Detox |
| 1099 | Missing Medically Reviewed, Written By, and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Last Updated: May 2026 |

#### `/treatment/dual-diagnosis` — 9 items

| Row | Issue | Fix |
|---|---|---|
| 1100 | Missing Medically Reviewed, Written By, Written On and Last Updated | Kris Brace, CADC II Written on: January 5, 2026 Medically-Reviewed By: Riky Hanaumi, LCSW Last Updated: April 2026 |
| 1101 | Content under Dual Diagnosis Treatment in Laguna Beach, CA Title | Should be the first section of content, remove from below the title and create its own dedicated section with the header "Luxury Dual Diagnosis Program in Orange County". The currrent content is missing the second paragraph on the original page. |
| 1102 | Conditions We Treat Through Dual Diagnosis Care | Missing the Substance Abuse Disorders & Mental Health Disorders bullet points. Also missing the last sentence in this section "By treating both addiction and mental health..." |
| 1103 | Missing Google Review slide "They Trusted Us With Their Recovery" | Add the trust index google reviews slide above "How Dual Diagnosis Fits Into the Treatment Process" |
| 1104 | How Dual Diagnosis Fits Into the Treatment Process | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1105 | What to Expect During Dual Diagnosis Treatment in Laguna Beach, CA | Add the following missing content to this section first "Dual diagnosis treatment is structured to support both physical stabilization and mental health care from the beginning. While each treatment plan is personalized, there are common elements you can expect throughout the process:" |
| 1106 | What to Expect During Dual Diagnosis Treatment in Laguna Beach, CA | Create a widget for each treatment plan referenced in the section |
| 1107 | At a Glance | Remove section, randomly populated and not used in any section |
| 1108 | Missing Table of Content tool | Add tool |

#### `/treatment/aftercare` — 8 items

| Row | Issue | Fix |
|---|---|---|
| 1109 | Missing Table of Content tool | Add tool |
| 1110 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Written On: February 17, 2020 Last Review: Feb 2026 |
| 1111 | Content under Aftercare & Alumni Title | Should be the first section of content, remove from below the title and create its own dedicated section with the header "Aftercare Planning". |
| 1112 | Planning for Long-term Success in Recovery — Aftercare Planning | Change title to "What is Aftercare Planning?" |
| 1113 | Missing Google Review slide "They Trusted Us With Their Recovery" | Add the trust index google reviews slide |
| 1114 | Missing Google Review slide "Aftercare: Support That Keeps You on Track After Treatment" | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Dual Diagnosis) |
| 1115 | Missing last section "Find Long-Term Recovery Today" and its content | Add whole section |
| 1116 | Missing Resources | Add whole section |

#### `/treatment/addiction-therapies` — 6 items

| Row | Issue | Fix |
|---|---|---|
| 1117 | Missing Table of Content tool | Add tool |
| 1118 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Written On: January 18, 2024 |
| 1119 | Content under Addiction Therapy Services Title | Should be the first section of content, remove from below the title and create its own dedicated section with the header "Customizing treatment to your needs". |
| 1120 | Why is therapy needed? — Understanding Addiction | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1121 | At a Glance | Remove section |
| 1122 | Missing Resources | Add whole section |

#### `/luxury-rehab` — 8 items

| Row | Issue | Fix |
|---|---|---|
| 1123 | Luxury drug & alcohol treatment | Capitalize the first letters of each word |
| 1124 | Missing Table of Content tool | Add tool |
| 1125 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Written On: June 22, 2021 |
| 1126 | The Difference Between Luxury Drug Rehab Centers and Non-Luxury | Remove picture to help with the long section |
| 1127 | The Difference Between Luxury Drug Rehab Centers and Non-Luxury | Remove from the bottom of the section: "Laguna View Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Orange County facility. The evidence-based approach at Laguna View Detox's luxury residential inpatient program offers world-class methods that work. We offer thorough aftercare planning & alumni programming to keep clients connected to the recovery community." |
| 1128 | The Difference Between Luxury Drug Rehab Centers and Non-Luxury | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1129 | The Difference Between Luxury Drug Rehab Centers and Non-Luxury | Have AI clean the size of this section while keeping the message |
| 1130 | Discover Our Luxury Drug Treatment Center | Remove "We work with most PPO and POS insurance carriers, like Aetna, Cigna, and BlueCross BlueShield, to help cover the cost of rehabilitation. We also offer private payment methods to get you the treatment you need. If luxury drug rehabilitation can help you or your loved one, contact us today." from section |

#### `/tour` — 3 items

| Row | Issue | Fix |
|---|---|---|
| 1131 | Content under Step inside our oceanview estate Title | remove from below the title |
| 1132 | Real Treatment in a Luxury Setting | Repalce header with "Explore Laguna View Detox" |
| 1133 | Real Treatment in a Luxury Setting | Include Laguna View Video under the first paragraph in the center |

#### `/admissions` — 2 items

| Row | Issue | Fix |
|---|---|---|
| 1134 | Content under Admissions Title | remove from below the title |
| 1135 | Missing Google Reviews | Add Google review slide show |

#### `/contact` — 1 item

| Row | Issue | Fix |
|---|---|---|
| 1136 | Google Map Bug | Map is not showing the location bird eye view |

#### `/blog` — 2 items

| Row | Issue | Fix |
|---|---|---|
| 1137 | CPTX test blog is not populating next to the other facilities | Fix placement of new blogs next to old ones |
| 1138 | Blog categories | New CPTX Blogs need to populate using categories like the old ones shown on the page |

#### `/drug-addiction-treatment` — 4 items

| Row | Issue | Fix |
|---|---|---|
| 1139 | Why Choose Us? | Below this section, add the missing boxes appearing on the original site |
| 1140 | Start Your Journey Today | Add the CTA "Your journey to recovery begins today." near the footer |
| 1141 | Client Stories of Hope & Recovery | Clean up structure for this section to make it look less sloppy |
| 1142 | We Work With Most Insurance | Add the section, "Your treatment may be fully covered." from the Admissions Page |

#### `/alcohol-detox-and-treatment-programs` — 2 items

| Row | Issue | Fix |
|---|---|---|
| 1143 | Why Choose Us | In this section, add the missing boxes appearing on the original site |
| 1144 | Start Your Journey to Sobriety Today | Add the section, "Your treatment may be fully covered." from the Admissions Page |

#### `/treatment/detoxification/alcohol` — 8 items

| Row | Issue | Fix |
|---|---|---|
| 1145 | Missing Table of Content tool | Add tool |
| 1146 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Last Updated: Feb 2026 |
| 1147 | Remove the paragraph under the title | Create a new section as the introduction using that content, with the new header being, "Alcohol Addiction Treatment in Orange County" |
| 1148 | What is Alcohol? | Add to the end of the paragraph, "As a holistic treatment facility, our staff will modify your treatment program to ensure that you receive the support you need for a healthy recovery. Call (866) 932-3206 to learn more about Laguna View Detox’s treatment options today!" |
| 1149 | What is Alcohol? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1150 | What Are the Signs of Alcohol Use? | Missing Common signs and symptoms bullets in the section from the original page |
| 1151 | How Does Alcohol Affect the Body? | Missing short-term and long-term bullets |
| 1152 | How Does Alcohol Affect the Body? | After adding the missing bullets, include the following paragraph: "Struggling with an alcohol addiction can have a significant impact on your life. The ideal alcohol addiction treatment in Orange County is available at Laguna View Detox. As an inpatient treatment provider, we offer detoxification and inpatient rehab programming. To learn more about our luxurious alcohol rehab in Laguna Beach, call (866) 932-3206." |

#### `/treatment/detoxification/heroin` — 8 items

| Row | Issue | Fix |
|---|---|---|
| 1153 | Missing Table of Content tool | Add tool |
| 1154 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW January 18, 2024 |
| 1155 | Remove the paragraph under the title | remove content |
| 1156 | Create new section as the introduction named "Heroin Addiction Treatment" | Use the missing 3 paragraphs from the original page for this section |
| 1157 | What is Heroin? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1158 | What Are the Signs of Heroin Use? | fix the sloppy ai output to proerly display what shouldve been bullet points. |
| 1159 | What Are the Signs of Heroin Use? | Add the missing paragraph in the beginning of this section |
| 1160 | At a Glance | Remove |

#### `/treatment/detoxification/cocaine` — 12 items

| Row | Issue | Fix |
|---|---|---|
| 1161 | Missing Table of Content tool | Add tool |
| 1162 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW January 18, 2024 |
| 1163 | Remove the paragraph under the title | remove content |
| 1164 | Create new section as the introduction named "Cocaine Addiction Treatment" | Use the missing 4 paragraphs from the original page for this section |
| 1165 | What is Cocaine? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1166 | What Are the Signs of Cocaine Use? | fix the sloppy ai output to proerly display what shouldve been bullet points. |
| 1167 | What Are the Signs of Cocaine Use? | Add the missing paragraphs in the section |
| 1168 | How Does Cocaine Affect the Body? | fix the sloppy ai output to proerly display what shouldve been bullet points. |
| 1169 | How Does Cocaine Affect the Body? | Add the missing paragraphs in the section |
| 1170 | At a Glance | Remove |
| 1171 | How to Treat Cocaine Addiction | Add the missing paragraphs in the section |
| 1172 | Laguna View Detox is a Cocaine Detox Center in California | Add the missing paragraphs in the section |

#### `/treatment/detoxification/meth` — 7 items

| Row | Issue | Fix |
|---|---|---|
| 1173 | Missing Table of Content tool | Add tool |
| 1174 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW January 18, 2024 |
| 1175 | Remove the paragraph under the title | remove content |
| 1176 | Create new section as the introduction named "Meth Addiction Treatment" | Use the missing 3 paragraphs from the original page for this section |
| 1177 | What is Cocaine? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1178 | What Are the Signs of Meth Use? | display what shouldve been bullet points. |
| 1179 | At a Glance | Remove |

#### `/treatment/detoxification/benzodiazepines` — 9 items

| Row | Issue | Fix |
|---|---|---|
| 1180 | Missing Table of Content tool | Add tool |
| 1181 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW January 18, 2024 |
| 1182 | Remove the paragraph under the title | remove content |
| 1183 | Create new section as the introduction named "Benzo Rehab Center in California" | Use the missing 3 paragraphs from the original page for this section |
| 1184 | What Are Benzos? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1185 | Signs of Benzo Use | display what shouldve been bullet points. and add the last paragraph on the original page |
| 1186 | How Do Benzos Affect the Body? | add missing bullet points and missing content from original page |
| 1187 | Missing section from original page | Add section "Laguna View Detox is a Benzo Detox Center in Orange County" |
| 1188 | At a Glance | Remove |

#### `/who-we-treat/women` — 6 items

| Row | Issue | Fix |
|---|---|---|
| 1189 | Missing Table of Content tool | Add tool |
| 1190 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW November 1, 2022 |
| 1191 | Remove the paragraph under the title | remove content |
| 1192 | fix the sentence section as the introduction named "Substance Abuse Rates in Women" | Use the missing paragraphs from the original page for this section |
| 1193 | How Does Addiction Affect Women Differently? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1194 | At a Glance | Remove |

#### `/who-we-treat/men` — 7 items

| Row | Issue | Fix |
|---|---|---|
| 1195 | Missing Table of Content tool | Add tool |
| 1196 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW September 29, 2022 |
| 1197 | Remove the paragraph under the title | remove content |
| 1198 | Create new section as the introduction named "Introduction to Men and Addiction" | Use the paragraphs from the original page for this section |
| 1199 | Men's Addiction Statistics | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1200 | How Does Substance Abuse Impact Men Differently? | fix the ai output to proerly display what shouldve been bullet points and missing content from the section |
| 1201 | What Are the Benefits of a Men's Rehab Program? | fix the sloppy ai output to proerly display what shouldve been bullet points and content from the section |

#### `/who-we-treat/professionals` — 8 items

| Row | Issue | Fix |
|---|---|---|
| 1202 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW September 29, 2022 |
| 1203 | Remove the paragraph under the title | remove content |
| 1204 | Professionals and Addiction | remove content |
| 1205 | Create new section as the introduction named "Addiction Statistics Among Professionals and Drug Abuse in the Workplace" | Include all the missing paragraphs from the original page for this section |
| 1206 | Missing Table of Content tool | Add tool |
| 1207 | Can You Work While in Rehab? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1208 | What Are the Benefits of a Rehab Program for Professionals? | fix the ai output to properly display what shouldve been bullet points |
| 1209 | At a Glance | Remove |

#### `/who-we-treat/young-adults` — 7 items

| Row | Issue | Fix |
|---|---|---|
| 1210 | Addiction Statistics for Young Adults | Missing bullet points from original page section |
| 1211 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW November 1, 2022 |
| 1212 | Missing Table of Content tool | Add tool |
| 1213 | Why Do Young Adults Abuse Drugs? | Add the final paragraph |
| 1214 | Why Do Young Adults Abuse Drugs? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1215 | What Are the Barriers to Substance Abuse Treatment for Young Adults? | Add the final paragraph |
| 1216 | At a Glance | Remove |

#### `/who-we-treat/college-students` — 7 items

| Row | Issue | Fix |
|---|---|---|
| 1217 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW December 8, 2022 |
| 1218 | Remove the paragraph under the title | remove content |
| 1219 | Create new section as the introduction named "Rehab for College Students" | Include all the missing paragraphs from the original page for this section |
| 1220 | Substance Abuse Statistics in College | Add the final paragraph |
| 1221 | Substance Abuse Statistics in College | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1222 | Why is Substance Common Among College Students? | Add the final paragraph |
| 1223 | Missing Table of Content tool | Add tool |

#### `/who-we-treat/veterans` — 9 items

| Row | Issue | Fix |
|---|---|---|
| 1224 | Missing Table of Content tool | Add tool |
| 1225 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW July 1, 2023 |
| 1226 | Remove the paragraph under the title | remove content |
| 1227 | Create new section as the introduction named "Addiction Treatment for Veterans" | Include all the missing paragraphs from the original page for this section |
| 1228 | Substance Abuse Statistics for Veterans | Add the final 2 paragraphs |
| 1229 | Substance Abuse Statistics for Veterans | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1230 | Why is Substance Common Among Veterans? | Add the final paragraph |
| 1231 | What Does a Veteran Rehab Program Entail? | Add the final paragraph |
| 1232 | Missing section "Laguna View Detox Offers Addiction Treatment Services for Veterans in Laguna Beach" | Add section and missing content for the section |

#### `/who-we-treat/first-responders` — 5 items

| Row | Issue | Fix |
|---|---|---|
| 1233 | Missing Table of Content tool | Add tool |
| 1234 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW December 28, 2022 |
| 1235 | Remove the paragraph under the title | remove content |
| 1236 | Create new section as the introduction named "Addiction under First Responders" | Include all the missing paragraphs from the original page for this section |
| 1237 | First Responders Addiction Statistics | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |

#### `/locations/orange-county` — 11 items

| Row | Issue | Fix |
|---|---|---|
| 1238 | Laguna View Orange County Rehab: At-a-Glance | fix the ai output to properly display what shouldve been bullet points |
| 1239 | Missing Table of Content tool | Add tool |
| 1240 | We Work With Most Insurances | Replace with the "Your treatment may be fully covered." section from the Admissions page |
| 1241 | Our Addiction Programs in Orange County, CA | Remove everything after, "Detoxification: 24/7 physician-led medical monitoring..." |
| 1242 | Our Addiction Programs in Orange County, CA | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1243 | Specialized Medical Detox Programs in Orange County | Fix the content produced by adding the different detox treatments as widgets with links to their respective pages |
| 1244 | Missing "They Trusted Us With Their Recovery" section | Add the google reviews slide |
| 1245 | Our Approach to Addiction Treatment in Orange County | fix the ai output to properly display what shouldve been bullet points and add the missing paragraph from this section |
| 1246 | Getting Here: Directions From Anywhere in Orange County | Include the missing bullet points that give driving directions |
| 1247 | Ready to Start Your Recovery in Orange County? | Add a proper CTA to the bottom of the section |
| 1248 | Free Community Recovery Resources in Orange County | Resource sources are not properly displayed or linked |

#### `/locations/newport-beach` — 2 items

| Row | Issue | Fix |
|---|---|---|
| 1249 | Missing Table of Content tool | Add tool |
| 1250 | Benefits of Going to a Newport Beach Drug Rehab Center | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |

#### `/locations/los-angeles` — 5 items

| Row | Issue | Fix |
|---|---|---|
| 1251 | Missing Table of Content tool | Add tool |
| 1252 | Remove the paragraph under the title | remove content |
| 1253 | What Should You Look For in a Luxury Rehab in Los Angeles? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1254 | Get Help at Our Luxury Alcohol & Drug Rehab in LA | Add a CTA under the section |
| 1255 | At a Glance | Remove |

#### `/locations/san-diego` — 5 items

| Row | Issue | Fix |
|---|---|---|
| 1256 | Remove the Luxury Addiction Treatment under the title | Remove |
| 1257 | Missing Table of Content tool | Add tool |
| 1258 | What Levels of Care Are Offered by Laguna View Detox Near San Diego? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1259 | Insurance Coverage | Add insurance tool with the different icons located in the admissions page "Your treatment may be fully covered." |
| 1260 | At a Glance | Remove |

#### `/locations/ventura` — 4 items

| Row | Issue | Fix |
|---|---|---|
| 1261 | Remove the Luxury Drug Rehab in Ventura under the title | Remove |
| 1262 | Missing Table of Content tool | Add tool |
| 1263 | What Levels of Care Are Offered by Laguna View Detox Near Ventura? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1264 | At a Glance | Remove |

#### `/locations/california` — 4 items

| Row | Issue | Fix |
|---|---|---|
| 1265 | Remove the Luxury Addiction Treatment in California under the title | Remove |
| 1266 | Missing Table of Content tool | Add tool |
| 1267 | What to Look For in a Drug Rehab in Southern California | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1268 | At a Glance | Remove |

#### `/insurance/anthem` — 5 items

| Row | Issue | Fix |
|---|---|---|
| 1269 | Remove the paragraph under the title | remove content |
| 1270 | Create new section as the introduction named "Rehabs That Take Anthem" | Include all the missing paragraphs from the original page for this section |
| 1271 | What is Anthem Insurance? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1272 | Missing Table of Content tool | Add tool |
| 1273 | At a Glance | Remove |

#### `/insurance/aetna` — 8 items

| Row | Issue | Fix |
|---|---|---|
| 1274 | Get Instant Help Right Now | Add insurance tool with the different icons located in the admissions page "Your treatment may be fully covered." |
| 1275 | A New Experience in Addiction Treatment | Rename to Escape Addiction for Good |
| 1276 | The LVD Difference | Create a widget for each service described in the paragraph |
| 1277 | Add missing section "#LVD Testimonials & Reviews" | Add google review slide show |
| 1278 | We Make Getting Help Easy | Remove "Our Admissions Process Contact Us 24/7" from the section |
| 1279 | At a Glance | Remove |
| 1280 | Ready to Experience Recovery? | Replace with the CTA also named "Ready to Experience Recovery?" |
| 1281 | You Can Change Your Life Today | Add laguna view detox video |

#### `/insurance/bcbs` — 6 items

| Row | Issue | Fix |
|---|---|---|
| 1282 | A New Experience in Addiction Treatment | Rename to Escape Addiction for Good |
| 1283 | The LVD Difference | Create a widget for each service described in the paragraph |
| 1284 | You Can Change Your Life Today | Add laguna view detox video |
| 1285 | Verify Your BCBS Benefits | Add insurance tool with the different icons located in the admissions page "Your treatment may be fully covered." |
| 1286 | Testimonials | Add google review slide show |
| 1287 | At a Glance | Remove |

#### `/insurance/cigna` — 4 items

| Row | Issue | Fix |
|---|---|---|
| 1288 | Remove the paragraph under the title | remove content |
| 1289 | Create new section as the introduction named "Cigna Insurance Coverage" | Include all the missing paragraphs from the original page for this section |
| 1290 | Missing Table of Content tool | Add tool |
| 1291 | What is Cigna Insurance? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |

#### `/insurance/connecticare` — 4 items

| Row | Issue | Fix |
|---|---|---|
| 1292 | Remove the paragraph under the title | remove content |
| 1293 | Create new section as the introduction named "Connecticare Insurance" | Include all the missing paragraphs from the original page for this section |
| 1294 | Missing Table of Content tool | Add tool |
| 1295 | What is Connecticare? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |

#### `/insurance/multiplan` — 4 items

| Row | Issue | Fix |
|---|---|---|
| 1296 | Remove the paragraph under the title | remove content |
| 1297 | Create new section as the introduction named "Multiplan Insurance" | Include all the missing paragraphs from the original page for this section |
| 1298 | Missing Table of Content tool | Add tool |
| 1299 | How Multiplan Can Help | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |

#### `/insurance/nyship` — 6 items

| Row | Issue | Fix |
|---|---|---|
| 1300 | Remove the paragraph under the title | remove content |
| 1301 | Create new section as the introduction named "NYSHIP Rehab Center" | Include all the missing paragraphs from the original page for this section |
| 1302 | Missing Table of Content tool | Add tool |
| 1303 | What is the NYSHIP? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1304 | What Types of Treatment are Covered by NYSHIP? | Missing bullet points from original page section |
| 1305 | At a Glance | Remove |

#### `/insurance/oxford-pilgrim` — 5 items

| Row | Issue | Fix |
|---|---|---|
| 1306 | Remove the paragraph under the title | remove content |
| 1307 | Create new section as the introduction named "Oxford Pilgrim Insurance Coverage" | Include all the missing paragraphs from the original page for this section |
| 1308 | Missing Table of Content tool | Add tool |
| 1309 | At a Glance | Remove |
| 1310 | What is Oxford Pilgrim? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |

#### `/insurance/tufts` — 4 items

| Row | Issue | Fix |
|---|---|---|
| 1311 | Introduction to Tufts | Rename to Introduction to Tufts Insurance Coverage |
| 1312 | Missing Table of Content tool | Add tool |
| 1313 | At a Glance | Remove |
| 1314 | Does Tufts Cover Drug and Alcohol Rehab? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |

#### `/about/karen-pettit` — 1 item

| Row | Issue | Fix |
|---|---|---|
| 1315 | Remove the paragraph under the staff name | remove content (Duplicated already presented in the About section) |

#### `/about/david-goodgame` — 1 item

| Row | Issue | Fix |
|---|---|---|
| 1316 | Remove the paragraph under the staff name | remove content and add what was removed to the "David's Story" section |

#### `/about/nicole-burson` — 1 item

| Row | Issue | Fix |
|---|---|---|
| 1317 | Remove the paragraph under the staff name | remove content (Duplicated already presented in the About section) |

#### `/about#team` — 2 items

| Row | Issue | Fix |
|---|---|---|
| 1318 | Christi Llamas, SUDRC - Unable to click and access staff page through the widget | Link the staff page to the whole widget |
| 1319 | Lamont Damon, AMFT - Unable to click and access staff page through the widget | Link the staff page to the whole widget |
