# TikTok Shop Growth Suite

A 3-in-1 SaaS application for TikTok Shop sellers. The Growth Suite ships with three AI-powered tools:

1. **UGC Script Generator** — generates scroll-stopping UGC scripts tailored to your product.
2. **Affiliate Outreach** — drafts personalized DMs and emails to recruit affiliates and creators.
3. **Copy Optimizer** — rewrites product titles, descriptions, and ad copy for higher conversion.

> Phase 1 of the MVP delivers the base architecture and UI: authentication (Supabase), protected dashboard with sidebar/header, and scaffolded tool pages. AI generation will be wired up in a later phase.

## Tech stack

- **[Next.js 14](https://nextjs.org/)** with the App Router
- **TypeScript**
- **Tailwind CSS** + **[shadcn/ui](https://ui.shadcn.com/)** components (Card, Input, Button, Label)
- **[Lucide React](https://lucide.dev/)** icons
- **[Supabase](https://supabase.com/)** Auth (Email/Password) via `@supabase/ssr`
- **[sonner](https://sonner.emilkowal.ski/)** toast notifications
- **OpenAI API** (planned for the AI features)

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
- `OPENAI_API_KEY` — (used in a later phase)

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
│   ├── dashboard/              # Protected area
│   │   ├── layout.tsx          # Sidebar + header shell, redirects unauthenticated users
│   │   ├── page.tsx            # Dashboard home
│   │   ├── ugc-scripts/        # Tool 1 scaffold
│   │   ├── outreach/           # Tool 2 scaffold
│   │   └── copy-optimizer/     # Tool 3 scaffold
│   ├── globals.css
│   ├── layout.tsx              # Root layout with Toaster
│   └── page.tsx                # Root redirect
├── components/
│   ├── dashboard/              # Sidebar & top header
│   └── ui/                     # shadcn/ui primitives (button, input, label, card)
└── lib/
    ├── supabase/               # Browser, server, and middleware Supabase clients
    └── utils.ts                # cn() helper
middleware.ts                   # Route protection via Supabase session refresh
```

## Auth flow

- `middleware.ts` runs on every request, refreshes the Supabase session cookie, and:
  - Redirects unauthenticated users to `/login` when they hit `/dashboard/*`.
  - Redirects already-authenticated users away from `/login` and `/signup` to `/dashboard`.
- The `/dashboard` server layout double-checks the user with `supabase.auth.getUser()` for an extra safety net.

## Roadmap

- **Phase 2**: build the input forms and wire up OpenAI for each of the three tools.
- **Phase 3**: persistent history per user (Supabase tables + RLS).
- **Phase 4**: billing and usage limits.
