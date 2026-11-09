begin;
create extension if not exists pgtap with schema extensions;
select plan(7);

-- Sipho (consultant)
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);

create temp table allowed_status (from_status text, to_status text);
insert into allowed_status values
  ('new', 'under_review'), ('new', 'closed'),
  ('under_review', 'awaiting_client'), ('under_review', 'proposal_prepared'), ('under_review', 'closed'),
  ('awaiting_client', 'under_review'), ('awaiting_client', 'closed'),
  ('proposal_prepared', 'accepted'), ('proposal_prepared', 'awaiting_client'), ('proposal_prepared', 'under_review'), ('proposal_prepared', 'closed'),
  ('accepted', 'in_delivery'), ('accepted', 'closed'),
  ('in_delivery', 'completed'), ('in_delivery', 'awaiting_client'), ('in_delivery', 'closed'),
  ('completed', 'closed');

create temp table all_status as
  select unnest(array['new','under_review','awaiting_client','proposal_prepared','accepted','in_delivery','completed','closed']) as status;

create function public.t_status_enquiry(p_status text, p_decision text default null) returns text language plpgsql as $$
declare
  v_id uuid;
  v_reference text;
begin
  insert into public.enquiries (
    idempotency_key, requester_name, requester_email, organisation, category_id,
    problem_description, desired_outcome, urgency, status
  ) values (
    gen_random_uuid(), 'Test Person', 'test@example.test', 'Test Organisation',
    (select id from public.service_categories where slug = 'automation'),
    repeat('a', 30), repeat('b', 10), 'low', p_status
  ) returning id, public_reference into v_id, v_reference;

  if p_decision is not null then
    insert into public.proposals (enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline, decision_status)
    values (v_id, 'Title', 'Scope', 'Deliverables', 'Assumptions', 'Exclusions', 'Six weeks', p_decision);
  end if;

  return v_reference;
end $$;

create function public.t_try_status(p_from text, p_to text) returns text language plpgsql as $$
begin
  perform public.change_enquiry_status(
    public.t_status_enquiry(p_from, case when p_from = 'proposal_prepared' and p_to = 'accepted' then 'accepted' end),
    p_to
  );
  return 'ok';
exception when others then
  return sqlerrm;
end $$;

create function public.t_try_decision(p_from text, p_to text) returns text language plpgsql as $$
declare
  v_reference text := public.t_status_enquiry('under_review', p_from);
begin
  update public.proposals set decision_status = p_to
  where enquiry_id = (select id from public.enquiries where public_reference = v_reference);
  return 'ok';
exception when others then
  return sqlerrm;
end $$;

select is(
  (select string_agg(from_status || '>' || to_status || '=' || result, ', ')
   from (select from_status, to_status, public.t_try_status(from_status, to_status) as result from allowed_status) as tried
   where result <> 'ok'),
  null,
  'T-BR8-1 every allowed transition succeeds'
);

select is(
  (select string_agg(from_status || '>' || to_status || '=' || result, ', ')
   from (
     select a.status as from_status, b.status as to_status, public.t_try_status(a.status, b.status) as result
     from all_status a cross join all_status b
     where not exists (select 1 from allowed_status c where c.from_status = a.status and c.to_status = b.status)
   ) as tried
   where result <> 'invalid_transition'),
  null,
  'T-BR8-2 every other transition fails with invalid_transition'
);

select is(
  (select string_agg(status || '=' || result, ', ')
   from (select status, public.t_try_status('closed', status) as result from all_status) as tried
   where result = 'ok'),
  null,
  'T-BR8-3 no change is possible from closed'
);

select is(
  (select public.change_enquiry_status(public.t_status_enquiry('proposal_prepared', 'accepted'), 'accepted')),
  'accepted',
  'T-BR8-4 accepted is allowed with an accepted proposal'
);

create temp table refs as select public.t_status_enquiry('proposal_prepared', 'shared') as reference, public.t_status_enquiry('proposal_prepared') as no_proposal;
select throws_ok(
  $$select public.change_enquiry_status((select reference from refs), 'accepted')$$,
  'P0001', 'needs_accepted_proposal', 'T-BR8-4 accepted fails when the proposal is not accepted'
);
select throws_ok(
  $$select public.change_enquiry_status((select no_proposal from refs), 'accepted')$$,
  'P0001', 'needs_accepted_proposal', 'T-BR8-4 accepted fails with no proposal'
);

create temp table decision_cases as
  select a.d as from_decision, b.d as to_decision,
    (a.d, b.d) in (('draft','shared'), ('shared','accepted'), ('shared','declined'), ('shared','draft')) as allowed,
    public.t_try_decision(a.d, b.d) as result
  from unnest(array['draft','shared','accepted','declined']) as a(d)
  cross join unnest(array['draft','shared','accepted','declined']) as b(d)
  where a.d <> b.d;

select is(
  (select string_agg(from_decision || '>' || to_decision || '=' || result, ', ')
   from decision_cases
   where result <> case when allowed then 'ok' else 'invalid_transition' end),
  null,
  'T-BR8-5 proposal decisions follow the allowed transitions'
);

select * from finish();
rollback;
