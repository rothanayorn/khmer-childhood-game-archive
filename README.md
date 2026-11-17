# Khmer Childhood Games

A living archive of Khmer childhood games — ល្បែងកុមារខ្មែរ — collected from people in Prey Veng and kept in Khmer first. Built for ICT 340 at AUPP.

## 1. What this is

This is a bilingual archive of the games Khmer children played before smartphones: ចោលឈូង, លាក់កន្សែង, បោះអង្គញ់, ទាញព្រ័ត្រ, and the rest of the set that follows. A stranger can browse every published game, search in Khmer or English, read who contributed it and where, and follow a step-by-step "how to play." A signed-in contributor can send in a new game; a reviewer can publish it or return it with a written reason. I built it this semester so those rules, names, and the people who still remember them are not lost with the playgrounds they were played on.

## 2. Who it's for

The people who played these games, and the younger Khmer who did not get the chance. That shaped the site in specific ways:

- **Khmer first.** The Khmer name is always the heading of a card and of a game page. English is the second line, not the title. The whole interface switches to Khmer (labels, buttons, statuses, review reasons). I did not treat Khmer as a translation afterthought.
- **Phones first.** Below 680 px the navigation collapses into a hamburger. Cards, the review queue, and My Entries restack at 480 px so they stay readable on a small screen.
- **Slow connections.** Next.js App Router, no CSS framework, no component library, one JSON call to load the archive. Photos are ordinary `jpg`/`png`/`webp` files, not autoplaying media.
- **Sources are named.** Every card and every detail page shows the contributor and the place. Nothing in the archive is anonymous unless that was the contributor's choice.

## 3. How it works

Next.js (App Router, JavaScript only) runs on Vercel. Supabase holds accounts, entries, review comments, reviewer status, and photos. No TypeScript, no CSS framework, no state library.

### System architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT  ·  browser                             │
│                 phone (hamburger < 680px)  or  laptop                   │
│                                                                         │
│   visitor (logged out)          contributor / reviewer (signed in)      │
│   • home / browse / search      • everything a visitor sees, plus:      │
│   • game detail (published)     • /submit   • /my-entries               │
│   • login / signup              • /review   (reviewer only)             │
│   • EN / ខ្មែរ switcher          • edit / delete own entries             │
└──────────────┬──────────────────────────────────────┬──────────────────┘
               │ HTTPS                                 │ HTTPS
               │ public pages + /api/entries           │ supabase-js
               ▼                                       ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        NEXT.JS 15  ·  VERCEL          │  │      SUPABASE JS  (client)   │
│        App Router · JavaScript only  │  │      publishable (anon) key  │
│                                       │  └──────────────┬───────────────┘
│  Server Components                    │                 │
│  ├── app/page.js          home       │  ┌──────────────▼───────────────┐
│  ├── app/browse/          archive    │  │  Auth      Storage   Postgres│
│  ├── app/games/[slug]/    one game   │  │  sign in   upload     RLS    │
│  ├── app/login /signup    accounts   │  └──────────────────────────────┘
│  ├── app/submit/          new entry  │
│  ├── app/my-entries/      own rows   │  Server-side Supabase
│  ├── app/review/          gated      │  lib/supabase/server.js
│  ├── app/auth/confirm/    email      │  (cookie session, next/headers)
│  ├── app/auth/update-password/       │
│  └── app/api/entries/     JSON       │  Client-side Supabase
│      └── published only              │  lib/supabase/client.js
│                                       │  (browser session, cookies)
│  Shared: SiteHeader · i18n · lib/     │
└──────────────────────┬────────────────┘
                       │ service role is NOT used
                       │ publishable key + user JWT
                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE  ·  Postgres 15                             │
