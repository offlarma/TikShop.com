# TikTok Shop Growth Suite

A 3-in-1 SaaS application for TikTok Shop sellers. The Growth Suite ships with three AI-powered tools:

1. **UGC Script Generator** — generates scroll-stopping UGC scripts tailored to your product.
2. **Affiliate Outreach** — drafts personalized DMs and emails to recruit affiliates and creators.
3. **Copy Optimizer** — rewrites product titles, descriptions, and ad copy for higher conversion.

> Phase 1 delivered the base architecture (Supabase auth + protected dashboard shell). Phase 2 wired up the three tools to the OpenAI API with real-time streaming. **Phase 3 adds persistence: every generation is stored per user in Supabase with RLS, plus history UI with re-run, favorites and delete.**

## Tech stack

- **[Next.js 14](https://nextjs.org/)** with the App Router
- **TypeScript**
- **Tailwind CSS** + **[shadcn/ui](https://ui.shadcn.com/)** components (Card, Input, Button, Label)
- **[Lucide React](https://lucide.dev/)** icons
- **[Supabase](https://supabase.com/)** Auth (Email/Password) via `@supabase/ssr`
- **[sonner](https://sonner.emilkowal.ski/)** toast notifications
- **OpenAI API** via the [Vercel AI SDK](https://sdk.vercel.ai/) (`ai` + `@ai-sdk/openai`) with token streaming
- **[zod](https://zod.dev/)** for input validation on the API routes

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Supabase project credentials:

```bash
cp .env.local.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon/public key
- `OPENAI_API_KEY` — used by the three tool API routes (`/api/ugc-scripts`, `/api/outreach`, `/api/copy-optimizer`)
- `DATABASE_URL` — *optional*, only required to run `npm run db:migrate`. Direct Postgres connection string from **Project Settings → Database → Connection string**.

> In your Supabase project, enable Email/Password authentication under **Authentication → Providers**.

### 3. Apply the database migrations

The history feature requires the `public.generations` table + RLS policies. Pick **one** of:

**Option A — via `npm run db:migrate` (recommended, idempotent)**

Set `DATABASE_URL` in `.env.local` to the Supabase Postgres connection string (Dashboard → Project Settings → Database → Connection string → URI). Append `?sslmode=require`, then:

```bash
npm run db:migrate
```

The script tracks applied migrations in a `public._migrations` table, so it's safe to re-run.

**Option B — manual paste**

Open Supabase Dashboard → **SQL Editor**, paste the contents of every file under `supabase/migrations/` (in filename order) and run them.

### 4. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`. Unauthenticated visitors are redirected to `/login`; authenticated users land on `/dashboard`.

## Available scripts

- `npm run dev` — start the Next.js dev server
- `npm run build` — production build
- `npm run start` — start the production server
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript without emitting
- `npm run db:migrate` — apply pending SQL migrations (needs `DATABASE_URL`)

## Project structure

```
src/
├── app/
│   ├── (auth)/                 # Login & signup routes with their own auth layout
│   │   ├── actions.ts          # Server actions: signIn, signUp, signOut
│   │   ├── login/
│   │   └── signup/
│   ├── api/                    # Streaming AI endpoints (also persist on onFinish)
│   │   ├── ugc-scripts/route.ts
│   │   ├── outreach/route.ts
│   │   └── copy-optimizer/route.ts
│   ├── dashboard/              # Protected area
│   │   ├── actions.ts          # Server actions: setFavorite, delete, loadHistory
│   │   ├── layout.tsx          # Sidebar + header shell, redirects unauthenticated users
│   │   ├── page.tsx            # Dashboard home
│   │   ├── ugc-scripts/        # Tool 1: server page + client tool component
│   │   ├── outreach/           # Tool 2: server page + client tool component
│   │   └── copy-optimizer/     # Tool 3: server page + client tool component
│   ├── globals.css
│   ├── layout.tsx              # Root layout with Toaster
│   └── page.tsx                # Root redirect
├── components/
│   ├── dashboard/              # Sidebar, header, form-field, output-panel, generation-history
│   └── ui/                     # shadcn/ui primitives (button, input, label, card, textarea, select, skeleton)
├── hooks/
│   └── use-stream-generation.ts # Shared fetch + ReadableStream consumer
├── lib/
│   ├── api-helpers.ts          # requireUser() + ensureOpenAIConfigured()
│   ├── db/
│   │   └── generations.ts      # Typed CRUD over public.generations (RLS enforces ownership)
│   ├── openai.ts               # AI SDK model wrapper
│   ├── prompts.ts              # Zod schemas + prompt builders for each tool
│   ├── supabase/               # Browser, server, and middleware Supabase clients
│   └── utils.ts                # cn() helper
├── types/
│   └── db.ts                   # Tool / Generation domain types
middleware.ts                   # Route protection via Supabase session refresh
supabase/migrations/            # Versioned SQL migrations
scripts/apply-migrations.ts     # Idempotent migration runner used by `npm run db:migrate`
```

## Auth flow

- `middleware.ts` runs on every request, refreshes the Supabase session cookie, and:
  - Redirects unauthenticated users to `/login` when they hit `/dashboard/*`.
  - Redirects already-authenticated users away from `/login` and `/signup` to `/dashboard`.
- The `/dashboard` server layout double-checks the user with `supabase.auth.getUser()` for an extra safety net.

## AI tools (Phase 2)

Each tool follows the same pattern:

1. Client form posts JSON to its `/api/...` route.
2. The route authenticates the user via Supabase, validates the input with **zod**, builds a tool-specific prompt, and returns a streaming `text/plain` response from `streamText()` (`@ai-sdk/openai`).
3. `useStreamGeneration` consumes the stream chunk-by-chunk and renders it in `OutputPanel`, which supports light Markdown (`##` headings, `-` bullets, paragraphs) and a copy-to-clipboard action.

| Tool | Endpoint | Inputs |
| --- | --- | --- |
| UGC Script Generator | `POST /api/ugc-scripts` | product name, description, audience, tone, hook style, duration |
| Affiliate Outreach | `POST /api/outreach` | brand, product description, creator niche, offer, channel, tone |
| Copy Optimizer | `POST /api/copy-optimizer` | copy type, current copy, audience, key benefits, tone |

Default model: `gpt-4o-mini` (configurable in `src/lib/openai.ts`).

## Persistence (Phase 3)

- A single `public.generations` table stores every AI output (`id, user_id, tool, input jsonb, output text, is_favorite, created_at, updated_at`).
- **Row Level Security** is enabled: dedicated `select / insert / update / delete` policies pin every row to `auth.uid() = user_id`, so users can only ever see and mutate their own data.
- An `updated_at` trigger keeps the timestamp fresh on every update.
- Indexes:
  - `(user_id, created_at desc)` — global timeline
  - `(user_id, tool, created_at desc)` — per-tool history
  - partial `(user_id, is_favorite, created_at desc) where is_favorite` — fast favorites lookup
- Save flow: the API routes call `streamText({ ..., onFinish })` and persist the full output once the stream completes, so the user always sees the streamed tokens immediately and the row appears in history right after.
- The history UI on each tool page supports **re-run** (loads the inputs back into the form), **favorite** (pinned to top) and **delete**, all with optimistic updates and `sonner` toasts.

## Roadmap

- **Phase 4**: billing and usage limits (Stripe / Lemon Squeezy + per-user quota).
- Production hardening: rate-limiting on API routes, Sentry, mobile sidebar (`Sheet`), `loading.tsx` / `error.tsx` boundaries, auth callback for email confirm + password reset.
