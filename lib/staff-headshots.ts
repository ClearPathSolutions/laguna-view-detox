/**
 * Locally-processed headshots, keyed by normalised name.
 *
 * The Quadrant portal is authoritative for WHO appears on a facility page, but
 * it currently returns `photoUrl: null` for everyone, so portal-managed staff
 * fell back to an initial-letter tile even though their headshots were sitting
 * processed in public/images/team/. This bridges the two: portal supplies the
 * person, this supplies the picture.
 *
 * Source images come from the QHG headshot library, processed to 900x1200 (3:4,
 * matching the card) JPEG under 500 KB — see public/images/team/README.md.
 *
 * A portal `photoUrl` still wins when one is present; this is only a fallback.
 * Names absent here degrade to the initial tile, which is a designed state.
 */
export const STAFF_HEADSHOTS: Record<string, string> = {
  // Laguna View Detox site staff (currently returned by the portal)
  "christi llamas": "/images/team/team-christi-llamas.jpg",
  "lamont damon": "/images/team/team-lamont-damon.jpg",

  // QHG California leadership + Southern California — staged and ready for
  // whenever the portal starts listing them for this facility.
  "shawn young": "/images/team/team-shawn-young.jpg",
  "michael mcarthur": "/images/team/team-michael-mcarthur.jpg",
  "riky hanaumi": "/images/team/team-riky-hanaumi.jpg",
  "monica olivares": "/images/team/team-monica-olivares.jpg",
  "jacob cameron": "/images/team/team-jacob-cameron.jpg",
  "justin white": "/images/team/team-justin-white.jpg",
  "jeremiah ross": "/images/team/team-jeremiah-ross.jpg",
  "alanna mcmurtrey": "/images/team/team-alanna-mcmurtrey.jpg",
  "pamela tambini": "/images/team/team-pamela-tambini.jpg",
  "bj thome": "/images/team/team-bj-thome.jpg",
};

/** Must match nameKey() in lib/staff-feed.ts so lookups line up. */
export function headshotFor(nameKey: string): string | undefined {
  return STAFF_HEADSHOTS[nameKey];
}
