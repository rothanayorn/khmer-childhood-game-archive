// Server-side Supabase client, @supabase/ssr pattern.
//
// Import this from Server Components, Server Actions, and Route Handlers.
// The user's session travels in request cookies, so this client reads them
// from `next/headers` and hands write access back to the same cookie store —
// the browser never sees the raw session token.
//
// Config comes from environment variables only, never from this file:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
// Set them in .env.local (git-ignored) and in Vercel project settings.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookieStore.setAll(cookiesToSet);
          } catch {
            // Next.js throws when a Server Component tries to set cookies
            // directly. Middleware, Server Actions, and Route Handlers are
            // allowed to, so this error only surfaces there — which is fine,
            // because those are exactly the places that refresh the session.
          }
        },
      },
    }
  );
}