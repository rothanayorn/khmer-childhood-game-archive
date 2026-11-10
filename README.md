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

## 4. Security decisions

**The gate, and why `review_entry` lives in the database.**
The publishable Supabase key ships to every browser. Anything the client can call, a stranger can call from the console. So the rule "only a reviewer may change `status`" cannot live in a hidden button or a Next.js redirect — those are UI. It lives in `review_entry()`, a `SECURITY DEFINER` function that (1) re-checks `is_reviewer()` inside the function itself, (2) accepts only `'published'` or `'returned'`, and (3) updates a row **only if it is still `pending`**. A non-reviewer who calls the RPC gets `false` and nothing changes. A hidden Publish button on `/review` is convenience for a reviewer; it protects nothing by itself.

`/review` is also gated server-side (`app/review/page.js` calls `is_reviewer()` before rendering the queue). If that call fails, the page treats the visitor as not a reviewer. That is UX, not the security boundary.

**Decision: what a returned entry says.**
A reviewer cannot return an entry without writing a reason. `ReviewQueue` blocks the empty comment in the UI, and the reason is inserted into `review_comments`. The owner reads it on My Entries. I would rather a contributor get a specific "the steps skip how the teams are chosen" than a silent `returned` badge.

**Decision: reviewers cannot take down a published entry.**
`review_entry` only touches rows that are still `pending`. There is no `'unpublished'` / `'taken down'` path in the RPC. If a published entry needs to come down, the owner can delete it (RLS allows that), or the project owner can do it in the dashboard. I did not want a reviewer account to be a silent takedown tool for someone else's live entry.

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

`bay-khom.jpg` is also in `public/images/` but is not attached to a published entry yet.

Photographs for the seed entries live in `public/images/` under the filenames above. I still need to write the photographer next to each filename: if I took the photo, I will say so; if the contributor or a family member sent it, I will put their name there; if it came from somewhere else, I will credit that source or replace the photo. I will not leave an uncredited image in a public archive.

No lorem ipsum. No stock "user one / user two." If a later submission comes from someone who wants to stay unnamed, this is the sentence I will use: *a [relationship] in [place] who asked not to be named.*

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

Open `http://localhost:3000`. To recreate the database, run migrations 001–009 in order in the Supabase SQL editor, then the `status` / `is_reviewer` / `review_entry` SQL in section 3. Promote a reviewer with a dashboard insert into `reviewers`.

`npm run build` is the check I used after every code change.

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: yes, (URL)
- A stranger cannot publish their own entry through the page or the console: yes, tested (date)
- Logged out, the API returns nothing pending or returned: yes, tested (date)
- Contributors can edit and delete only their own entries: yes
- No secrets anywhere in the repo history: yes, checked with (how)
- At least eight real entries, each with a credited source: yes, (count)
- Khmer renders on every screen a user meets, including the queue: yes
- Works at phone width: yes, tested on (device or browser width)
- No test entries, lorem ipsum or TODO comments in shipped pages: yes
- No console errors on the main pages: yes
- jesseorndorff is a collaborator on this repo: yes
- Supabase project restored and awake on (date)
- Demo video link opens in a private window: yes, (link)
- Reflection pasted in the Canvas submission: yes
- Posted in the Show Your Archive discussion: yes
- Q&A slot booked for (date and time)

---

Repo: <https://github.com/rothanayorn/khmer-childhood-game-archive>

