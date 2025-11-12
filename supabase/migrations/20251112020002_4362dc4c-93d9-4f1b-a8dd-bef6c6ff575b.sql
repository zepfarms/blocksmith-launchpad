-- Table for custom code-based signup verification
create extension if not exists citext with schema public;

create table public.email_verifications (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  code text not null,
  expires_at timestamptz not null default now() + interval '10 minutes',
  attempts int not null default 0,
  used boolean not null default false,
  created_at timestamptz not null default now(),
  created_ip text
);

alter table public.email_verifications enable row level security;

-- Open policies for anon usage (frontend calls through public edge functions)
create policy "Anyone can insert verification requests" on public.email_verifications
for insert to public
with check (true);

create policy "Anyone can read verification rows" on public.email_verifications
for select to public
using (true);

create policy "Anyone can update verification rows" on public.email_verifications
for update to public
using (true)
with check (true);

create index email_verifications_email_idx on public.email_verifications (email);
create index email_verifications_expires_idx on public.email_verifications (expires_at);
