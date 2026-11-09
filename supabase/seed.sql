-- Test data only (Section 8.7). Service descriptions come from the S1 Stitch design
-- (Section 18 #24).

insert into public.service_categories (slug, title, description, sort_order) values
  ('digital-it-advisory', 'Digital & IT Advisory', 'Strategic tech roadmap, enterprise architecture review, governance, and IT operating models aligned with enterprise vision.', 1),
  ('automation', 'Automation', 'Business process automation, RPA workflow assessments, operational efficiency matrices, and deterministic rule engines.', 2),
  ('systems-integration', 'Systems Integration', 'Robust API architecture, enterprise service bus (ESB) topology, seamless ERP/CRM connectivity, and legacy middleware unification.', 3),
  ('migration', 'Migration', 'Holistic cloud adoption strategy, bare-metal to cloud migrations, zero-downtime database replatforming, and microservices modernization.', 4),
  ('systems-software-development', 'Systems & Software Development', 'Bespoke web and mobile enterprise platforms, mission-critical business engines, test automation suites, and software quality engineering.', 5),
  ('technical-solutions-support', 'Technical Solutions & Support', 'Enterprise operational SLAs, mission-critical application maintenance, Level-3 incident triage, proactive telemetry, and health monitoring.', 6);

insert into auth.users (
  id, instance_id, aud, role, email, email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
select
  account.id::uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
  account.email, now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
  '', '', '', ''
from (values
  ('00000000-0000-4000-8000-000000000001', 'admin@imbewenhle.test'),
  ('00000000-0000-4000-8000-000000000002', 'consultant@imbewenhle.test'),
  ('00000000-0000-4000-8000-00000000000a', 'client.a@example.test'),
  ('00000000-0000-4000-8000-00000000000b', 'client.b@example.test')
) as account(id, email);

insert into auth.identities (id, user_id, provider_id, provider, identity_data, created_at, updated_at, last_sign_in_at)
select
  gen_random_uuid(), users.id, users.id::text, 'email',
  jsonb_build_object('sub', users.id::text, 'email', users.email, 'email_verified', true),
  now(), now(), now()
from auth.users as users;

update public.profiles set name = 'Thandi Mokoena', role = 'admin'
  where email = 'admin@imbewenhle.test';
update public.profiles set name = 'Sipho Dlamini', role = 'consultant'
  where email = 'consultant@imbewenhle.test';
update public.profiles set name = 'Naledi Khumalo', organisation = 'Khumalo Logistics'
  where email = 'client.a@example.test';
update public.profiles set name = 'Pieter van Wyk', organisation = 'Karoo Fresh Produce'
  where email = 'client.b@example.test';

insert into public.enquiries (
  id, public_reference, idempotency_key, requester_id, requester_name, requester_email, organisation,
  category_id, problem_description, desired_outcome, urgency, budget_range, status
)
select
  seed.id::uuid, seed.reference, seed.idempotency_key::uuid, seed.requester_id::uuid,
  seed.name, seed.email, seed.organisation,
  (select id from public.service_categories where slug = seed.slug),
  seed.problem, seed.outcome, seed.urgency, seed.budget, seed.status
from (values
  ('10000000-0000-4000-8000-0000000000a1', 'IMB-SEEDA00001', '90000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-00000000000a',
   'Naledi Khumalo', 'client.a@example.test', 'Khumalo Logistics', 'automation',
   'Our dispatch team copies orders between three spreadsheets every morning.', 'One automated daily order list.', 'medium', 'not_sure', 'new'),
  ('10000000-0000-4000-8000-0000000000a2', 'IMB-SEEDA00002', '90000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-00000000000a',
   'Naledi Khumalo', 'client.a@example.test', 'Khumalo Logistics', 'systems-integration',
   'Our warehouse system and accounting package do not share stock figures.', 'Stock figures that match in both systems.', 'high', '150k_500k', 'in_delivery'),
  ('10000000-0000-4000-8000-0000000000b1', 'IMB-SEEDB00001', '90000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-00000000000b',
   'Pieter van Wyk', 'client.b@example.test', 'Karoo Fresh Produce', 'migration',
   'We need to move our customer records from an old desktop database.', 'All customer records in the new system.', 'low', 'under_50k', 'awaiting_client'),
  ('10000000-0000-4000-8000-0000000000c1', 'IMB-SEEDX00001', '90000000-0000-4000-8000-000000000004', null,
   'Lindiwe Nkosi', 'anonymous.visitor@example.test', 'Nkosi Consulting', 'digital-it-advisory',
   'We are unsure which systems our growing team should be using.', 'A clear recommendation we can act on.', 'low', null, 'new')
) as seed(id, reference, idempotency_key, requester_id, name, email, organisation, slug, problem, outcome, urgency, budget, status);

insert into public.proposals (
  id, enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline, decision_status
) values (
  '20000000-0000-4000-8000-0000000000a2', '10000000-0000-4000-8000-0000000000a2',
  'Warehouse and accounting integration',
  'Connect the warehouse system to the accounting package.',
  'A tested integration and a handover document.',
  'Both systems provide API access.',
  'Replacing either system.',
  'Eight weeks',
  'accepted'
);

insert into public.milestones (id, enquiry_id, name, description, target_date, status) values
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-0000000000a2', 'Integration design', 'Agree the data mapping.', date '2026-12-01', 'completed'),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-0000000000a2', 'Integration go-live', 'Move the integration to production.', date '2027-01-31', 'in_progress');

insert into public.updates (id, enquiry_id, author_id, visibility, body) values
  ('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-000000000002', 'client', 'The integration design has been agreed.'),
  ('40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-000000000002', 'internal', 'Internal: the client API credentials expire in March.'),
  ('40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-000000000002', 'client', 'Please confirm how many customer records you have.'),
  ('40000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-000000000002', 'internal', 'Internal: check the size of the old database first.');
