-- QRLife Web MVP - Supabase schema (auth + cloud sync)
-- Apply in Supabase SQL editor.

create extension if not exists pgcrypto;

-- Cards (owned by auth user)
create table if not exists public.qrlife_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text unique not null,
  name text not null,
  job_title text,
  bio text,
  active boolean not null default true,
  is_favorite boolean not null default false,
  scans_count bigint not null default 0,
  last_scanned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists qrlife_cards_user_id_idx on public.qrlife_cards(user_id);

-- Links
create table if not exists public.qrlife_links (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.qrlife_cards(id) on delete cascade,
  kind text not null,
  url text not null,
  label text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists qrlife_links_card_id_idx on public.qrlife_links(card_id);

-- Scan events (public reads can generate these)
create table if not exists public.qrlife_scans (
  id bigserial primary key,
  card_id uuid not null references public.qrlife_cards(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  user_agent text,
  referrer text
);

create index if not exists qrlife_scans_card_id_idx on public.qrlife_scans(card_id);
create index if not exists qrlife_scans_scanned_at_idx on public.qrlife_scans(scanned_at);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_on_cards on public.qrlife_cards;
create trigger set_updated_at_on_cards
before update on public.qrlife_cards
for each row execute function public.set_updated_at();

-- Scan counter trigger
create or replace function public.bump_scan_counter()
returns trigger as $$
begin
  update public.qrlife_cards
    set scans_count = scans_count + 1,
        last_scanned_at = new.scanned_at
  where id = new.card_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists bump_scan_counter_on_insert on public.qrlife_scans;
create trigger bump_scan_counter_on_insert
after insert on public.qrlife_scans
for each row execute function public.bump_scan_counter();

-- RLS
alter table public.qrlife_cards enable row level security;
alter table public.qrlife_links enable row level security;
alter table public.qrlife_scans enable row level security;

-- Public can read active cards/links via slug page
drop policy if exists "public read active cards" on public.qrlife_cards;
create policy "public read active cards"
on public.qrlife_cards for select
using (active = true);

drop policy if exists "public read links for active cards" on public.qrlife_links;
create policy "public read links for active cards"
on public.qrlife_links for select
using (
  exists (
    select 1 from public.qrlife_cards c
    where c.id = qrlife_links.card_id
      and c.active = true
  )
);

-- Authenticated owner can CRUD own cards
drop policy if exists "owner read cards" on public.qrlife_cards;
create policy "owner read cards"
on public.qrlife_cards for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "owner insert cards" on public.qrlife_cards;
create policy "owner insert cards"
on public.qrlife_cards for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "owner update cards" on public.qrlife_cards;
create policy "owner update cards"
on public.qrlife_cards for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "owner delete cards" on public.qrlife_cards;
create policy "owner delete cards"
on public.qrlife_cards for delete
to authenticated
using (auth.uid() = user_id);

-- Owner can CRUD links that belong to their card
drop policy if exists "owner read links" on public.qrlife_links;
create policy "owner read links"
on public.qrlife_links for select
to authenticated
using (
  exists (
    select 1 from public.qrlife_cards c
    where c.id = qrlife_links.card_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "owner insert links" on public.qrlife_links;
create policy "owner insert links"
on public.qrlife_links for insert
to authenticated
with check (
  exists (
    select 1 from public.qrlife_cards c
    where c.id = qrlife_links.card_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "owner update links" on public.qrlife_links;
create policy "owner update links"
on public.qrlife_links for update
to authenticated
using (
  exists (
    select 1 from public.qrlife_cards c
    where c.id = qrlife_links.card_id
      and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.qrlife_cards c
    where c.id = qrlife_links.card_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "owner delete links" on public.qrlife_links;
create policy "owner delete links"
on public.qrlife_links for delete
to authenticated
using (
  exists (
    select 1 from public.qrlife_cards c
    where c.id = qrlife_links.card_id
      and c.user_id = auth.uid()
  )
);

-- Anyone can insert a scan for public analytics (no user data required)
drop policy if exists "public insert scans" on public.qrlife_scans;
create policy "public insert scans"
on public.qrlife_scans for insert
with check (true);

-- Owner can read scans for their own cards
drop policy if exists "owner read scans" on public.qrlife_scans;
create policy "owner read scans"
on public.qrlife_scans for select
to authenticated
using (
  exists (
    select 1 from public.qrlife_cards c
    where c.id = qrlife_scans.card_id
      and c.user_id = auth.uid()
  )
);
