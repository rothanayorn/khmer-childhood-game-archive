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

// --- UI → database -----------------------------------------------------------
// The reverse mapping: the Create Entry form's data → one insertable row.
// `id`, `created_at`, and `owner` are never form input — the database and the
// authenticated session handle those.

export function makeSlug(title) {
  return String(title ?? "")
    .toLowerCase()
    .normalize("NFKD") // decompose accents (é → e + combining mark)
    .replace(/[\u0300-\u036f]/g, "") // drop the combining marks entirely
    .replace(/[^a-z0-9]+/g, "-") // anything else becomes a dash
    .replace(/^-+|-+$/g, ""); // strip leading/trailing dashes
}

export function toEntryRow(entry) {
  return {
    title: entry.nameEnglish,
    name_khmer: entry.nameKhmer,
    tagline: entry.tagline || null,
    description: entry.description,
    steps: entry.steps,
    players: entry.players,
    materials: entry.materials,
    contributor_name: entry.contributor,
    place: entry.place,
    photo_url: entry.photoUrl,
    slug: entry.slug,
    owner: entry.owner,
  };
}

// --- Save-time helpers (shared by the Create and Edit forms) -----------------

// Escape the LIKE wildcards so values containing %, _ or \ are matched
// literally instead of acting as patterns.
export function escapeLike(text) {
  return String(text ?? "").replace(/[\\%_]/g, "\\$&");
}

// Case-insensitive duplicate check: another entry already uses the same
// English title or the same Khmer name. `excludeId` lets an editor ignore the
// very row they're editing. Returns the conflicting row, or null when the
// database can't be reached (the caller's insert/update then surfaces the real
// error instead).
export async function findDuplicateEntry(
  supabase,
  { title, nameKhmer, excludeId }
) {
  for (const [column, value] of [["title", title], ["name_khmer", nameKhmer]]) {
    const { data, error } = await supabase
      .from("entries")
      .select("id")
      .ilike(column, escapeLike(value))
      .limit(1);
    if (error) return null;
    const match = (data ?? []).find((row) => row.id !== excludeId);
    if (match) return match;
  }
  return null;
}

// The URL-friendly slug for a title, guaranteed unique against existing rows.
// The row being edited (excludeId), if any, does not count as a collision.
export async function pickUniqueSlug(supabase, base, excludeId) {
  const first = makeSlug(base) || "entry";
  let slug = first;
  for (let attempt = 2; attempt <= 50; attempt++) {
    const { data, error } = await supabase
      .from("entries")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data || data.id === excludeId) return slug;
    slug = `${first}-${attempt}`;
  }
  return `${first}-${Date.now() % 100000}`;
}

// If a photo_url points into the entry-images bucket, return the storage path
// so the old file can be removed when it is replaced; otherwise "".
export function storagePathFromUrl(url) {
  const marker = "/entry-images/";
  const text = String(url ?? "");
  const index = text.indexOf(marker);
  return index >= 0 ? text.slice(index + marker.length) : "";
}