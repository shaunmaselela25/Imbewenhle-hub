create function public.enforce_enquiry_status_transition() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  if not (
    (old.status = 'new' and new.status in ('under_review', 'closed'))
    or (old.status = 'under_review' and new.status in ('awaiting_client', 'proposal_prepared', 'closed'))
    or (old.status = 'awaiting_client' and new.status in ('under_review', 'closed'))
    or (old.status = 'proposal_prepared' and new.status in ('accepted', 'awaiting_client', 'under_review', 'closed'))
    or (old.status = 'accepted' and new.status in ('in_delivery', 'closed'))
    or (old.status = 'in_delivery' and new.status in ('completed', 'awaiting_client', 'closed'))
    or (old.status = 'completed' and new.status = 'closed')
  ) then
    raise exception 'invalid_transition';
  end if;

  if new.status = 'accepted' and not exists (
    select 1 from public.proposals
    where enquiry_id = new.id and decision_status = 'accepted'
  ) then
    raise exception 'needs_accepted_proposal';
  end if;

  return new;
end;
$$;

create trigger enforce_enquiry_status_transition
before update of status on public.enquiries
for each row execute function public.enforce_enquiry_status_transition();

create function public.guard_last_admin() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  -- Locking the admin rows stops two admins demoting each other at the same time.
  perform 1 from public.profiles where role = 'admin' for update;

  if (select count(*) from public.profiles where role = 'admin') <= 1 then
    raise exception 'last_admin';
  end if;

  return new;
end;
$$;

create trigger guard_last_admin
before update of role on public.profiles
for each row
when (old.role = 'admin' and new.role <> 'admin')
execute function public.guard_last_admin();
