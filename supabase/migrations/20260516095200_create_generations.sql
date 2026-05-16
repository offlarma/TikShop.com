-- =====================================================================
-- Growth Suite — Phase 3
-- Generations table + RLS policies + indexes.
--
-- A "generation" is a single AI output produced by one of the three tools:
--   - 'ugc-scripts'
--   - 'outreach'
--   - 'copy-optimizer'
--
-- Every row is owned by exactly one auth.users user. Row Level Security
-- ensures users can only see and mutate their own rows.
-- =====================================================================

-- Extensions ----------------------------------------------------------
create extension if not exists "pgcrypto";

-- Table ---------------------------------------------------------------
create table if not exists public.generations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  tool          text not null
                check (tool in ('ugc-scripts', 'outreach', 'copy-optimizer')),
  input         jsonb not null,
  output        text  not null,
  is_favorite   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table  public.generations           is 'AI outputs produced by Growth Suite tools, one row per generation.';
comment on column public.generations.tool      is 'Which tool produced this generation.';
comment on column public.generations.input     is 'Validated form input that produced the output (zod-shaped JSON).';
comment on column public.generations.output    is 'Raw AI output, as streamed back to the client.';
comment on column public.generations.is_favorite is 'User-toggled favorite flag.';

-- Indexes -------------------------------------------------------------
create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

create index if not exists generations_user_tool_created_idx
  on public.generations (user_id, tool, created_at desc);

create index if not exists generations_user_favorite_idx
  on public.generations (user_id, is_favorite, created_at desc)
  where is_favorite;

-- updated_at trigger --------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists generations_set_updated_at on public.generations;
create trigger generations_set_updated_at
before update on public.generations
for each row execute function public.set_updated_at();

-- Row Level Security --------------------------------------------------
alter table public.generations enable row level security;

drop policy if exists "generations_select_own"  on public.generations;
drop policy if exists "generations_insert_own"  on public.generations;
drop policy if exists "generations_update_own"  on public.generations;
drop policy if exists "generations_delete_own"  on public.generations;

create policy "generations_select_own"
  on public.generations
  for select
  using (auth.uid() = user_id);

create policy "generations_insert_own"
  on public.generations
  for insert
  with check (auth.uid() = user_id);

create policy "generations_update_own"
  on public.generations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "generations_delete_own"
  on public.generations
  for delete
  using (auth.uid() = user_id);
