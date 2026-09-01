// Bilingual (Khmer + English) search over game entries.
//
// Pure functions, no dependencies, client-safe. Keeps the matching logic
// separate from the UI so it is easy to test and reuse.

// Fields on each entry that participate in search.
const SEARCHABLE_FIELDS = [
  "nameKhmer",
  "nameEnglish",
  "tagline",
  "description",
  "materials",
  "contributor",
  "place",
];

// Zero-width characters that commonly sneak into typed Khmer text
// (ZWSP U+200B, ZWNJ U+200C, BOM/ZWNBSP U+FEFF) and would otherwise break
// substring matching. Built from char codes to keep this file pure ASCII —
// invisible literals in a character class are too easy to mangle.
const ZERO_WIDTH_RE = new RegExp(
  "[" + String.fromCharCode(0x200b, 0x200c, 0xfeff) + "]",
  "g"
);

/**
 * Normalize text for matching:
 * - Unicode NFC, so the same Khmer word typed with different codepoint
 *   orderings still compares equal.
 * - Strip zero-width characters (see ZERO_WIDTH_RE).
 * - Lowercase (English; harmless for Khmer, which has no case).
 * - Collapse all whitespace to single spaces and trim.
 */
export function normalize(text) {
  return String(text ?? "")
    .normalize("NFC")
    .replace(ZERO_WIDTH_RE, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Pre-joined, normalized haystack for one entry.
function searchableText(game) {
  return normalize(
    SEARCHABLE_FIELDS.map((field) => game[field])
      .filter(Boolean)
      .join(" ")
  );
}

/**
 * Filter games by a free-text query.
 *
 * The query is split into whitespace-separated tokens and every token must
 * appear somewhere in the entry's combined searchable text (AND semantics).
 * That single rule handles Khmer (ចោលឈូង), English ("tug"), materials
 * ("scarf", "rope"), contributor names ("sophea"), places ("prey veng")
 * and mixed queries ("ទាញព្រ័ត្រ tug").
 *
 * An empty/whitespace-only query returns all games.
 */
export function filterGames(games, query) {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return games;

  return games.filter((game) => {
    const haystack = searchableText(game);
    return tokens.every((token) => haystack.includes(token));
  });
}
