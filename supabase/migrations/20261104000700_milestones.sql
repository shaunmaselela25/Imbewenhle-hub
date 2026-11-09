create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete cascade,
  name text not null check (length(trim(name)) between 3 and 120),
  description text check (length(description) <= 1000),
  target_date date not null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index milestones_enquiry_target_date_idx on public.milestones (enquiry_id, target_date);

create trigger set_updated_at
before update on public.milestones
for each row execute function public.set_updated_at();

create function public.enforce_milestone_engagement() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.enquiries
    where id = new.enquiry_id and status in ('accepted', 'in_delivery', 'completed')
  ) then
    raise exception 'milestone_locked';
  end if;
  return new;
end;
$$;

create trigger enforce_milestone_engagement
before insert on public.milestones
for each row execute function public.enforce_milestone_engagement();
