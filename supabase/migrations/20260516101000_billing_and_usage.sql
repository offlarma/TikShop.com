-- =====================================================================
-- Growth Suite — Phase 4
-- Per-user profiles, subscription state and usage events.
--
-- Design notes:
--   - One profile row per auth.users user (auto-created via trigger).
--   - At most one subscription row per user. We mirror the minimum
--     Stripe subscription state we need to gate access.
--   - Every successful AI generation also writes a usage_events row;
--     monthly counters are computed from this table on demand. This
--     keeps the source of truth in one place (the events) and avoids
--     drift between counters and reality.
-- =====================================================================

-- Extensions ----------------------------------------------------------
create extension if not exists "pgcrypto";

-- =====================================================================
-- profiles
-- =====================================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Per-user metadata, one row per auth.users user.';

-- Backfill + trigger to create a profile on signup --------------------
insert into public.profiles (id, email)
select u.id, u.email
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- =====================================================================
-- subscriptions
-- =====================================================================
create table if not exists public.subscriptions (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  plan                   text not null default 'free'
                         check (plan in ('free', 'pro', 'studio')),
  status                 text not null default 'active'
                         check (status in (
                           'active', 'trialing', 'past_due',
                           'canceled', 'incomplete', 'incomplete_expired',
                           'unpaid', 'paused'
                         )),
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.subscriptions is 'Subscription state per user, mirrored from Stripe.';

create index if not exists subscriptions_customer_idx
  on public.subscriptions (stripe_customer_id);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- =====================================================================
-- usage_events
-- =====================================================================
create table if not exists public.usage_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  tool          text not null
                check (tool in ('ugc-scripts', 'outreach', 'copy-optimizer')),
  generation_id uuid references public.generations(id) on delete set null,
  occurred_at   timestamptz not null default now()
);

comment on table public.usage_events
  is 'One row per successful AI generation. Used to compute monthly counters.';

create index if not exists usage_events_user_occurred_idx
  on public.usage_events (user_id, occurred_at desc);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_events  enable row level security;

-- profiles -----------------------------------------------------------
drop policy if exists "profiles_select_own"  on public.profiles;
drop policy if exists "profiles_update_own"  on public.profiles;

create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- subscriptions ------------------------------------------------------
-- Reads: user can see only their own subscription.
-- Writes: handled exclusively by the service role via the Stripe
-- webhook; no policies are granted for insert/update/delete so anon
-- and authenticated roles cannot mutate this table.
drop policy if exists "subscriptions_select_own" on public.subscriptions;

create policy "subscriptions_select_own"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- usage_events -------------------------------------------------------
-- Same shape as subscriptions: read-only for the owning user.
-- Inserts are issued by server code (using the user's session under
-- their own auth.uid()) so we allow insert with the same predicate.
drop policy if exists "usage_events_select_own" on public.usage_events;
drop policy if exists "usage_events_insert_own" on public.usage_events;

create policy "usage_events_select_own"
  on public.usage_events
  for select
  using (auth.uid() = user_id);

create policy "usage_events_insert_own"
  on public.usage_events
  for insert
  with check (auth.uid() = user_id);
