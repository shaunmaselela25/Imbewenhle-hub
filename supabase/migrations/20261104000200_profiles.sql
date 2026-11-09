create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text check (length(trim(name)) between 2 and 100),
  email text not null unique check (length(email) <= 254),
  role text not null default 'client' check (role in ('client', 'consultant', 'admin')),
  organisation text check (length(trim(organisation)) between 2 and 150),
  created_at timestamptz not null default now()
);

create function public.is_staff() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('consultant', 'admin')
  );
$$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- A magic-link user is inserted unconfirmed and confirmed by a later update, so
-- earlier enquiries link only once the email address is proven (BR4).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.profiles (id, email) values (new.id, new.email);
  end if;

  if new.email_confirmed_at is not null then
    update public.enquiries
    set requester_id = new.id
    where requester_id is null and lower(requester_email) = lower(new.email);
  end if;

  return new;
end;
$$;

create trigger handle_new_user
after insert or update of email_confirmed_at on auth.users
for each row execute function public.handle_new_user();
