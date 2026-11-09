begin;
create extension if not exists pgtap with schema extensions;
select plan(6);

create function public.t_new_user(p_id uuid, p_email text, p_confirmed boolean) returns void language sql as $$
  insert into auth.users (id, instance_id, aud, role, email, email_confirmed_at)
  values (p_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', p_email, case when p_confirmed then now() end);
$$;

create function public.t_anonymous_enquiry(p_email text) returns uuid language sql as $$
  insert into public.enquiries (
    idempotency_key, requester_name, requester_email, organisation, category_id,
    problem_description, desired_outcome, urgency
  ) values (
    gen_random_uuid(), 'Test Person', p_email, 'Test Organisation',
    (select id from public.service_categories where slug = 'automation'),
    repeat('a', 30), repeat('b', 10), 'low'
  ) returning id;
$$;

-- T-DB-1
select public.t_new_user('80000000-0000-4000-8000-000000000001', 'new.user@example.test', true);
select is(
  (select role from public.profiles where id = '80000000-0000-4000-8000-000000000001'),
  'client',
  'T-DB-1 a new auth user gets a client profile'
);

-- T-DB-2: an unconfirmed sign-up must not gain access to the enquiry
create temp table linked as select public.t_anonymous_enquiry('x@example.test') as id;
select public.t_new_user('80000000-0000-4000-8000-000000000002', 'x@example.test', false);
select is(
  (select requester_id from public.enquiries where id = (select id from linked)),
  null,
  'T-DB-2 an unconfirmed email does not link the enquiry'
);

update auth.users set email_confirmed_at = now() where id = '80000000-0000-4000-8000-000000000002';
select is(
  (select requester_id from public.enquiries where id = (select id from linked)),
  '80000000-0000-4000-8000-000000000002'::uuid,
  'T-DB-2 confirming the email links the enquiry'
);

create temp table confirmed_at_signup as select public.t_anonymous_enquiry('Y@example.test') as id;
select public.t_new_user('80000000-0000-4000-8000-000000000003', 'y@example.test', true);
select is(
  (select requester_id from public.enquiries where id = (select id from confirmed_at_signup)),
  '80000000-0000-4000-8000-000000000003'::uuid,
  'T-DB-2 a user confirmed at sign-up is linked, ignoring case'
);

-- T-EDGE-9: Thandi is the only admin
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select throws_ok(
  $$select public.set_user_role('00000000-0000-4000-8000-000000000001', 'consultant')$$,
  'P0001', 'last_admin', 'T-EDGE-9 the last admin cannot be demoted'
);
select is(
  (select role from public.profiles where id = '00000000-0000-4000-8000-000000000001'),
  'admin',
  'T-EDGE-9 the last admin keeps the role'
);

select * from finish();
rollback;
