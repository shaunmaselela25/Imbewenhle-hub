begin;
create extension if not exists pgtap with schema extensions;
select plan(3);

select is(
  (select array_agg(c.relname::text order by c.relname)
   from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r'),
  array['audit_events', 'enquiries', 'milestones', 'profiles', 'proposals', 'service_categories', 'updates'],
  'T-DB-10 the expected tables exist'
);

select is(
  (select string_agg(c.relname::text, ', ')
   from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity),
  null,
  'T-DB-10 every table has RLS enabled'
);

select is(
  (select string_agg(c.relname::text, ', ')
   from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r'
     and not exists (select 1 from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname)),
  null,
  'T-DB-10 every table has at least one policy'
);

select * from finish();
rollback;
