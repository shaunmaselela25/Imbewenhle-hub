begin;
create extension if not exists pgtap with schema extensions;
select * from no_plan();

create function public.t_anon() returns void language sql as $$
  select set_config('request.jwt.claims', '{"role":"anon"}', true);
  select set_config('role', 'anon', true);
$$;

create function public.t_as(p_id uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', p_id, 'role', 'authenticated')::text, true);
  select set_config('role', 'authenticated', true);
$$;

create function public.t_thandi() returns void language sql as $$ select public.t_as('00000000-0000-4000-8000-000000000001'); $$;
create function public.t_sipho() returns void language sql as $$ select public.t_as('00000000-0000-4000-8000-000000000002'); $$;
create function public.t_naledi() returns void language sql as $$ select public.t_as('00000000-0000-4000-8000-00000000000a'); $$;
create function public.t_pieter() returns void language sql as $$ select public.t_as('00000000-0000-4000-8000-00000000000b'); $$;

create function public.t_submit_payload() returns jsonb language sql as $$
  select jsonb_build_object(
    'name', 'Test Person', 'organisation', 'Test Organisation', 'email', 'permissions@example.test',
    'category', 'automation', 'problem', repeat('a', 30), 'outcome', repeat('b', 10), 'urgency', 'low',
    'idempotency_key', gen_random_uuid()
  );
$$;

insert into public.service_categories (slug, title, description, is_active)
values ('inactive-service', 'Inactive service', 'A service that is hidden from the public.', false);
insert into public.proposals (enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline)
values ('10000000-0000-4000-8000-0000000000a1', 'Draft proposal', 'Scope', 'Deliverables', 'Assumptions', 'Exclusions', 'Six weeks');

-- SEC1: read categories
select public.t_anon();
select is((select count(*)::int from public.service_categories where is_active), 6, 'T-SEC-1a anon reads active categories');
select is((select count(*)::int from public.service_categories where slug = 'inactive-service'), 0, 'T-SEC-1b anon cannot read inactive categories');
select public.t_naledi();
select is((select count(*)::int from public.service_categories where slug = 'inactive-service'), 0, 'T-SEC-1b client cannot read inactive categories');
select public.t_sipho();
select is((select count(*)::int from public.service_categories where slug = 'inactive-service'), 1, 'T-SEC-1a staff read inactive categories');

-- SEC2: create and update categories
select public.t_thandi();
select lives_ok($$insert into public.service_categories (slug, title, description) values ('admin-service', 'Admin service', 'A service created by an admin.')$$, 'T-SEC-2a admin creates a category');
select lives_ok($$update public.service_categories set title = 'Admin service two' where slug = 'admin-service'$$, 'T-SEC-2a admin updates a category');
select public.t_sipho();
select throws_ok($$insert into public.service_categories (slug, title, description) values ('consultant-service', 'Consultant service', 'A service created by a consultant.')$$, '42501', null, 'T-SEC-2b consultant cannot create a category');
update public.service_categories set title = 'Changed by consultant' where slug = 'automation';
select public.t_naledi();
select throws_ok($$insert into public.service_categories (slug, title, description) values ('client-service', 'Client service', 'A service created by a client.')$$, '42501', null, 'T-SEC-2b client cannot create a category');
update public.service_categories set title = 'Changed by client' where slug = 'automation';
select is((select title::text from public.service_categories where slug = 'automation'), 'Automation', 'T-SEC-2b consultant and client cannot update a category');

-- SEC3: categories are deactivated, never deleted
select public.t_thandi();
select lives_ok($$update public.service_categories set is_active = false where slug = 'admin-service'$$, 'T-SEC-3a admin deactivates a category');
select throws_ok($$delete from public.service_categories where slug = 'admin-service'$$, '42501', null, 'T-SEC-3b admin cannot delete a category');
select public.t_sipho();
select throws_ok($$delete from public.service_categories where slug = 'admin-service'$$, '42501', null, 'T-SEC-3b consultant cannot delete a category');

-- SEC4: enquiries are created only through submit_enquiry
select public.t_anon();
select lives_ok($$select public.submit_enquiry(public.t_submit_payload())$$, 'T-SEC-4a anon submits through submit_enquiry');
select throws_ok(
  $$insert into public.enquiries (idempotency_key, requester_name, requester_email, organisation, category_id, problem_description, desired_outcome, urgency)
    values (gen_random_uuid(), 'Test Person', 'direct@example.test', 'Test Organisation', '70000000-0000-4000-8000-000000000001', repeat('a', 30), repeat('b', 10), 'low')$$,
  '42501', null, 'T-SEC-4b anon cannot insert directly'
);
select public.t_sipho();
select throws_ok(
  $$insert into public.enquiries (idempotency_key, requester_name, requester_email, organisation, category_id, problem_description, desired_outcome, urgency)
    values (gen_random_uuid(), 'Test Person', 'direct@example.test', 'Test Organisation', '70000000-0000-4000-8000-000000000001', repeat('a', 30), repeat('b', 10), 'low')$$,
  '42501', null, 'T-SEC-4b staff cannot insert directly'
);

-- SEC5: read enquiries
select public.t_naledi();
select results_eq($$select public_reference::text from public.enquiries order by public_reference$$, array['IMB-SEEDA00001', 'IMB-SEEDA00002'], 'T-SEC-5a client reads only their own enquiries');
select is((select count(*)::int from public.enquiries where id = '10000000-0000-4000-8000-0000000000b1'), 0, 'T-SEC-5b client A cannot read B by id');
select is((select count(*)::int from public.enquiries where public_reference = 'IMB-SEEDB00001'), 0, 'T-SEC-5b client A cannot read B by reference');
select is((select count(*)::int from public.client_enquiry_view where public_reference = 'IMB-SEEDB00001'), 0, 'T-SEC-5b client A cannot read B through the view');
select public.t_anon();
select throws_ok($$select count(*) from public.enquiries$$, '42501', null, 'T-SEC-5b anon cannot read enquiries');
select public.t_sipho();
select cmp_ok((select count(*)::int from public.enquiries), '>=', 4, 'T-SEC-5a staff read all enquiries');

-- SEC21 column boundary used by client pages
select public.t_naledi();
select hasnt_column('public', 'client_enquiry_view', 'idempotency_key', 'client_enquiry_view hides idempotency_key');
select hasnt_column('public', 'client_enquiry_view', 'requester_id', 'client_enquiry_view hides requester_id');
select is((select count(*)::int from public.client_enquiry_view where latest_update ~ 'Internal'), 0, 'client_enquiry_view never shows an internal note as the latest update');

-- SEC6 and SEC7: status changes, and nothing else
select public.t_sipho();
select lives_ok($$select public.change_enquiry_status('IMB-SEEDA00001', 'under_review')$$, 'T-SEC-6a consultant changes status');
select lives_ok($$select public.change_enquiry_status('IMB-SEEDA00001', 'awaiting_client')$$, 'T-SEC-7a staff status change is still allowed');
select public.t_naledi();
select throws_ok($$select public.change_enquiry_status('IMB-SEEDA00001', 'closed')$$, 'P0001', 'forbidden', 'T-SEC-6b client cannot change status');
select public.t_anon();
select throws_ok($$select public.change_enquiry_status('IMB-SEEDA00001', 'closed')$$, '42501', null, 'T-SEC-6b anon cannot change status');
select public.t_naledi();
select throws_ok($$update public.enquiries set status = 'closed' where public_reference = 'IMB-SEEDA00001'$$, '42501', null, 'T-SEC-6b client cannot update status directly');
select throws_ok($$update public.enquiries set organisation = 'Changed' where public_reference = 'IMB-SEEDA00001'$$, '42501', null, 'T-SEC-7b client cannot edit fields');
select throws_ok($$delete from public.enquiries where public_reference = 'IMB-SEEDA00001'$$, '42501', null, 'T-SEC-7b client cannot delete');
select public.t_sipho();
select throws_ok($$update public.enquiries set organisation = 'Changed' where public_reference = 'IMB-SEEDA00001'$$, '42501', null, 'T-SEC-7b consultant cannot edit fields');
select throws_ok($$delete from public.enquiries where public_reference = 'IMB-SEEDA00001'$$, '42501', null, 'T-SEC-7b consultant cannot delete');
select public.t_thandi();
select throws_ok($$update public.enquiries set organisation = 'Changed' where public_reference = 'IMB-SEEDA00001'$$, '42501', null, 'T-SEC-7b admin cannot edit fields');
select throws_ok($$delete from public.enquiries where public_reference = 'IMB-SEEDA00001'$$, '42501', null, 'T-SEC-7b admin cannot delete');

-- SEC8 and SEC9: read updates
select public.t_naledi();
select is((select count(*)::int from public.updates where enquiry_id = '10000000-0000-4000-8000-0000000000a2' and visibility = 'client'), 1, 'T-SEC-8a owner reads client updates');
select is((select count(*)::int from public.updates where visibility = 'internal'), 0, 'T-SEC-9b owner gets no internal rows with a filter');
select is((select count(*)::int from public.updates where id = '40000000-0000-4000-8000-000000000002'), 0, 'T-SEC-9b owner gets no internal row by id');
select is((select count(*)::int from public.updates), 1, 'T-SEC-9b owner gets only client-visible rows without a filter');
select public.t_pieter();
select is((select count(*)::int from public.updates where enquiry_id = '10000000-0000-4000-8000-0000000000a2'), 0, 'T-SEC-8b client B cannot read A''s updates');
select public.t_sipho();
select is((select count(*)::int from public.updates where visibility = 'client' and enquiry_id = '10000000-0000-4000-8000-0000000000a2'), 1, 'T-SEC-8a staff read client updates');
select is((select count(*)::int from public.updates where visibility = 'internal'), 2, 'T-SEC-9a staff read internal notes');

-- SEC10: create updates
select public.t_sipho();
select lives_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-000000000002', 'internal', 'Staff note')$$, 'T-SEC-10a staff post an internal note');
select lives_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-000000000002', 'client', 'Staff update')$$, 'T-SEC-10a staff post a client update');
select public.t_pieter();
select lives_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-00000000000b', 'client', 'Client reply')$$, 'T-SEC-10a owner replies while awaiting client');
select throws_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-00000000000b', 'internal', 'Client note')$$, '42501', null, 'T-SEC-10b client cannot post internal');
select throws_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-00000000000b', 'client', 'Wrong enquiry')$$, '42501', null, 'T-SEC-10b client cannot post on another client''s enquiry');
select throws_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-000000000002', 'client', 'Spoofed author')$$, '42501', null, 'T-SEC-10b client cannot post as someone else');
select public.t_naledi();
select throws_ok($$insert into public.updates (enquiry_id, author_id, visibility, body) values ('10000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-00000000000a', 'client', 'Not awaiting')$$, '42501', null, 'T-SEC-10b client cannot reply unless awaiting client');

-- SEC11: read proposals
select public.t_sipho();
select is((select count(*)::int from public.proposals where enquiry_id = '10000000-0000-4000-8000-0000000000a1'), 1, 'T-SEC-11a staff read a draft');
select public.t_naledi();
select is((select count(*)::int from public.proposals where enquiry_id = '10000000-0000-4000-8000-0000000000a2'), 1, 'T-SEC-11a owner reads a non-draft proposal');
select is((select count(*)::int from public.proposals where enquiry_id = '10000000-0000-4000-8000-0000000000a1'), 0, 'T-SEC-11b draft is hidden from the owner');
select public.t_pieter();
select is((select count(*)::int from public.proposals), 0, 'T-SEC-11b another client cannot read the proposal');

-- SEC12: write proposals
select public.t_sipho();
select lives_ok($$update public.proposals set title = 'Staff title' where enquiry_id = '10000000-0000-4000-8000-0000000000a1'$$, 'T-SEC-12a staff update a proposal');
select lives_ok($$insert into public.proposals (enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline) values ('10000000-0000-4000-8000-0000000000b1', 'Staff proposal', 'Scope', 'Deliverables', 'Assumptions', 'Exclusions', 'Six weeks')$$, 'T-SEC-12a staff create a proposal');
select public.t_pieter();
select throws_ok($$insert into public.proposals (enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline) values ('10000000-0000-4000-8000-0000000000c1', 'Client proposal', 'Scope', 'Deliverables', 'Assumptions', 'Exclusions', 'Six weeks')$$, '42501', null, 'T-SEC-12b client cannot create a proposal');
select public.t_naledi();
update public.proposals set title = 'Client title' where enquiry_id = '10000000-0000-4000-8000-0000000000a2';
reset role;
select isnt((select title::text from public.proposals where enquiry_id = '10000000-0000-4000-8000-0000000000a2'), 'Client title', 'T-SEC-12b client cannot update a proposal');

-- SEC13: read milestones
select public.t_naledi();
select is((select count(*)::int from public.milestones where enquiry_id = '10000000-0000-4000-8000-0000000000a2'), 2, 'T-SEC-13a owner reads milestones');
select public.t_sipho();
select is((select count(*)::int from public.milestones where enquiry_id = '10000000-0000-4000-8000-0000000000a2'), 2, 'T-SEC-13a staff read milestones');
select public.t_pieter();
select is((select count(*)::int from public.milestones), 0, 'T-SEC-13b another client cannot read milestones');

-- SEC14: write milestones
select public.t_sipho();
select lives_ok($$insert into public.milestones (id, enquiry_id, name, target_date) values ('30000000-0000-4000-8000-000000000050', '10000000-0000-4000-8000-0000000000a2', 'Staff milestone', current_date)$$, 'T-SEC-14a staff create a milestone');
select lives_ok($$update public.milestones set status = 'completed' where id = '30000000-0000-4000-8000-000000000050'$$, 'T-SEC-14a staff update a milestone');
select lives_ok($$delete from public.milestones where id = '30000000-0000-4000-8000-000000000050'$$, 'T-SEC-14a staff delete a milestone');
select public.t_naledi();
select throws_ok($$insert into public.milestones (enquiry_id, name, target_date) values ('10000000-0000-4000-8000-0000000000a2', 'Client milestone', current_date)$$, '42501', null, 'T-SEC-14b client cannot create a milestone');
update public.milestones set name = 'Changed by client' where id = '30000000-0000-4000-8000-000000000001';
delete from public.milestones where id = '30000000-0000-4000-8000-000000000001';
reset role;
select is((select count(*)::int from public.milestones where id = '30000000-0000-4000-8000-000000000001' and name <> 'Changed by client'), 1, 'T-SEC-14b client cannot update or delete a milestone');

-- SEC15 and SEC16: audit events
select public.t_sipho();
select cmp_ok((select count(*)::int from public.audit_events where entity_type = 'enquiry' and action = 'status_changed'), '>=', 2, 'T-SEC-15a staff read audit events');
select cmp_ok((select count(*)::int from public.audit_events where entity_type = 'enquiry' and action = 'status_changed'), '>=', 1, 'T-SEC-16a trigger inserts succeed');
select public.t_naledi();
select is((select count(*)::int from public.audit_events), 0, 'T-SEC-15b client cannot read audit events');
select throws_ok($$insert into public.audit_events (entity_type, entity_id, action) values ('enquiry', gen_random_uuid(), 'created')$$, '42501', null, 'T-SEC-16b client cannot insert audit events');
select public.t_sipho();
select throws_ok($$insert into public.audit_events (entity_type, entity_id, action) values ('enquiry', gen_random_uuid(), 'created')$$, '42501', null, 'T-SEC-16b consultant cannot insert audit events');
select throws_ok($$update public.audit_events set action = 'deleted'$$, '42501', null, 'T-SEC-16b consultant cannot update audit events');
select throws_ok($$delete from public.audit_events$$, '42501', null, 'T-SEC-16b consultant cannot delete audit events');
select public.t_thandi();
select throws_ok($$insert into public.audit_events (entity_type, entity_id, action) values ('enquiry', gen_random_uuid(), 'created')$$, '42501', null, 'T-SEC-16b admin cannot insert audit events');
select throws_ok($$update public.audit_events set action = 'deleted'$$, '42501', null, 'T-SEC-16b admin cannot update audit events');
select throws_ok($$delete from public.audit_events$$, '42501', null, 'T-SEC-16b admin cannot delete audit events');

-- SEC17: read profiles
select public.t_naledi();
select results_eq($$select email::text from public.profiles$$, array['client.a@example.test'], 'T-SEC-17a and T-SEC-17b client reads only their own profile');
select is((select count(*)::int from public.profiles where id = '00000000-0000-4000-8000-00000000000b'), 0, 'T-SEC-17b client cannot read another profile');
select public.t_sipho();
select is((select count(*)::int from public.profiles), 4, 'T-SEC-17a staff read all profiles');

-- SEC18: update own profile
select public.t_naledi();
select lives_ok($$update public.profiles set name = 'Naledi K', organisation = 'Khumalo Group' where id = '00000000-0000-4000-8000-00000000000a'$$, 'T-SEC-18a client updates own name and organisation');
select throws_ok($$update public.profiles set role = 'admin' where id = '00000000-0000-4000-8000-00000000000a'$$, '42501', null, 'T-SEC-18b client cannot change own role');
update public.profiles set name = 'Changed by Naledi' where id = '00000000-0000-4000-8000-00000000000b';
reset role;
select isnt((select name::text from public.profiles where id = '00000000-0000-4000-8000-00000000000b'), 'Changed by Naledi', 'T-SEC-18b client cannot update another profile');

-- SEC19: role changes
select public.t_sipho();
select throws_ok($$select public.set_user_role('00000000-0000-4000-8000-00000000000b', 'consultant')$$, 'P0001', 'forbidden', 'T-SEC-19b consultant cannot change a role');
select public.t_naledi();
select throws_ok($$select public.set_user_role('00000000-0000-4000-8000-00000000000a', 'admin')$$, 'P0001', 'forbidden', 'T-SEC-19b client cannot change a role');
select public.t_thandi();
select lives_ok($$select public.set_user_role('00000000-0000-4000-8000-00000000000b', 'consultant')$$, 'T-SEC-19a admin changes a role');

reset role;
select is((select role::text from public.profiles where id = '00000000-0000-4000-8000-00000000000b'), 'consultant', 'T-SEC-19a the role is changed');

select * from finish();
rollback;
