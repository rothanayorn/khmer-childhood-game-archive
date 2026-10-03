// Pure validation helpers for the Create Entry form.
// No side effects, no Supabase calls — kept separate from the component so the
// rules are easy to read and test.

export const FIELD_LIMITS = {
  nameKhmer: 120,
  nameEnglish: 120,
  tagline: 200,
  description: 1500,
  players: 200,
  materials: 200,
  contributor: 100,
  place: 100,
  maxSteps: 20,
  maxStepLength: 500,
};

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

// Trim is the only normalisation every text field goes through: leading and
// trailing whitespace is stripped, "only spaces" becomes empty, Khmer text is
// never touched.
export function clean(text) {
  return String(text ?? "").trim();
}

// The How-to-play textarea holds one step per line. Empty/whitespace-only
// lines are dropped; order is preserved.
export function parseSteps(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map(clean)
    .filter(Boolean);
}

// Returns { error, cleaned }. `error` is "" when the values may be submitted;
// `cleaned` holds the trimmed values (plus the parsed steps) to write to the
// database. `photo` is the selected File, or null.
export function validateEntry(values, photo, { photoRequired = true } = {}) {
  const cleaned = {
    nameKhmer: clean(values.nameKhmer),
    nameEnglish: clean(values.nameEnglish),
    tagline: clean(values.tagline),
    description: clean(values.description),
    players: clean(values.players),
    materials: clean(values.materials),
    contributor: clean(values.contributor),
    place: clean(values.place),
  };

  const required = [
    ["Name in Khmer", cleaned.nameKhmer, FIELD_LIMITS.nameKhmer],
    ["Name in English", cleaned.nameEnglish, FIELD_LIMITS.nameEnglish],
    ["Description", cleaned.description, FIELD_LIMITS.description],
    ["Players", cleaned.players, FIELD_LIMITS.players],
    ["Materials", cleaned.materials, FIELD_LIMITS.materials],
    ["Contributor name", cleaned.contributor, FIELD_LIMITS.contributor],
    ["Place", cleaned.place, FIELD_LIMITS.place],
  ];

  for (const [label, value, max] of required) {
    if (!value) {
      return { error: `"${label}" is required.`, cleaned: null };
    }
    if (value.length > max) {
      return {
        error: `"${label}" is too long — ${max} characters or fewer, please.`,
        cleaned: null,
      };
    }
  }

  if (cleaned.tagline.length > FIELD_LIMITS.tagline) {
    return {
      error: `"Tagline" is too long — ${FIELD_LIMITS.tagline} characters or fewer, please.`,
      cleaned: null,
    };
  }

  const steps = parseSteps(values.stepsText);
  if (steps.length === 0) {
    return { error: "Add at least one step for How to play.", cleaned: null };
  }
  if (steps.length > FIELD_LIMITS.maxSteps) {
    return {
      error: `Please keep How to play to ${FIELD_LIMITS.maxSteps} steps or fewer.`,
      cleaned: null,
    };
  }
  if (steps.some((step) => step.length > FIELD_LIMITS.maxStepLength)) {
    return {
      error: `Each step must be under ${FIELD_LIMITS.maxStepLength} characters.`,
      cleaned: null,
    };
  }

  if (photoRequired && !photo) {
    return { error: "Choose one photo of the game.", cleaned: null };
  }
  if (photo && (!photo.type || !photo.type.startsWith("image/"))) {
    return {
      error: "The photo must be an image file — videos and other files are not accepted.",
      cleaned: null,
    };
  }
  if (photo && photo.size > MAX_PHOTO_BYTES) {
    return {
      error: "The photo is too large — 5 MB or smaller, please.",
      cleaned: null,
    };
  }

  return { error: "", cleaned: { ...cleaned, steps } };
}