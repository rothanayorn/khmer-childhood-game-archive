// Khmer display content for entries, applied in the UI ONLY when the site
// language is Khmer. The database is never written to or altered — this is a
// read-side translation layer.
//
// The `entries` table stores Khmer for entry NAMES only; the other fields
// (tagline, description, players, materials, steps) exist in English only.
// Until proper Khmer text for those fields is available for an entry, its
// stored (English) content is shown under Khmer labels. Add Khmer here (or in
// database columns) and those entries will display in Khmer automatically:
//
//   "my-slug": {
//     tagline: "Khmer tagline",
//     description: "Khmer description",
//     players: "Khmer players",
//     materials: "Khmer materials",
//     steps: ["Khmer step 1", "Khmer step 2"],
//   },
export const KHMER_ENTRY_CONTENT = {
  // Example once translations are available:
  // "chol-chhoung": {
  //   tagline: "...",
  //   description: "...",
  //   players: "អ្នកលេង 8–20 អ្នក ចែកជា២ឧក្រុម",
  //   materials: "...",
  //   steps: ["...", "...", "..."],
  // },
};

// Returns a copy of `game` with Khmer content applied when the active
// language is Khmer. Priority: Khmer columns from the database (migration 006)
// → the in-app overlay → the stored (usually English) values.
export function localizeEntry(game, lang) {
  if (lang !== "km" || !game) return game;
  const k = KHMER_ENTRY_CONTENT[game.slug];
  const pick = (fromDb, fromMap, fallback) => {
    if (fromDb) return fromDb;
    return (fromMap || "") !== "" ? fromMap : fallback;
  };
  return {
    ...game,
    tagline: pick(game.km && game.km.tagline, k && k.tagline, game.tagline),
    description: pick(game.km && game.km.description, k && k.description, game.description),
    players: pick(game.km && game.km.players, k && k.players, game.players),
    materials: pick(game.km && game.km.materials, k && k.materials, game.materials),
    steps:
      (game.km && game.km.steps) || (k && k.steps) || game.steps,
    contributor: pick(
      game.km && game.km.contributor,
      k && k.contributor,
      game.contributor
    ),
    place: pick(game.km && game.km.place, k && k.place, game.place),
  };
}