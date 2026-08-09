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
- `POST /uploads/:id/start`'s response doesn't echo `upload_id` — the
  frontend already sources it from `POST /uploads/presign` instead, never
  from `/start`'s response.

## What's here

- `src/app/` — screens: landing, `/auth`, `/upload`, `/processing/[id]`,
  `/confirm/[id]`, `/practice/[id]`, `/results/[id]`
- `src/app/api/` — mock backend (in-memory store in `src/lib/store.ts`)
  standing in for the Floater's FastAPI service until it's live
- `src/components/` — shared UI, landing sections, and the confirm
  screen's question card
- `src/lib/` — typed API client, session/practice-state helpers, shared types

The confirm screen (`/confirm/[id]`) is the product's trust mechanism —
see the PRD before changing its behavior.
