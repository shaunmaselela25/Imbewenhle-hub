begin;
create extension if not exists pgtap with schema extensions;
select plan(3);

create temp table refs as
  select public.generate_public_reference() as reference
  from generate_series(1, 1000);

select is(
  (select count(*)::int from refs where reference ~ '^IMB-[0-9A-HJKMNP-TV-Z]{10}$'),
  1000,
  'T-BR1-1 every generated reference matches the format'
);

select is(
  (select count(distinct reference)::int from refs),
  1000,
  'T-BR1-1 every generated reference is unique'
);

create temp table back_to_back as
  select public.generate_public_reference() as first_reference,
         public.generate_public_reference() as second_reference;

select cmp_ok(
  (select count(*)::int
   from back_to_back, generate_series(5, 14) as position
   where substr(first_reference, position, 1) <> substr(second_reference, position, 1)),
  '>=',
  5,
  'T-BR1-2 back-to-back references share no sequential pattern'
);

select * from finish();
rollback;
