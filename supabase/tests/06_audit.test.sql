begin;
create extension if not exists pgtap with schema extensions;
select * from no_plan();

-- Sipho (consultant)
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);

-- T-BR11-1
select public.change_enquiry_status('IMB-SEEDA00001', 'under_review');
create temp table status_events as
  select * from public.audit_events
  where entity_type = 'enquiry'
    and entity_id = '10000000-0000-4000-8000-0000000000a1'
    and action = 'status_changed';

select is((select count(*)::int from status_events), 1, 'T-BR11-1 one audit event exists');
select is((select actor_id from status_events), '00000000-0000-4000-8000-000000000002'::uuid, 'T-BR11-1 the actor is Sipho');
select is((select details from status_events), '{"from":"new","to":"under_review"}'::jsonb, 'T-BR11-1 the event records from and to');
select isnt((select "timestamp" from status_events), null, 'T-BR11-1 the event has a timestamp');

-- T-BR11-2
insert into public.proposals (enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline)
values ('10000000-0000-4000-8000-0000000000a1', 'Title', 'Scope', 'Deliverables', 'Assumptions', 'Exclusions', 'Six weeks');
update public.proposals set title = 'New title' where enquiry_id = '10000000-0000-4000-8000-0000000000a1';

create temp table proposal_events as
  select * from public.audit_events
  where entity_type = 'proposal'
    and entity_id = (select id from public.proposals where enquiry_id = '10000000-0000-4000-8000-0000000000a1');

select is((select count(*)::int from proposal_events where action = 'created'), 1, 'T-BR11-2 a created event exists');
select is((select count(*)::int from proposal_events where action = 'updated'), 1, 'T-BR11-2 an updated event exists');
select is((select details->'changed' from proposal_events where action = 'updated'), '["title"]'::jsonb, 'T-BR11-2 the updated event lists the changed fields');
select ok((select details->'changed' ? 'scope' from proposal_events where action = 'created'), 'T-BR11-2 the created event lists the fields');

-- T-BR11-3
insert into public.milestones (id, enquiry_id, name, target_date)
values ('30000000-0000-4000-8000-000000000099', '10000000-0000-4000-8000-0000000000a2', 'Audit milestone', current_date);
update public.milestones set status = 'in_progress' where id = '30000000-0000-4000-8000-000000000099';
delete from public.milestones where id = '30000000-0000-4000-8000-000000000099';

select results_eq(
  $$select action from public.audit_events
    where entity_type = 'milestone' and entity_id = '30000000-0000-4000-8000-000000000099'
    order by array_position(array['created','updated','deleted'], action)$$,
  array['created', 'updated', 'deleted'],
  'T-BR11-3 milestone insert, update and delete are each audited'
);

-- T-BR11-4: Thandi (admin) changes Pieter's role
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select public.set_user_role('00000000-0000-4000-8000-00000000000b', 'consultant');
select is(
  (select details from public.audit_events
   where entity_type = 'profile' and action = 'role_changed' and entity_id = '00000000-0000-4000-8000-00000000000b'
     and actor_id = '00000000-0000-4000-8000-000000000001'),
  '{"from":"client","to":"consultant"}'::jsonb,
  'T-BR11-4 a role_changed event exists'
);

-- T-BR11-5
insert into public.service_categories (id, slug, title, description)
values ('70000000-0000-4000-8000-000000000001', 'audit-service', 'Audit service', 'A service used in audit tests.');
update public.service_categories set title = 'Audit service two' where id = '70000000-0000-4000-8000-000000000001';

select is(
  (select count(*)::int from public.audit_events where entity_type = 'service_category' and entity_id = '70000000-0000-4000-8000-000000000001' and action = 'created'),
  1, 'T-BR11-5 a category insert is audited'
);
select is(
  (select count(*)::int from public.audit_events where entity_type = 'service_category' and entity_id = '70000000-0000-4000-8000-000000000001' and action = 'updated'),
  1, 'T-BR11-5 a category update is audited'
);

select * from finish();
rollback;
