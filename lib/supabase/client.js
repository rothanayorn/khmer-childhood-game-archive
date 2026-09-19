// Browser-side Supabase client, @supabase/ssr pattern.
//
// Import this from Client Components ("use client") for auth actions and
// data reads that run in the browser. It never touches request cookies: the
// browser sends the session cookie the server client set, and this client
// attaches it to every call automatically.
//
// Both variables are NEXT_PUBLIC_* because the browser needs them at runtime.
// A publishable key is safe to ship to the client by design (that is what
// makes it publishable), but no actual value belongs in this file.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}