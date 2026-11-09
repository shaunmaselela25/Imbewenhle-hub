begin;
create extension if not exists pgtap with schema extensions;
select plan(1);

select has_extension('extensions', 'pgcrypto', 'T-SETUP-3 pgcrypto is installed');

select * from finish();
rollback;
