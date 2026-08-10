# Testbench

Turn scattered past questions into structured practice. A SEES Tech Hub
community project — upload a past-question paper or lecture slides, get
back a clean, practisable question set.

## Running locally

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**The backend is live — copy `.env.local.example` to `.env.local` to talk
to it.** Skipping that step isn't broken, but it's easy to mistake for
broken: the app silently falls back to its own mock API routes under
`src/app/api/*` (in-memory store in `src/lib/store.ts`), and a mocked
upload PUTs to a relative `/api/mock-storage/...` path instead of a real
R2 URL — nothing shows up in the network tab pointing at Cloudflare, which
looks exactly like a stuck integration if you're not expecting it.

Current live values (also in `.env.local.example`):

```
NEXT_PUBLIC_API_BASE_URL=https://testbench-api-53f53b05d813.herokuapp.com
NEXT_PUBLIC_R2_PUBLIC_BASE=https://pub-42861a7682c8422c854d3698618e8987.r2.dev
```

Known backend gaps as of now (see `src/lib/api.ts` for where these are
handled):

- `PATCH /questions/:id` doesn't accept an `options` field yet, so edited
  MCQ answer choices only persist to `stem`/`correct_answer`/`status` —
  option wording stays local to the confirm screen until the backend adds
  it.
- There's no request field or endpoint to set a set's `title` yet — every
  set comes back `title: null`. The share/publish control has a name field
  in local state for when that lands (see `ShareControl.tsx`); it isn't
  sent anywhere yet.
- Discover items don't carry a `share_token` (only non-null for
  `visibility: "shared"` sets, confirmed live) and there's no dedicated
  fetch-by-id route for a `public` set — but `GET /sets/:id/questions`
  (the same route the confirm screen uses) turns out to be
  visibility-aware: confirmed live that a non-owner, or no auth at all,
  gets a 404 for a private/shared set but the reduced public shape for a
  `public` one. `getPublicSetQuestions` in `api.ts` calls that same route
  with `skipAuth`, which is what `/discover/[setId]` uses — not a new or
  guessed-at endpoint, just a second, unauthenticated caller of one
  that's already documented.

## What's here

- `src/app/` — screens: landing, `/auth`, `/upload`, `/processing/[id]`,
  `/confirm/[setId]`, `/practice/[id]`, `/results/[id]`, plus sharing:
  `/discover` and `/discover/[setId]` (public), `/shared/[token]` (public,
  read-only), and print views for each of owner/shared/discovered

- `src/app/api/` — mock backend (in-memory store in `src/lib/store.ts`)
  standing in for the Floater's FastAPI service until it's live
- `src/components/` — shared UI, landing sections, the confirm screen's
  question card and share/publish control, and the read-only question
  list used by both the shared view and print
- `src/lib/` — typed API client, session/practice-state helpers, shared types

The confirm screen (`/confirm/[setId]`) is the product's trust mechanism —
see the PRD before changing its behavior.
