begin;
create extension if not exists pgtap with schema extensions;
select * from no_plan();

create function public.t_payload(p jsonb default '{}') returns jsonb language sql as $$
  select jsonb_build_object(
    'name', 'Test Person',
    'organisation', 'Test Organisation',
    'email', 'submit@example.test',
    'category', 'automation',
    'problem', repeat('a', 30),
    'outcome', repeat('b', 10),
    'urgency', 'low',
    'idempotency_key', gen_random_uuid()
  ) || p;
$$;

select set_config('request.jwt.claims', '', true);
set local role anon;

-- BR9
create temp table first_call as
  select public.submit_enquiry(public.t_payload(jsonb_build_object('idempotency_key', '60000000-0000-4000-8000-000000000001'))) as reference;
create temp table second_call as
  select public.submit_enquiry(public.t_payload(jsonb_build_object('idempotency_key', '60000000-0000-4000-8000-000000000001'))) as reference;

select is((select reference from second_call), (select reference from first_call), 'T-BR9-1 both calls return the same reference');
select ok((select reference from first_call) ~ '^IMB-[0-9A-HJKMNP-TV-Z]{10}$', 'T-BR9-1 the reference matches the format');

reset role;
select is((select count(*)::int from public.enquiries where idempotency_key = '60000000-0000-4000-8000-000000000001'), 1, 'T-BR9-1 only one row exists');

-- T-DB-6
select is(
  (select actor_id from public.audit_events
   where entity_type = 'enquiry' and action = 'created'
     and entity_id = (select id from public.enquiries where idempotency_key = '60000000-0000-4000-8000-000000000001')),
  null,
  'T-DB-6 the created audit event has a null actor for anon'
);
select is(
  (select count(*)::int from public.audit_events
   where entity_type = 'enquiry' and action = 'created'
     and entity_id = (select id from public.enquiries where idempotency_key = '60000000-0000-4000-8000-000000000001')),
  1,
  'T-DB-6 exactly one created audit event exists'
);

-- BR13: five submissions an hour per email, ignoring case
set local role anon;
select lives_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'rate@example.test')))$$, 'T-BR13-1 submission 1');
select lives_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'RATE@example.test')))$$, 'T-BR13-1 submission 2');
select lives_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'rate@example.test')))$$, 'T-BR13-1 submission 3');
select lives_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'rate@example.test')))$$, 'T-BR13-1 submission 4');
select lives_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'rate@example.test')))$$, 'T-BR13-1 submission 5');
select throws_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'rate@example.test')))$$, 'P0001', 'rate_limited', 'T-BR13-1 the sixth submission fails');
select lives_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'other@example.test')))$$, 'T-BR13-1 a different email succeeds');

-- T-DB-5
reset role;
update public.service_categories set is_active = false where slug = 'migration';
set local role anon;
select throws_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('category', 'migration')))$$, 'P0001', 'category_unavailable', 'T-DB-5 an inactive category is rejected');
select throws_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('category', 'no-such-service')))$$, 'P0001', 'category_unavailable', 'T-DB-5 an unknown category is rejected');

-- Section 10.2: the function validates the same limits as the form
select throws_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('problem', repeat('a', 29))))$$, 'P0001', 'invalid_input', 'submit_enquiry rejects a short problem');
select throws_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'name@')))$$, 'P0001', 'invalid_input', 'submit_enquiry rejects a bad email');
select throws_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('urgency', 'urgent')))$$, 'P0001', 'invalid_input', 'submit_enquiry rejects a bad urgency');
select throws_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('budget', 'lots')))$$, 'P0001', 'invalid_input', 'submit_enquiry rejects a bad budget');
select throws_ok($$select public.submit_enquiry(public.t_payload(jsonb_build_object('idempotency_key', 'not-a-uuid')))$$, 'P0001', 'invalid_input', 'submit_enquiry rejects a bad idempotency key');

-- T-DB-3: Naledi (client A), trying to use another email
reset role;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  $$select public.submit_enquiry(public.t_payload(jsonb_build_object('email', 'someone.else@example.test', 'idempotency_key', '60000000-0000-4000-8000-000000000002')))$$,
  'T-DB-3 a signed-in client can submit'
);
reset role;
select is(
  (select requester_id from public.enquiries where idempotency_key = '60000000-0000-4000-8000-000000000002'),
  '00000000-0000-4000-8000-00000000000a'::uuid,
  'T-DB-3 requester_id is the signed-in user'
);
select is(
  (select requester_email from public.enquiries where idempotency_key = '60000000-0000-4000-8000-000000000002'),
  'client.a@example.test',
  'T-DB-3 requester_email is the signed-in user''s email'
);

select * from finish();
rollback;
