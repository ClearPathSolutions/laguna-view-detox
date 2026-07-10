# Laguna View Detox — Website

A modern, mobile-first rebuild of [lagunaviewdetox.com](https://lagunaviewdetox.com) built with
**Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**, optimized for deployment on
**Vercel**.

## Tech stack

- **Next.js 14** App Router, fully static (SSG) — every page prerenders to HTML
- **TypeScript** throughout
- **Tailwind CSS** design system (navy `#0e3e5a` + gold `#ba9b59` + sand neutrals)
- **next/font** — Cormorant Garamond (display serif) + Inter (body)
- **next/image** — automatic AVIF/WebP optimization for all downloaded photography

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build & deploy

```bash
npm run build        # production build (static)
npm start            # serve the production build
```

**Deploy to Vercel:** push this folder to a Git repo and import it at
[vercel.com/new](https://vercel.com/new). Vercel auto-detects Next.js — no config needed. Or run
`npx vercel` from this directory.

## Project structure

```
app/                     # routes (App Router)
  page.tsx               # homepage
  about/                 # about + team bios (/about/[member])
  treatment/             # programs hub, detox, residential, dual-diagnosis, etc.
    detoxification/[drug]/  # alcohol, heroin, cocaine, meth, benzodiazepines
  who-we-treat/[slug]/   # women, men, professionals, veterans, ...
  locations/[slug]/      # orange-county, newport-beach, los-angeles, ...
  insurance/             # verify hub + insurance/[carrier]
  tour/ admissions/ contact/ luxury-rehab/ blog/ privacy-policy/
  sitemap.ts robots.ts
components/               # Header, Footer, Hero, ContentPage, LeadForm, Gallery, ...
content/                  # pages.raw.json + blog.json (real copy scraped from the live site)
lib/                      # site config, nav, data (programs/locations/insurance/team), content loader
public/images/            # all facility & program photography (downloaded from the live site)
public/logos/             # logos, favicon, accreditation badges, insurance graphic
```

## Editing content

- **Copy** for most interior pages lives in [`content/pages.raw.json`](content/pages.raw.json)
  (headline, subtitle, sections, FAQs) and is rendered by
  [`components/ContentPage.tsx`](components/ContentPage.tsx).
- **Blog** — all 157 articles live in [`content/blog.json`](content/blog.json) (title, author,
  date, category, excerpt, image, full body). [`lib/blog.ts`](lib/blog.ts) sorts them newest-first
  and derives the category filter; the index ([`components/BlogArchive.tsx`](components/BlogArchive.tsx))
  filters by category and paginates with "Load More". Featured images are in `public/images/blog/`.
- **Navigation, phone, address, social links** are in [`lib/site.ts`](lib/site.ts).
- **Program / location / insurance / team lists and their images** are in
  [`lib/data.ts`](lib/data.ts) — swap any `image:` path to change a photo.

## Lead form → set `LEAD_WEBHOOK_URL`

[`components/LeadForm.tsx`](components/LeadForm.tsx) (used on **/contact** and **/insurance**) now
submits to the [`POST /api/lead`](app/api/lead/route.ts) route handler, which validates the input,
drops honeypot/bot submissions, records a timestamped consent string (TCPA), and always logs the
lead server-side so an inquiry is never silently lost.

**Before going live**, set the `LEAD_WEBHOOK_URL` environment variable (Vercel → Project →
Settings → Environment Variables) to a CRM / inbox webhook so leads reach your admissions team in
real time. Point it at a HIPAA-appropriate destination under a signed BAA. Until it is set, leads
are captured in the server logs only. The form shows a real error (and directs users to call) if
delivery to the configured webhook fails — it never shows a false "we'll contact you" confirmation.

## Notes

- All imagery, logos, and copy were sourced from the existing lagunaviewdetox.com. Review before
  going live. The "Who We Treat" tile photos in `lib/data.ts` were reviewed for fit (the Men and
  Veterans tiles were swapped to more appropriate images); adjust any `image:` path to taste.
- Security headers (CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) are set in [`next.config.mjs`](next.config.mjs). The CSP allows the Google
  Maps iframe and inline framework scripts; widen `frame-src` / `img-src` if you add embeds.
- Every page emits a self-referential canonical and per-page OpenGraph via
  [`lib/seo.ts`](lib/seo.ts) → `pageMeta()`. Use it for any new route so canonicals stay correct.
- The contact page embeds a keyless Google Maps iframe for the facility address.
- Accreditation: Joint Commission + California DHCS (License #300024AP) are shown in the footer.
