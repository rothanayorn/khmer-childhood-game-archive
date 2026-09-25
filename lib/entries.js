// Maps the Supabase `entries` table to the game shape the UI already expects
// (the same fields data/games.js used to provide), so GameCard, search, and the
// game page keep working unchanged. Snake_case DB columns are converted to the
// camelCase property names the components read.
//
//   title            → nameEnglish   photo_url      → image
//   name_khmer       → nameKhmer     contributor_name → contributor
//   steps (text[])   → steps (array)  slug/place/etc. → same idea

export const ENTRY_COLUMNS =
  "slug, title, name_khmer, tagline, description, players, materials, " +
  "contributor_name, place, photo_url, steps";

export function toGame(row) {
  return {
    slug: row.slug,
    nameKhmer: row.name_khmer,
    nameEnglish: row.title,
    tagline: row.tagline,
    description: row.description,
    players: row.players,
    materials: row.materials,
    contributor: row.contributor_name,
    place: row.place,
    image: row.photo_url,
    steps: row.steps ?? [],
  };
}