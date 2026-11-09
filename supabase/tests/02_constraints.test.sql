begin;
create extension if not exists pgtap with schema extensions;
select * from no_plan();

create function public.t_enquiry(p jsonb default '{}') returns uuid language plpgsql as $$
declare
  v_id uuid;
begin
  insert into public.enquiries (
    idempotency_key, requester_name, requester_email, organisation, category_id,
    problem_description, desired_outcome, urgency, budget_range
  ) values (
    gen_random_uuid(),
    coalesce(p->>'name', 'Test Person'),
    coalesce(p->>'email', 'test@example.test'),
    coalesce(p->>'organisation', 'Test Organisation'),
    (select id from public.service_categories where slug = 'automation'),
    coalesce(p->>'problem', repeat('a', 30)),
    coalesce(p->>'outcome', repeat('b', 10)),
    coalesce(p->>'urgency', 'low'),
    p->>'budget'
  ) returning id into v_id;
  return v_id;
end $$;

create function public.t_proposal(p jsonb default '{}') returns uuid language plpgsql as $$
declare
  v_id uuid;
begin
  insert into public.proposals (
    enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline, decision_status
  ) values (
    public.t_enquiry(),
    coalesce(p->>'title', 'Title'),
    coalesce(p->>'scope', 'Scope'),
    coalesce(p->>'deliverables', 'Deliverables'),
    coalesce(p->>'assumptions', 'Assumptions'),
    coalesce(p->>'exclusions', 'Exclusions'),
    coalesce(p->>'timeline', 'Six weeks'),
    coalesce(p->>'decision', 'draft')
  ) returning id into v_id;
  return v_id;
end $$;

create function public.t_milestone(p jsonb default '{}') returns uuid language plpgsql as $$
declare
  v_id uuid;
begin
  insert into public.milestones (enquiry_id, name, description, target_date, status)
  values (
    '10000000-0000-4000-8000-0000000000a2',
    coalesce(p->>'name', 'Milestone'),
    p->>'description',
    current_date,
    coalesce(p->>'status', 'planned')
  ) returning id into v_id;
  return v_id;
end $$;

-- BR2: problem description 30 to 3,000 characters after trim
select throws_ok($$select public.t_enquiry(jsonb_build_object('problem', repeat('a', 29)))$$, '23514', null, 'T-BR2-1 29 characters is rejected');
select throws_ok($$select public.t_enquiry(jsonb_build_object('problem', repeat(' ', 5) || repeat('a', 29) || repeat(' ', 5)))$$, '23514', null, 'T-BR2-1 29 characters plus padding is rejected');
select lives_ok($$select public.t_enquiry(jsonb_build_object('problem', repeat('a', 30)))$$, 'T-BR2-1 30 characters is accepted');
select lives_ok($$select public.t_enquiry(jsonb_build_object('problem', repeat('a', 3000)))$$, 'T-BR2-1 3000 characters is accepted');
select throws_ok($$select public.t_enquiry(jsonb_build_object('problem', repeat('a', 3001)))$$, '23514', null, 'T-BR2-1 3001 characters is rejected');

-- BR3: email format
select lives_ok($$select public.t_enquiry(jsonb_build_object('email', 'name@example.com'))$$, 'T-BR3-1 name@example.com is accepted');
select throws_ok($$select public.t_enquiry(jsonb_build_object('email', 'name@'))$$, '23514', null, 'T-BR3-1 name@ is rejected');

-- BR12: field limits and allowed values
select throws_ok($$select public.t_enquiry(jsonb_build_object('name', 'a'))$$, '23514', null, 'T-BR12-1 name too short');
select throws_ok($$select public.t_enquiry(jsonb_build_object('name', repeat('a', 101)))$$, '23514', null, 'T-BR12-1 name too long');
select throws_ok($$select public.t_enquiry(jsonb_build_object('organisation', 'a'))$$, '23514', null, 'T-BR12-1 organisation too short');
select throws_ok($$select public.t_enquiry(jsonb_build_object('organisation', repeat('a', 151)))$$, '23514', null, 'T-BR12-1 organisation too long');
select throws_ok($$select public.t_enquiry(jsonb_build_object('email', repeat('a', 250) || '@b.co'))$$, '23514', null, 'T-BR12-1 email too long');
select throws_ok($$select public.t_enquiry(jsonb_build_object('outcome', repeat('a', 9)))$$, '23514', null, 'T-BR12-1 outcome too short');
select throws_ok($$select public.t_enquiry(jsonb_build_object('outcome', repeat('a', 1001)))$$, '23514', null, 'T-BR12-1 outcome too long');
select throws_ok($$select public.t_enquiry(jsonb_build_object('urgency', 'urgent'))$$, '23514', null, 'T-BR12-1 urgency not allowed');
select throws_ok($$select public.t_enquiry(jsonb_build_object('budget', 'lots'))$$, '23514', null, 'T-BR12-1 budget not allowed');
select lives_ok($$select public.t_enquiry()$$, 'T-BR12-1 budget may be empty');

