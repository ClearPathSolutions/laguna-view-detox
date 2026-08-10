# Staged staff headshots — NOT YET PUBLISHED

Processed from `~/Downloads/Staff Headshots/` per issues.md **T-42**. These are
the 11 current QHG staff who cover Laguna View Detox, plus Dr. Pamela Tambini
(medical review, T-43).

Nothing in this folder is referenced by the site yet. Publishing them means
rebuilding `team` in `lib/data.ts`, porting bios into `content/pages.raw.json`,
and 301-ing the three departing bio pages via `lib/redirects.mjs` — all of which
is **blocked on HR** confirming:

1. Have Karen Pettit, David Goodgame and Nicole Burson departed?
2. Which of the 11 should be public on the facility site?
3. Is "Olivares" (bios doc) or "Olivires" (source filename) correct? The file
   here uses the bios-doc spelling.

Do not publish a name here until that is confirmed — the site currently
advertises three people who are absent from the roster, and replacing them with
an unconfirmed list would repeat the same error in the other direction.

## Processing applied

Uniform 900x1200 (3:4, matching the `aspect-[3/4]` card in `app/about/page.tsx`),
JPEG q80. 17 MB of PNG/WebP masters -> 1.9 MB.

Seven sources were square (1254x1254). A 1:1 image in a 3:4 frame loses ~25% of
its width to `object-cover`, so each was cropped to 3:4 up front, centred
horizontally. Every source was either already 3:4 or wider, so no vertical
cropping was needed and no foreheads were clipped. Spot-checked visually.

Known source inconsistency: `team-elizabeth-wald.jpg` is a full-torso studio
shot where the others are head-and-shoulders, so the grid will not look uniform
until it is re-cropped or re-shot. That is an editorial call, not a processing
fault.

| File | Person | Role |
|---|---|---|
| team-shawn-young.jpg | Shawn Young | Executive Director, QHG California |
| team-michael-mcarthur.jpg | Michael McArthur | Nursing Director |
| team-riky-hanaumi.jpg | Riky Hanaumi, LCSW | Clinical Director |
| team-monica-olivares.jpg | Monica Olivares | Clinical Supervisor |
| team-jacob-cameron.jpg | Jacob Cameron | Client Care Director |
| team-justin-white.jpg | Justin White | Program Director |
| team-elizabeth-wald.jpg | Elizabeth Wald | Program Director |
| team-jeremiah-ross.jpg | Jeremiah Ross | Nursing Supervisor |
| team-alanna-mcmurtrey.jpg | Alanna McMurtrey | Lead Case Manager |
| team-lamont-damon.jpg | Lamont Damon, AMFT | Therapist — LVD site |
| team-christi-llamas.jpg | Christi Llamas, SUDRC | Case Manager — LVD site |
| team-pamela-tambini.jpg | Dr. Pamela Tambini | Medical Oversight (T-43 reviewer) |
