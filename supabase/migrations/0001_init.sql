-- FreshHub — initial schema
-- Menu = categories (ordered) each with items (ordered). Photos live in Storage;
-- items reference them by object path. RLS: anyone can read; writes are denied to
-- anon and done server-side with the service-role key until Stage 5 wires auth.

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  name        text not null,
  price       int  not null default 0,          -- whole Naira, e.g. 4500
  available   boolean not null default true,
  sort_order  int  not null default 0,
  photo_path  text,                             -- Storage object path, null => placeholder
  created_at  timestamptz not null default now()
);

create index if not exists items_category_id_idx on public.items (category_id);
create index if not exists items_sort_idx on public.items (category_id, sort_order);
create index if not exists categories_sort_idx on public.categories (sort_order);

-- Row Level Security -----------------------------------------------------------
alter table public.categories enable row level security;
alter table public.items enable row level security;

-- Public read access (anon + authenticated). No write policies => anon cannot
-- mutate; the service-role key bypasses RLS for server-side admin writes.
drop policy if exists "categories are publicly readable" on public.categories;
create policy "categories are publicly readable"
  on public.categories for select
  using (true);

drop policy if exists "items are publicly readable" on public.items;
create policy "items are publicly readable"
  on public.items for select
  using (true);

-- Storage bucket for dish photos (public read; created here so Stage 4 is ready).
insert into storage.buckets (id, name, public)
values ('menu-photos', 'menu-photos', true)
on conflict (id) do nothing;
