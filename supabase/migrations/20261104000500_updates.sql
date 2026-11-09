create table public.updates (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles (id) on delete restrict,
  visibility text not null check (visibility in ('client', 'internal')),
  body text not null check (length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index updates_enquiry_created_at_idx on public.updates (enquiry_id, created_at desc);
