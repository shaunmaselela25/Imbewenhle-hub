begin;
create extension if not exists pgtap with schema extensions;
select plan(3);

select results_eq(
  $$select slug::text from public.service_categories where is_active order by sort_order$$,
  array[
    'digital-it-advisory', 'automation', 'systems-integration',
    'migration', 'systems-software-development', 'technical-solutions-support'
  ],
  'T-DB-9 six active categories exist in FR-01 order'
);

select results_eq(
  $$select email::text, role::text from public.profiles order by email$$,
  $$values
    ('admin@imbewenhle.test'::text, 'admin'::text),
    ('client.a@example.test', 'client'),
    ('client.b@example.test', 'client'),
    ('consultant@imbewenhle.test', 'consultant')$$,
  'T-DB-9 four test accounts exist with the correct roles'
);

select results_eq(
  $$select public_reference::text, status::text from public.enquiries order by public_reference$$,
  $$values
    ('IMB-SEEDA00001'::text, 'new'::text),
    ('IMB-SEEDA00002', 'in_delivery'),
    ('IMB-SEEDB00001', 'awaiting_client'),
    ('IMB-SEEDX00001', 'new')$$,
  'T-DB-9 the four seed enquiries exist'
);

select * from finish();
rollback;
