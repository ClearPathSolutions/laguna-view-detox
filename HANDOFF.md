# Laguna View Detox — Implementation Handoff

Paste everything below the line into a new chat.

---

You are picking up implementation work on the **Laguna View Detox** website.

**Repo:** `/Users/benjamincastro/Laguna View Detox` (Next.js 14 App Router + TypeScript + Tailwind, branch `main`)
**Production:** https://lagunaviewdetox.com · **Preview build:** https://laguna-view-detox.vercel.app

## Your spec

`issues.md` in the repo root is the authoritative task list — **48 tasks (T-00 … T-47)** plus a 233-row appendix of per-page content fixes. Read it in full before touching anything. It was produced by auditing:

1. A clean production build + crawl of all 77 internally-reachable routes
2. A 12-facility QHG tracker sheet (5 tabs — build issues, visual issues, verification log)
3. The QHG staff bios master doc
4. A facility master data record (NAP, levels of care, established year, GMB)
5. Live probes against production
6. The brand asset and headshot libraries

Every task carries **Priority · Source · Files · Problem · Fix · Acceptance**. Work to the Acceptance line — that is the definition of done.

## External assets (outside the repo)

| Path | Contains |
|---|---|
| `~/Downloads/Laguna View Detox/` | 95 brand photos, 3 logos, 2 brand videos (1.7 GB) — see **T-47** |
| `~/Downloads/Staff Headshots/` | Portfolio headshots; 12 LVD-relevant images mapped in **T-42** |

## Hard rules — these are traps that were verified and retracted during the audit

Violating any of these does real damage. They are not stylistic preferences.

1. **Do NOT 301 `/luxury-addiction-treatment` or `/drug-addiction-treatment` as "duplicates."** The tracker sheet originally said to. Verification measured 6.5–26.7% overlap — they are distinct live pages. The redirect would delete real content. See T-14, T-09.
2. **Do NOT copy Laguna `/about` as a "canonical example."** Five other facilities' rows cite it as the model; 43 of 46 LVD canonicals point at redirects. It is the worst-configured build in the portfolio for this. See T-35.
3. **Do NOT publish a "Medically Reviewed By" byline for anyone unconfirmed.** `Riky Hanaumi, LCSW` is verified real. `Kris Brace, CADC II` is **not in the staff roster** — that byline stays unpublished until HR confirms. Fabricated medical credentials are the one item here with genuine regulatory exposure. See T-43, T-11.
4. **Do NOT invent `aggregateRating` / `review` schema.** Use only real Google review data from the GMB profile. Never compute a rating from the six unattributed on-site testimonials. See T-45, T-21.
5. **Do NOT commit the brand videos** (277 MB + 383 MB) or raw photo masters (10–25 MB each). `next.config.mjs` sets `unoptimized: true`, so anything in `public/images/` ships at full size to every visitor. Process first. See T-47, T-06.
6. **Do NOT delete the three current bio pages outright.** They are live indexed URLs — they must 301, and belong in the T-41 redirect map. See T-42.
7. **Ship the trailing-slash fix and the 182-pair redirect map as ONE config.** Doing them as two passes produces redirect chains. See T-35 + T-41.

## Blocked — do not guess, and do not silently skip

These need human answers. Surface them early, proceed with everything else, and report clearly at the end which remain open.

1. **QHG / platform:** trailing-slash convention, and whether production's root-level slugs (`/anthem/`) or the build's nested ones (`/insurance/anthem`) survive cutover. *Gates T-35, T-36, T-41.*
2. **HR:** have Karen Pettit, David Goodgame and Nicole Burson departed? Which of the 11 current staff go public? What is Kris Brace's status? *Gates T-42, T-43, T-11, T-32.*
3. **Compliance / leadership:** what is LVD licensed to treat (master record shows SUD only, no MH), and does "Est. 2020" supersede the site's "Since 2015" or describe the QHG acquisition? *Gates T-44, T-46.*
4. **Marketing / brand:** the photo library has **no people and no city imagery**. Do `/who-we-treat` (7 pages) and `/locations` (3 pages) switch to facility photography, get a commissioned shoot, or keep licensed stock as a signed-off exception? *Gates part of T-47.*
5. **T-00 is a blocking prerequisite for all content work.** The repo and the audited deployed build differ (staff roster, blog post counts 157 vs 158, missing components). Resolve which is authoritative before starting the 233-row appendix.

## Suggested order

The **cutover track is the critical path** — it is date-driven and needs an external decision, so open it first and run everything else alongside.

1. **T-00** — reconcile the baseline
2. **T-41 → T-35 → T-36 → T-40** — cutover set, one redirect config
3. **T-39** — three stale blog slugs (`why-is-crystal-math-addictive` → `…meth…`; ~10 min)
4. **T-02, T-03, T-05** — `/blog` metadata, homepage title, mobile keyboard trap (all small, all high-impact)
5. **T-04** — analytics, so later work is measurable
6. **T-01 + T-37** — blog crawlability and the stray root-level post
7. **T-06 → T-47** — image optimisation, *then* the brand-photo migration
8. **T-08** — meta descriptions
9. **T-42 → T-43 → T-11 → T-32** — staff chain (bios and headshots already exist; mostly data entry once HR answers)
10. **T-45 → T-21** — GMB profile, then the reviews slider
11. **T-12** — content restoration; **fix the extractor before hand-patching 46 rows**
12. **T-16, T-17, T-20** — three components that close 79 appendix rows between them
13. **T-38**, then the P3 list

## Verification protocol

Do not mark a task done on inspection alone. Prove it. These commands were used to produce the audit and should reproduce cleanly.

```bash
# Build must stay clean — 210 static pages, exit 0
cd "/Users/benjamincastro/Laguna View Detox" && rm -rf .next && npx next build

# Serve on a PORT YOU VERIFIED IS FREE — many stale servers run on this machine.
# Confirm you are hitting THIS site before trusting any result:
curl -s "http://localhost:$PORT/" | grep -o "<title>[^<]*</title>"

# Canonicals (T-02, T-35) — must be self-referential AND resolve 200 on production
curl -s "http://localhost:$PORT/blog" | grep -o 'rel="canonical" href="[^"]*"'
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "https://lagunaviewdetox.com/insurance"

# Blog crawlability (T-01) — must reach all 157 posts from /
curl -s "http://localhost:$PORT/blog" | grep -o 'href="/blog/[^"]*"' | sort -u | wc -l

# Mobile keyboard trap (T-05) — must be 0 focusable elements in the closed drawer
# (Playwright: query 'div[aria-hidden="true"].fixed.inset-0' for a[href],button)

# Image weight (T-06, T-47) — nothing in public/images over 500 KB
find public/images -type f -size +500k | head
```

**A stale dev server on a busy port produced a completely wrong audit once in this project.** Always verify the served `<title>` and that `.next/BUILD_ID` matches the running server before drawing conclusions.

## How to work

- Prefer fixing root causes over symptoms. Three examples already identified: T-12's 46 missing-content rows are one broken scraper; T-17's "randomly populated" At-a-Glance is a length heuristic in `ContentPage.tsx:136`; T-20's 29 widget requests are one reusable component.
- Commit in logical groups with clear messages. Do not push unless asked.
- This is a **YMYL healthcare site**. Accuracy of clinical claims, staff credentials, licensure and reviews outranks everything else on the list.
- When a sheet row and the code disagree, verify against the live site before believing either — roughly two-thirds of the tracker's originally-verified rows needed correction.

## Report at the end

- Tasks completed, with the evidence that satisfies each Acceptance line
- Tasks blocked, and the exact question needed to unblock each
- Anything you found that is not in `issues.md`
