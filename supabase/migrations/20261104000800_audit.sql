create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid default auth.uid() references public.profiles (id) on delete set null,
  entity_type text not null check (entity_type in ('enquiry', 'proposal', 'milestone', 'profile', 'service_category')),
  entity_id uuid not null,
  action text not null check (action in ('created', 'status_changed', 'updated', 'deleted', 'role_changed')),
  details jsonb not null default '{}',
  "timestamp" timestamptz not null default now()
);

create index audit_events_entity_timestamp_idx on public.audit_events (entity_type, entity_id, "timestamp" desc);

create function public.changed_fields(p_old jsonb, p_new jsonb) returns jsonb
language sql immutable set search_path = ''
as $$
  select coalesce(jsonb_agg(key order by key), '[]'::jsonb)
  from jsonb_each(p_new)
  where key not in ('id', 'created_at', 'updated_at')
    and value is distinct from p_old -> key;
$$;

create function public.audit_enquiry_status() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.audit_events (entity_type, entity_id, action, details)
  values ('enquiry', new.id, 'status_changed', jsonb_build_object('from', old.status, 'to', new.status));
  return new;
end;
$$;

create trigger audit_enquiry_status
after update of status on public.enquiries
for each row execute function public.audit_enquiry_status();

create function public.audit_row_change() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_entity_type constant text := tg_argv[0];
begin
  if tg_op = 'INSERT' then
    insert into public.audit_events (entity_type, entity_id, action, details)
    values (v_entity_type, new.id, 'created', jsonb_build_object('changed', public.changed_fields('{}', to_jsonb(new))));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.audit_events (entity_type, entity_id, action, details)
    values (v_entity_type, new.id, 'updated', jsonb_build_object('changed', public.changed_fields(to_jsonb(old), to_jsonb(new))));
    return new;
  end if;

  insert into public.audit_events (entity_type, entity_id, action)
  values (v_entity_type, old.id, 'deleted');
  return old;
end;
$$;

create trigger audit_proposal
after insert or update on public.proposals
for each row execute function public.audit_row_change('proposal');

create trigger audit_milestone
after insert or update or delete on public.milestones
for each row execute function public.audit_row_change('milestone');

create trigger audit_category
after insert or update on public.service_categories
for each row execute function public.audit_row_change('service_category');

create function public.audit_profile_role() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.audit_events (entity_type, entity_id, action, details)
  values ('profile', new.id, 'role_changed', jsonb_build_object('from', old.role, 'to', new.role));
  return new;
end;
$$;

create trigger audit_profile_role
after update of role on public.profiles
for each row
when (old.role is distinct from new.role)
execute function public.audit_profile_role();
