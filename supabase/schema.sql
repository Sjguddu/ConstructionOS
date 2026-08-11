-- ConstructionOS: Supabase Free-tier schema
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin','project_manager','billing_engineer','site_engineer','store_manager','viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  client text,
  location text,
  contract_value numeric(18,2) default 0,
  progress numeric(5,2) default 0,
  status text default 'Planning',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  name text not null,
  category text not null default 'Other',
  document_no text,
  revision text,
  status text default 'Draft',
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.documents enable row level security;

drop policy if exists "profile own read" on public.profiles;
create policy "profile own read" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profile own update" on public.profiles;
create policy "profile own update" on public.profiles for update using (auth.uid() = id);

drop policy if exists "projects own read" on public.projects;
create policy "projects own read" on public.projects for select using (auth.uid() = owner_id);

drop policy if exists "projects own insert" on public.projects;
create policy "projects own insert" on public.projects for insert with check (auth.uid() = owner_id);

drop policy if exists "projects own update" on public.projects;
create policy "projects own update" on public.projects for update using (auth.uid() = owner_id);

drop policy if exists "projects own delete" on public.projects;
create policy "projects own delete" on public.projects for delete using (auth.uid() = owner_id);

drop policy if exists "documents project owner read" on public.documents;
create policy "documents project owner read" on public.documents for select using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

drop policy if exists "documents project owner insert" on public.documents;
create policy "documents project owner insert" on public.documents for insert with check (uploaded_by = auth.uid() and exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

drop policy if exists "documents uploader delete" on public.documents;
create policy "documents uploader delete" on public.documents for delete using (uploaded_by = auth.uid());

-- Create the Storage bucket from Supabase Dashboard:
-- Storage > New bucket > Name: construction-documents > Public: OFF.
-- Storage policies can then restrict paths to the authenticated user's project.
