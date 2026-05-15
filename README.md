# TikTok Shop Growth Suite

A 3-in-1 SaaS application for TikTok Shop sellers. The Growth Suite ships with three AI-powered tools:

1. **UGC Script Generator** — generates scroll-stopping UGC scripts tailored to your product.
2. **Affiliate Outreach** — drafts personalized DMs and emails to recruit affiliates and creators.
3. **Copy Optimizer** — rewrites product titles, descriptions, and ad copy for higher conversion.

> Phase 1 delivered the base architecture (Supabase auth + protected dashboard shell). **Phase 2 wires up the three tools to the OpenAI API with real-time streaming output.**

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

> In your Supabase project, enable Email/Password authentication under **Authentication → Providers**.

### 3. Run the dev server

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

## Project structure

```
src/
├── app/
│   ├── (auth)/                 # Login & signup routes with their own auth layout
│   │   ├── actions.ts          # Server actions: signIn, signUp, signOut
│   │   ├── login/
│   │   └── signup/
│   ├── api/                    # Streaming AI endpoints
│   │   ├── ugc-scripts/route.ts
│   │   ├── outreach/route.ts
│   │   └── copy-optimizer/route.ts
│   ├── dashboard/              # Protected area
│   │   ├── layout.tsx          # Sidebar + header shell, redirects unauthenticated users
│   │   ├── page.tsx            # Dashboard home
│   │   ├── ugc-scripts/        # Tool 1: form + page
│   │   ├── outreach/           # Tool 2: form + page
│   │   └── copy-optimizer/     # Tool 3: form + page
│   ├── globals.css
│   ├── layout.tsx              # Root layout with Toaster
│   └── page.tsx                # Root redirect
├── components/
│   ├── dashboard/              # Sidebar, header, form-field, output-panel
│   └── ui/                     # shadcn/ui primitives (button, input, label, card, textarea, select, skeleton)
├── hooks/
│   └── use-stream-generation.ts # Shared fetch + ReadableStream consumer
└── lib/
    ├── api-helpers.ts          # requireUser() + ensureOpenAIConfigured()
    ├── openai.ts               # AI SDK model wrapper
    ├── prompts.ts              # Zod schemas + prompt builders for each tool
    ├── supabase/               # Browser, server, and middleware Supabase clients
    └── utils.ts                # cn() helper
middleware.ts                   # Route protection via Supabase session refresh
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

## Roadmap

- **Phase 3**: persistent history per user (Supabase tables + RLS), regenerate / save favorites.
- **Phase 4**: billing and usage limits.