select throws_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000002', 'client', '   ')$$, '23514', null, 'T-BR12-1 update body empty');
select throws_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000002', 'client', repeat('a', 2001))$$, '23514', null, 'T-BR12-1 update body too long');
select throws_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000002', 'public', 'Hello')$$, '23514', null, 'T-BR12-1 visibility not allowed');

select throws_ok($$select public.t_proposal(jsonb_build_object('title', 'ab'))$$, '23514', null, 'T-BR12-1 proposal title too short');
select throws_ok($$select public.t_proposal(jsonb_build_object('title', repeat('a', 151)))$$, '23514', null, 'T-BR12-1 proposal title too long');
select throws_ok($$select public.t_proposal(jsonb_build_object('scope', repeat('a', 5001)))$$, '23514', null, 'T-BR12-1 proposal scope too long');
select throws_ok($$select public.t_proposal(jsonb_build_object('deliverables', repeat('a', 5001)))$$, '23514', null, 'T-BR12-1 proposal deliverables too long');
select throws_ok($$select public.t_proposal(jsonb_build_object('assumptions', repeat('a', 5001)))$$, '23514', null, 'T-BR12-1 proposal assumptions too long');
select throws_ok($$select public.t_proposal(jsonb_build_object('exclusions', repeat('a', 5001)))$$, '23514', null, 'T-BR12-1 proposal exclusions too long');
select throws_ok($$select public.t_proposal(jsonb_build_object('scope', '  '))$$, '23514', null, 'T-BR12-1 proposal scope empty');
select throws_ok($$select public.t_proposal(jsonb_build_object('timeline', repeat('a', 201)))$$, '23514', null, 'T-BR12-1 proposal timeline too long');
select throws_ok($$select public.t_proposal(jsonb_build_object('decision', 'maybe'))$$, '23514', null, 'T-BR12-1 proposal decision not allowed');

select throws_ok($$select public.t_milestone(jsonb_build_object('name', 'ab'))$$, '23514', null, 'T-BR12-1 milestone name too short');
select throws_ok($$select public.t_milestone(jsonb_build_object('name', repeat('a', 121)))$$, '23514', null, 'T-BR12-1 milestone name too long');
select throws_ok($$select public.t_milestone(jsonb_build_object('description', repeat('a', 1001)))$$, '23514', null, 'T-BR12-1 milestone description too long');
select throws_ok($$select public.t_milestone(jsonb_build_object('status', 'late'))$$, '23514', null, 'T-BR12-1 milestone status not allowed');

-- T-DB-4: now() is fixed inside a transaction, so rows start with an old updated_at
insert into public.enquiries (
  id, idempotency_key, requester_name, requester_email, organisation, category_id,
  problem_description, desired_outcome, urgency, updated_at
) values (
  '50000000-0000-4000-8000-000000000001', gen_random_uuid(), 'Test Person', 'test@example.test', 'Test Organisation',
  (select id from public.service_categories where slug = 'automation'),
  repeat('a', 30), repeat('b', 10), 'low', '2000-01-01'
);
update public.enquiries set organisation = 'Changed Organisation' where id = '50000000-0000-4000-8000-000000000001';
select cmp_ok(
  (select updated_at from public.enquiries where id = '50000000-0000-4000-8000-000000000001'),
  '>',
  '2000-01-01'::timestamptz,
  'T-DB-4 updating an enquiry changes updated_at'
);

update public.milestones set updated_at = '2000-01-01' where id = '30000000-0000-4000-8000-000000000001';
select cmp_ok(
  (select updated_at from public.milestones where id = '30000000-0000-4000-8000-000000000001'),
  '>',
  '2000-01-01'::timestamptz,
  'T-DB-4 updating a milestone changes updated_at'
);

update public.proposals set updated_at = '2000-01-01' where id = '20000000-0000-4000-8000-0000000000a2';
select cmp_ok(
  (select updated_at from public.proposals where id = '20000000-0000-4000-8000-0000000000a2'),
  '>',
  '2000-01-01'::timestamptz,
  'T-DB-4 updating a proposal changes updated_at'
);

-- T-DB-7 and T-DB-8
select throws_ok(
  $$insert into public.proposals (enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline)
    values ('10000000-0000-4000-8000-0000000000a2', 'Second', 'Scope', 'Deliverables', 'Assumptions', 'Exclusions', 'Six weeks')$$,
  '23505', null, 'T-DB-7 a second proposal for one enquiry is rejected'
);
select throws_ok(
  $$delete from public.service_categories where slug = 'automation'$$,
  '23503', null, 'T-DB-8 a used category cannot be deleted'
);

select * from finish();
rollback;
