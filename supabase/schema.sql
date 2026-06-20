-- ============================================================
-- SUPABASE SQL SETUP SCRIPT
-- Run in: supabase.com/dashboard → SQL Editor
-- ============================================================

-- Tables
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  images text[],
  video_url text,
  github_url text,
  live_url text,
  tech_stack text[],
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.experiences (
  id uuid default gen_random_uuid() primary key,
  num text not null,
  role text not null,
  company text not null,
  period text not null,
  description text,
  tags text[],
  is_current boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.stack_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text,
  icon text,
  proficiency integer check (proficiency >= 1 and proficiency <= 100),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.stack_items enable row level security;

create policy "Public read published projects" on public.projects
  for select using (status = 'published');

create policy "Public read experiences" on public.experiences
  for select using (true);

create policy "Public read stack" on public.stack_items
  for select using (true);

-- ============================================================
-- STORAGE BUCKET
-- Run this separately or via Storage → New bucket in dashboard
-- ============================================================

-- Create the bucket (public read, authenticated write)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880,  -- 5MB
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Storage policies: anyone can view, authenticated can upload/delete
create policy "Public read portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "Authenticated upload portfolio images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images');

create policy "Authenticated delete portfolio images"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images');

-- ============================================================
-- SEED DATA (optional — remove if not needed)
-- ============================================================

-- Insert sample projects
insert into public.projects (title, slug, short_description, tech_stack, featured, status) values
  ('Project Alpha', 'project-alpha', 'A modern web application pushing boundaries.', array['Next.js', 'TypeScript', 'PostgreSQL'], true, 'published'),
  ('Project Beta', 'project-beta', 'An innovative platform solving real-world problems.', array['React', 'Node.js', 'Docker'], false, 'published')
on conflict (slug) do nothing;

insert into public.experiences (num, role, company, period, description, tags, is_current) values
  ('01', 'Senior Full Stack Developer', 'TechCorp', '2024 – Present',
   'Led development of full-stack applications.', array['Next.js', 'AWS', 'PostgreSQL'], true),
  ('02', 'Full Stack Developer', 'StartupXYZ', '2022 – 2024',
   'Built and scaled the core product from scratch.', array['React', 'Node.js', 'MongoDB'], false)
on conflict do nothing;