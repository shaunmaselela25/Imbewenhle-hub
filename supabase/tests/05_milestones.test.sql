begin;
create extension if not exists pgtap with schema extensions;
select plan(2);

create function public.t_enquiry_at(p_status text) returns uuid language sql as $$
  insert into public.enquiries (
    idempotency_key, requester_name, requester_email, organisation, category_id,
    problem_description, desired_outcome, urgency, status
  ) values (
    gen_random_uuid(), 'Test Person', 'test@example.test', 'Test Organisation',
    (select id from public.service_categories where slug = 'automation'),
    repeat('a', 30), repeat('b', 10), 'low', p_status
  ) returning id;
$$;

select throws_ok(
  $$insert into public.milestones (enquiry_id, name, target_date) values (public.t_enquiry_at('under_review'), 'Kick-off', current_date)$$,
  'P0001', 'milestone_locked', 'T-BR10-1 a milestone is rejected before acceptance'
);

select lives_ok(
  $$insert into public.milestones (enquiry_id, name, target_date) values (public.t_enquiry_at('accepted'), 'Kick-off', current_date)$$,
  'T-BR10-2 a milestone is accepted on an accepted engagement'
);

select * from finish();
rollback;
