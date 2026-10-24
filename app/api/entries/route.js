import { createClient } from "@/lib/supabase/server";
import { ENTRY_COLUMNS, ENTRY_COLUMNS_KM, toGame } from "@/lib/entries";

// GET /api/entries — every entry in the archive, shaped for the UI.
// Route handlers are dynamic, so this reads the live `entries` table (through
// RLS: everyone may read) at request time and keeps the static pages buildable
// without a database connection.
export async function GET() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return Response.json(
      { games: [], error: "Supabase is not configured." },
      { status: 502 }
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("entries")
      .select(ENTRY_COLUMNS_KM)
      .order("created_at", { ascending: false });

    // Migration 006 may not be applied yet, which keeps the Khmer columns
    // absent — retry with the base columns so nothing breaks.
    if (error) {
      const retry = await supabase
        .from("entries")
        .select(ENTRY_COLUMNS)
        .order("created_at", { ascending: false });
      return Response.json(
        retry.error
          ? { games: [], error: "Could not load entries." }
          : { games: (retry.data ?? []).map(toGame) }
      );
    }

    return Response.json({ games: (data ?? []).map(toGame) });
  } catch {
    // Unreachable Supabase (e.g. env vars not set yet) — tell the client
    // plainly instead of crashing the request.
    return Response.json(
      { games: [], error: "Supabase is not configured." },
      { status: 502 }
    );
  }
}