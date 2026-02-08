-- QRLife Web (MVP) - Supabase schema
-- Apply in Supabase SQL editor.

-- Extensions
create extension if not exists pgcrypto;

-- Cards
create table if not exists public.qrlife_cards (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  job_title text,
  bio text,
  active boolean not null default true,
  scans_count bigint not null default 0,
  last_scanned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- Scans (raw events)
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

-- NOTE: For MVP speed, you can leave RLS disabled.
-- If you enable RLS later, you'll need policies for public reads and authenticated writes.
