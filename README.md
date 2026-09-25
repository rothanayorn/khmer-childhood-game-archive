# Khmer Childhood Games

A living archive of Khmer childhood games, collected from the people who grew up
playing them — grandparents, cousins, and neighbours across Cambodia. Every entry
is bilingual (Khmer + English) and includes who contributed it and where. Built
with Next.js (App Router) and Supabase for the ICT 340 Living Archive project.

## What's in here

<<<<<<< HEAD
- **Browse & search** — a searchable grid of game cards, served from the
  Supabase `entries` table. Search works in Khmer
=======
- **Browse & search** — a searchable grid of game cards. Search works in Khmer
>>>>>>> 9d4225370ff1318cc4e2d8f6752dc399dc3c2240
  and English (`ចោលឈូង`, `tug`, a contributor name, a place) with proper
  Unicode normalisation, so typing variations still match. When a search comes up
  empty, the page suggests a few games as a fallback.
- **Game pages** — each entry has its own page with a photo, metadata (players,
<<<<<<< HEAD
  materials, contributor, place) and a step-by-step "How to play" guide, read
  live from the Supabase `entries` table at request time.
=======
  materials, contributor, place) and a step-by-step "How to play" guide. Generated
  statically at build time.
>>>>>>> 9d4225370ff1318cc4e2d8f6752dc399dc3c2240
- **Submit an entry** — a "Send" button on the home page opens the submission
  Google Form in a new tab.
- **Contributor accounts** — Supabase email/password auth:
  - `/signup` — create an account (with a plain "check your email" confirmation
    notice when email confirmation is enabled on the project).
  - `/login` — sign in. Failed logins always show only `Invalid email or password`
    — nothing more specific is ever leaked. A successful login redirects home.
  - The site header shows a signed-in user their email plus a **Log out** button;
    visitors see **Log in** and **Sign up** links instead.
  - The sign-up and log-in pages are centred on screen and styled like the rest
    of the site.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React — JavaScript only, no TypeScript
- Plain CSS modules per component/page (no CSS framework)
- [Supabase](https://supabase.com) — `@supabase/supabase-js` + `@supabase/ssr` for
  server and client session handling

Exact installed versions live in `package.json`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Environment variables

Auth configuration comes from environment variables only — no keys are ever
<<<<<<< HEAD
written into committed files. Create `.env` or `.env.local` (both git-ignored)
at the project root with your Supabase project's values:
=======
written into committed files. Create `.env.local` (git-ignored) at the project
root with your Supabase project's values:
>>>>>>> 9d4225370ff1318cc4e2d8f6752dc399dc3c2240

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The same two variables must be set in Vercel project settings for production.

### Scripts

| Command            | What it does                      |
| ------------------ | --------------------------------- |
| `npm run dev`      | Start the dev server              |
| `npm run build`    | Production build (lint included)  |
| `npm start`        | Serve the production build        |
| `npm run lint`     | Run ESLint                        |

<<<<<<< HEAD
## Project structure

```
app/
  page.js               Home page (hero, search, submit button)
  browse/page.js        Browse & search every entry
  games/[slug]/page.js  Per-game "how to play" page (reads Supabase)
  login/page.js         Sign-in page (centred form)
  signup/page.js        Create-account page (centred form)
  api/entries/route.js  GET /api/entries — the archive from Supabase
components/
  SiteHeader.js         Header + auth area (email / log out, or log in / sign up)
  AuthArea.js           Header auth widget (client component)
  GameSearch.js         Bilingual search + recommendations (client component)
  GameCard.js           One card in the browse grid
  LoginForm.js          Sign-in form (Supabase)
  SignupForm.js         Create-account form (Supabase)
data/
  games.js              Archive entries (kept as the seed source for Supabase)
lib/
  entries.js            Maps the Supabase entries table to the game shape
  search.js             Bilingual search + recommendation logic
  supabase/
    server.js           Server Supabase client (@supabase/ssr cookie pattern)
    client.js           Browser Supabase client
supabase/migrations/    001 table + RLS · 002 extra columns · 003 seed
public/images/          Game photos
```

## Database setup (Supabase `entries` table)

The archive's entries live in an `entries` table in Supabase. The site reads
them through the publishable key + row-level security (a `using (true)` policy:
everyone may read).

Create the schema with these three files, **in order**, in the Supabase SQL
editor (or via the Supabase CLI):

1. `supabase/migrations/001_entries_table.sql` — the table + RLS policies
2. `supabase/migrations/002_entries_columns.sql` — slug, Khmer name, tagline,
   description, place, and steps columns
3. `supabase/migrations/003_seed_entries.sql` — the 8 archive entries,
   migrated from `data/games.js`

> Before step 3, sign up on the site once so a user row exists in
> `auth.users`. The seed assigns `owner` to the oldest account; replace the
> `(select id from auth.users order by created_at limit 1)` subquery with your
> own UUID if you want a specific owner.

All three files are idempotent (upsert by `slug`, `if not exists` guards), so
re-running them is safe. `data/games.js` is kept as the migration source of
truth — edit it and re-run step 3 to re-seed.

Column map (database → app): `title→nameEnglish`, `name_khmer→nameKhmer`,
`photo_url→image`, `contributor_name→contributor`, `steps (text[])→steps`.
The conversion lives in `lib/entries.js`.

One slug was normalised during migration: `muek jumping game` (had a space)
became `muek-jumping-game`.
=======

Add the object to the `games` array, drop a photo into `public/images/`, and the
new entry appears in search, browse, and its own game page automatically.
>>>>>>> 9d4225370ff1318cc4e2d8f6752dc399dc3c2240

## How search works

`lib/search.js` is pure, dependency-free logic:

- Text is normalised (Unicode NFC, zero-width characters stripped, lowercased,
  whitespace collapsed) so Khmer words match regardless of typing quirks.
- Every whitespace-separated token in the query must appear somewhere in the
  entry's combined searchable text (name, description, materials, contributor,
  place).
- `pickRecommendations` rotates suggestion games deterministically per failed
  query, so the same search always surfaces the same alternatives.

## Supabase auth

- `lib/supabase/server.js` — server client built with `@supabase/ssr`'s
  `createServerClient`. The session rides in request cookies and is refreshed
  server-side; cookie writes from Server Components are safely caught.
- `lib/supabase/client.js` — browser client built with `createBrowserClient`
  (sessions stored in cookies, readable on the next request).
- The header's `AuthArea` is a small client component: it confirms the session
  cookie with `getUser()` and stays in sync via `onAuthStateChange`, so pages stay
  statically pre-rendered while auth state updates in the browser.
- If email confirmation is enabled on your Supabase project, a new sign-up shows a
  "check your email" message and the user confirms before signing in. With it
  disabled, sign-up signs the user in and redirects home like a login.

## Styling

- Shared palette, fonts, and layout tokens live in `app/globals.css` as CSS
  variables (`--color-indigo`, `--color-marigold`, `--color-laterite`, …), drawn
  from Cambodian material culture (indigo silk, saffron, laterite brick, rice-paper
  cream).
- Every page and component has its own plain CSS module. No inline-styling
  framework, no CSS-in-JS.
<<<<<<< HEAD
- The signature motif is the `kramaStripe` — a checkered-scarf divider band.
=======
- The signature motif is the `kramaStripe` — a checkered-scarf divider band.
>>>>>>> 9d4225370ff1318cc4e2d8f6752dc399dc3c2240