│                                                                         │
│  ┌─────────────┐   ┌──────────────────────┐   ┌─────────────────────┐  │
│  │  AUTH       │   │  PUBLIC TABLES       │   │  STORAGE            │  │
│  │             │   │                      │   │                     │  │
│  │ auth.users  │   │  entries             │   │  bucket:            │  │
│  │  email      │◄──│   owner  uuid  FK    │   │  entry-images       │  │
│  │  password   │   │   status text        │   │  public read        │  │
│  │  metadata:  │   │   title / name_khmer │   │  owner-only write   │  │
│  │   username  │   │   *_km columns       │   │  image/*  ≤ 5 MB    │  │
│  └──────┬──────┘   │   photo_url ─────────┼──►│  entries/<uuid>.ext │  │
│         │          ├──────────────────────┤   └─────────────────────┘  │
│         │          │  review_comments     │                            │
│         │◄─────────│   entry_id  FK       │   ┌─────────────────────┐  │
│         │          ├──────────────────────┤   │  RPC  (sec definer) │  │
│         │          │  reviewers           │   │  is_reviewer()      │  │
│         │◄─────────│   user_id uuid       │   │  review_entry(      │  │
│         │  1 row = │   (dashboard insert  │   │    entry_id uuid,   │  │
│         │  reviewer│    only — no API)    │   │    decision text)   │  │
│         │          └──────────────────────┘   └─────────────────────┘  │
│                                                                         │
│  RLS on every table. Grants + policies in migrations 001/004/005/       │
│  008/009. status + the two functions were created in the SQL editor.    │
└────────────────────────────────────────────────────────────────────────┘
```

### Database relationships (ERD)

```
   auth.users                     entries                       review_comments
  ┌───────────┐    1         N  ┌──────────────────┐   1      N  ┌──────────────────┐
  │ id        │────────────────►│ owner            │────────────►│ entry_id         │
  │ email     │                 │ id  (uuid PK)    │             │ author_id        │
  │ metadata. │                 │ slug  UNIQUE     │             │ comment          │
  │  username │                 │ status           │             │ created_at       │
  └─────┬─────┘                 │ photo_url ───────┼──► storage  └──────────────────┘
        │                       │ name_khmer       │    bucket
        │ 1                     │ tagline / desc   │
        │                       │ players / mats   │       reviewers
        │                       │ place / steps[]  │      ┌──────────────────┐
        └───────────────────────│ contributor_name │      │ user_id          │
          owner / author        │ *_km translations│      │  = one reviewer  │
                                └──────────────────┘      └──────────────────┘
                                                          dashboard insert only
                                                          no API write path
```

### Tables

- `entries` — one row per game. Owner (`uuid` → `auth.users`), `title` (English name), `name_khmer`, `slug`, `photo_url`, `players`, `materials`, `contributor_name`, `place`, `steps text[]`, Khmer columns from migrations 006/007, and `status`.
- `review_comments` — `entry_id`, `author_id`, `comment`, `created_at`. The reason a reviewer returned an entry.
- `reviewers` — `user_id uuid` linking to one `auth.users` account. A row *is* reviewer status. Assignment is manual, in the Supabase dashboard; the app cannot write this table.
- `auth.users` — Supabase Auth. Email + password. Usernames live in `user_metadata`.
- Storage bucket `entry-images` — public read, owner-only write. 5 MB / image MIME types.

### The three statuses

```
                    submit form
                        │  (form never sends status;
                        │   DB default = 'pending')
                        ▼
                 ┌─────────────┐   owner edits
                 │   pending   │──────────────────────────┐
                 └──────┬──────┘   (goes back to pending,  │
                        │           unless is_reviewer())  │
       review_entry     │                                  │
       'published'      │     review_entry 'returned'      │
                        │     + comment in review_comments │
                        ▼                                  ▼
                 ┌─────────────┐                    ┌─────────────┐
                 │  published  │                    │  returned   │
                 │  (public)   │                    │ (owner sees │
                 └─────────────┘                    │  reason on  │
                        ▲                           │ /my-entries)│
                        │                           └──────┬──────┘
                        └──────────────────────────────────┘
                             owner edits → pending again
```

- `pending` — just submitted, or edited back into the queue. Not on the public site.
- `published` — live on home, browse, search, and the game page.
- `returned` — sent back with a reason. Owner sees it on My Entries and can edit and resubmit (which puts it back to `pending`).
- `delete_requested` is not a status — it is a flag (`delete_requested = true`) on top of the current status. The entry stays where it is until a reviewer approves the delete or keeps it.

### Request paths

| Who | Path | What happens |
|---|---|---|
| Visitor | `/` · `/browse` · `/games/[slug]` | Next.js server → `entries` (published) or `/api/entries` → client search filter |
| Visitor | `/api/entries` | Server Supabase client, `.eq("status", "published")`, newest first |
| New user | `/signup` → email link → `/auth/confirm` → `/login` | `auth.users`, PKCE, username in `user_metadata` |
| Contributor | `/submit` | Auth-gated → upload to `entry-images` → insert `entries` (`pending`) → "being reviewed" |
| Contributor | `/my-entries` | Own rows only (`owner = auth.uid()`); Edit; **Request delete** (flag, not a delete) |
| Reviewer | `/review` | `is_reviewer()` gate → pending queue (`review_entry`) + delete requests (approve = real DELETE, keep = flag off) + Edit / Delete now |
| Stranger console | direct table / RPC | RLS + grants + `review_entry` internal reviewer check decide — not the UI |

### Policies that actually shipped (migrations 001, 004, 005, 008, 009, 010)

| Object | Action | Who |
|---|---|---|
| `entries` | SELECT | **Anyone** (`using (true)`, migration 001). The site hides non-published rows with `.eq("status", "published")` in `/api/entries`, `MyEntries`, and `ReviewQueue` — the database itself does not yet enforce it. |
| `entries` | INSERT | Owner only (`auth.uid() = owner`) |
| `entries` | UPDATE | Owner only, and the owner cannot be reassigned (005: `using` + `with check`). Reviewers may also update any entry (010). |
| `entries` | DELETE | **Reviewer only** (`is_reviewer()`, migration 010). Owners request deletion; they cannot delete the row themselves (001 owner-delete policy is dropped in 010). |
| `review_comments` | INSERT | Any authenticated user, `author_id = auth.uid()` (008). The app only sends these from the review queue. |
| `review_comments` | SELECT | Comment author or entry owner |
| `reviewers` | SELECT | Own row only (`user_id = auth.uid()`) |
| `reviewers` | INSERT / UPDATE / DELETE | **Nobody** through the API. No policy + RLS = deny. Assignment is dashboard-only. |
| `reviewers` | — | `FORCE ROW LEVEL SECURITY`; anon has an explicit deny-all policy |
| `storage.objects` (`entry-images`) | SELECT | Public |
| `storage.objects` (`entry-images`) | INSERT / UPDATE / DELETE | Owner of the object, authenticated |

### SQL that was run in the Supabase SQL editor and is not in a numbered migration

These have to exist or the reviewer flow does not work. They were created by hand, which is why they are written down here:

```sql
-- status is not in migrations 001–009
alter table entries add column if not exists status text not null default 'pending';

-- reviewers table already exists in the live project (user_id uuid → one account)

create or replace function is_reviewer()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from reviewers where user_id = auth.uid()
  );
$$;

create or replace function review_entry(entry_id uuid, decision text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_reviewer() then
    return false;
  end if;
  if decision not in ('published', 'returned') then
    return false;
  end if;
  update entries
  set status = decision
  where id = entry_id and status = 'pending';
  return found;
end;
$$;
```

Migrations, in order: `001_entries_table.sql`, `002_entries_columns.sql`, `003_seed_entries.sql`, `004_storage_bucket.sql`, `005_edit_policy.sql`, `006_entries_khmer_columns.sql`, `007_contributor_place_km.sql`, `008_review_comments.sql`, `009_reviewer_policies.sql`, `010_reviewer_crud_delete.sql`.

## 4. Security decisions

**The gate, and why `review_entry` lives in the database.**
The publishable Supabase key ships to every browser. Anything the client can call, a stranger can call from the console. So the rule "only a reviewer may change `status`" cannot live in a hidden button or a Next.js redirect — those are UI. It lives in `review_entry()`, a `SECURITY DEFINER` function that (1) re-checks `is_reviewer()` inside the function itself, (2) accepts only `'published'` or `'returned'`, and (3) updates a row **only if it is still `pending`**. A non-reviewer who calls the RPC gets `false` and nothing changes. A hidden Publish button on `/review` is convenience for a reviewer; it protects nothing by itself.

`/review` is also gated server-side (`app/review/page.js` calls `is_reviewer()` before rendering the queue). If that call fails, the page treats the visitor as not a reviewer. That is UX, not the security boundary.

**Decision: what a returned entry says.**
A reviewer cannot return an entry without writing a reason. `ReviewQueue` blocks the empty comment in the UI, and the reason is inserted into `review_comments`. The owner reads it on My Entries. I would rather a contributor get a specific "the steps skip how the teams are chosen" than a silent `returned` badge.

**Decision: reviewers cannot take down a published entry through the review RPC.**
`review_entry` only touches rows that are still `pending`. There is no `'unpublished'` / `'taken down'` path in the RPC. Migration 010 does give a reviewer DELETE on any row (full CRUD), and the review page offers **Delete now** on pending items and **Approve delete** on owner requests. The UI does not offer a one-click takedown of a published game from the public archive; if a published entry must come down, the owner can request deletion, or the project owner can do it in the dashboard. I did not want a reviewer account to be a silent takedown tool for someone else's live entry without going through a request or an explicit Delete now click.

**Decision: search does not show a contributor their own pending entry.**
`/api/entries` — and therefore home, browse, and search — returns `status = 'published'` only. A contributor sees their own pending and returned work on `/my-entries`, not mixed into the public archive. The public face of the archive stays published-only; drafts live in one place the owner controls.

**Decision: nobody can make themselves a reviewer.**
`reviewers` has RLS, no insert/update/delete policy for `anon` or `authenticated`, table grants revoked except `SELECT` for `authenticated`, and that `SELECT` is own-row only. Promoting someone is a dashboard insert by me. I would rather assign reviewers by hand than build a self-serve role that a console one-liner can abuse.

**Known gap, on purpose in the current SQL.**
Migration 001's `entries` SELECT policy is still `using (true)`. A stranger with the publishable key who queries the `entries` table directly (not through `/api/entries`) can read `pending` and `returned` rows. The shipped site does not show those rows. Closing this means replacing that policy with `status = 'published' or owner = auth.uid() or is_reviewer()`. I have not run that replacement as a numbered migration yet.

## 5. AI use

1. Ox Alpha by Cline – Initial Website Development

I used Ox Alpha as my first AI coding agent to generate the initial version of my website. I asked it to build the entire website, including the basic structure, layout, and five initial archive entries. It generated the code and created a functional website based on my requirements.

2. Claude in the Browser – Website Redesign

After generating the initial website, I used Claude through the browser to improve its design and overall structure. I provided the existing website requirements and asked Claude to redesign the interface. I used it to improve the visual appearance, layout, and user experience of the website.

3. Claude Opus (Fable) by Cline – Image Replacement

I used Claude Opus through Cline to modify the existing website by replacing placeholder images with actual images. I asked the model to locate the relevant image references in the code and update them with the correct images while keeping the existing website structure.

4. moonshotai/kimi-latest – Main Website Builder and Development Assistant

I primarily use Kimi to build and modify the website. I provide instructions about the features or pages I want to create, and it generates the necessary code to implement them. I also use it when I need to modify existing webpages or improve their structure. Besides coding, I ask Kimi questions about my codebase and existing infrastructure when I want to understand how something works. For example, when I want to add more entries to the archive, I ask it to explain the steps so I can implement them myself instead of asking it to generate everything.

5. OpenRouter Free – JSON Fixing and Independent Code Reviewer

I initially used OpenRouter Free to identify and fix a syntax error in my JSON file. Later, I started using it as a separate code-review agent. After my main coding agent generates or modifies code, I provide the relevant code to OpenRouter Free and ask it to review the implementation. It checks for potential errors, identifies problems, and provides suggestions for improvement without directly modifying my code. This allows me to use one AI for implementation and another for reviewing the results.

6. OpenRouter: z-ai/glm-5.2 – Project Advisor

I use GLM-5.2 mainly as an advisor during the development process. Before implementing a new feature or making significant changes to the website, I describe my idea and ask the model for recommendations. It helps me evaluate different approaches, consider possible improvements, and decide how a feature should work before I start implementing it. I use its responses as guidance when planning the next development steps.

7. DeepSeek V4 Flash – Authentication, Codebase, and Database Development

I use DeepSeek V4 Flash for more complex coding tasks. I first used it to implement the authentication system, including sign-up, log-in, and log-out functionality. After that, I continued using it to understand my existing codebase, plan the necessary changes, and generate code based on my instructions. I also used it to migrate existing data and work with the database structure. Later, I relied on it to implement the entry review system by introducing pending and published statuses for submitted entries. I also used it to create and configure database policies to control user access and protect data from unauthorized modifications.

## 6. Sources and credits

Every published entry names its contributor and the place, on the card and on the game page, in English and in Khmer. The eight games in the archive at submission:

| Game | Khmer | Contributor | Place | Photo in `public/images/` |
|---|---|---|---|---|
| Chol Chhoung | ចោលឈូង | Sophea Ly | Prey Veng | `chol-chhoung.jpg` |
| Leak Kanseng | លាក់កន្សែង | Vantha Chan | Prey Veng | `leak-kanseng.png` |
| Bos Angkunh | បោះអង្គញ់ | Bunthoeun Prak | Prey Veng | `bos-angkunh.webp` |
| Teanh Prot | ទាញព្រ័ត្រ | Chenda Meas | Prey Veng | `teanh-prot.jpg` |
| Chab Kon Klaeng | ចាប់កូនខ្លែង | Rithy Sok | Prey Veng | `chab-kon-kaeb.jpg` |
| Muek Jumping Game | ល្បែងលោតមឹក | Nita | Prey Veng | `muek-jumping-game.jpg` |
| Rubber Band Jumping Game | លេងលូតកៅស៊ូ | Chea Visal | Prey Veng | `lot-kausu.jpg` |
| Stech Chong | ស្តេចចង់ | Sok Karuna | Prey Veng | `stech-chong.jpg` |

I am listing these names as they appear in the archive. Before I submit, I will confirm with each person that they are okay being named in a public AUPP project, and I will change any of these lines to "asked not to be named" if that was the answer. I will not invent a permission that was not asked for.

Links to the source of photos: 
- Stech Chong: Facebook : https://share.google/BhNoSxFWSPoMU17GQ
- Rubber Band Jumping Game: https://www.worldvision.org/sponsorship-news-stories/photos-cambodian-children
- Muek Jumping Game: https://www.alamy.com/stock-photo/children-with-play-in-cambodia.html?pseudoid=53E08134-906E-4A4C-A7D3-2E4DAD9B5F47&sortBy=relevant
- Teanh Prot: https://www.yosothor.org/publications/khmer-renaissance/chapter-three/picharana-lbaeng-teanh-proth.html
- Leak Kanseng: https://troryorng.com/article/275683.html
- Bos Angkunh: https://thmeythmey.com/detail/77045?page=1
- Chol Chhoung: https://education.ams.com.kh/education-update/national/news/khmer-new-year-is-an-opportunity-for-young-people-to-play-popular-games-and-contribute-to-preserving-the-culture-and-traditions-of-khmer-ancestors
- Chab Kon Klaeng: https://kohsantepheapdaily.com.kh/article/824603.html

## 7. Running it locally

```sh
git clone https://github.com/rothanayorn/khmer-childhood-game-archive.git
cd khmer-childhood-game-archive
npm install
```

Create `.env.local` (never committed) with these two names only — no values in this README:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The publishable (anon) key is public by design — it ships to every browser. The service-role key is not used anywhere in this app and must not be put in `.env.local` for this project. Set the same two names in Vercel → Settings → Environment Variables.

Then:

```sh
npm run dev
```

Open `http://localhost:3000`. To recreate the database, run migrations 001–010 in order in the Supabase SQL editor, then the `status` / `is_reviewer` / `review_entry` SQL in section 3. Promote a reviewer with a dashboard insert into `reviewers`.

`npm run build` is the check I used after every code change.

## 8. Submission checklist

Copied from the brief. Answers I can stand behind from the code are filled in; anything that needs a URL, a date, or a click I have not done yet is `[FILL IN]` rather than a yes I did not earn.

- Live URL loads logged out and shows published entries only: yes — home, `/browse`, `/api/entries` all filter `status = 'published'` (`app/api/entries/route.js`). URL: `[FILL IN vercel.app address]`
- A stranger cannot publish their own entry through the page or the console: yes, if `review_entry` in the live project matches the SQL in section 3 (re-checks `is_reviewer()`, `pending` only). Tested: `[FILL IN date you ran a console RPC as a stranger]`
- Logged out, the API returns nothing pending or returned: yes for `/api/entries` (`.eq("status", "published")`). Tested: `[FILL IN date]`. Direct table reads with the publishable key are still open — see the known gap in section 4.
- Contributors can edit and delete only their own entries: edit yes (`001`/`005`). Delete is now a **request** a reviewer must approve (`010` drops owner DELETE). Look at `supabase/migrations/001_entries_table.sql`, `005_edit_policy.sql`, `010_reviewer_crud_delete.sql`.
- No secrets anywhere in the repo history: yes — `git log --all -S "eyJ"` and `git log --all -S "SERVICE_ROLE"` return nothing; `.env*` is in `.gitignore`; the publishable key is public by design and is not committed. Checked with `git log -S`.
- At least eight real entries, each with a credited source: yes — eight, listed with contributor, place, and photo in section 6. Count: 8.
- Khmer renders on every screen a user meets, including the queue: yes — names always in Khmer; full KM dictionary in `lib/i18n.js` including `review.*` and `myEntries.status*`; language switcher in the header.
- Works at phone width: yes — hamburger under 680 px (`components/SiteHeader.module.css`), card/queue restack at 480 px. Tested on: `[FILL IN device or "Chrome DevTools 390×844"]`
- No test entries, lorem ipsum or TODO comments in shipped pages: yes — searched the repo; `TODO` count is 0; `lorem` appears only in `AGENTS.md` as a rule, not in a page.
- No console errors on the main pages: `[FILL IN yes after a devtools click-through of /, /browse, /games/[slug], /login, /my-entries, /review]`. Last `npm run build` was clean (exit 0).
- jesseorndorff is a collaborator on this repo: `[FILL IN yes/no — GitHub → Settings → Collaborators]`
- Supabase project restored and awake on `[FILL IN date]`
- Demo video link opens in a private window: `[FILL IN link]`
- Reflection pasted in the Canvas submission: `[FILL IN yes/no]`
- Posted in the Show Your Archive discussion: `[FILL IN yes/no]`
- Q&A slot booked for `[FILL IN date and time]`

---

Repo: <https://github.com/rothanayorn/khmer-childhood-game-archive>



Repo: <https://github.com/rothanayorn/khmer-childhood-game-archive>

