# Testbench

Turn scattered past questions into structured practice. A SEES Tech Hub
community project — upload a past-question paper or lecture slides, get
back a clean, practisable question set.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment
variables are required for local dev — the app calls its own mock API
routes under `src/app/api/*`, which match the real backend's contract
(see `src/lib/types.ts` and `src/lib/api.ts`) exactly. Swap in the real
values from `.env.local.example` once Infra hands over the live base URL.

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
