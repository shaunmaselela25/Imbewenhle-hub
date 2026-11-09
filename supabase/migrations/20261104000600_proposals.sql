create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null unique references public.enquiries (id) on delete cascade,
  title text not null check (length(trim(title)) between 3 and 150),
  scope text not null check (length(trim(scope)) between 1 and 5000),
  deliverables text not null check (length(trim(deliverables)) between 1 and 5000),
  assumptions text not null check (length(trim(assumptions)) between 1 and 5000),
  exclusions text not null check (length(trim(exclusions)) between 1 and 5000),
  estimated_timeline text not null check (length(trim(estimated_timeline)) between 1 and 200),
  decision_status text not null default 'draft' check (decision_status in ('draft', 'shared', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
before update on public.proposals
for each row execute function public.set_updated_at();

create function public.enforce_proposal_decision_transition() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if not (
    (old.decision_status = 'draft' and new.decision_status = 'shared')
    or (old.decision_status = 'shared' and new.decision_status in ('accepted', 'declined', 'draft'))
  ) then
    raise exception 'invalid_transition';
  end if;
  return new;
end;
$$;

create trigger enforce_proposal_decision_transition
before update of decision_status on public.proposals
for each row
when (old.decision_status is distinct from new.decision_status)
execute function public.enforce_proposal_decision_transition();
