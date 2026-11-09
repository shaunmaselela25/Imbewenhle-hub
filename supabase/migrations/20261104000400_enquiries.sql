create function public.generate_public_reference() returns text
language plpgsql volatile set search_path = ''
as $$
declare
  alphabet constant text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  random_bytes bytea;
  candidate text;
begin
  loop
    random_bytes := extensions.gen_random_bytes(10);
    candidate := 'IMB-';
    for position in 0..9 loop
      candidate := candidate || substr(alphabet, (get_byte(random_bytes, position) & 31) + 1, 1);
    end loop;
    exit when not exists (select 1 from public.enquiries where public_reference = candidate);
  end loop;
  return candidate;
end;
$$;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique default public.generate_public_reference()
    check (public_reference ~ '^IMB-[0-9A-HJKMNP-TV-Z]{10}$'),
  idempotency_key uuid not null unique,
  requester_id uuid references public.profiles (id) on delete set null,
  requester_name text not null check (length(trim(requester_name)) between 2 and 100),
  requester_email text not null check (
    length(requester_email) <= 254
    and requester_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ),
  organisation text not null check (length(trim(organisation)) between 2 and 150),
  category_id uuid not null references public.service_categories (id) on delete restrict,
  problem_description text not null check (length(trim(problem_description)) between 30 and 3000),
  desired_outcome text not null check (length(trim(desired_outcome)) between 10 and 1000),
  urgency text not null check (urgency in ('low', 'medium', 'high')),
  budget_range text check (budget_range in ('under_50k', '50k_150k', '150k_500k', 'over_500k', 'not_sure')),
  status text not null default 'new' check (
    status in ('new', 'under_review', 'awaiting_client', 'proposal_prepared', 'accepted', 'in_delivery', 'completed', 'closed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_status_created_at_idx on public.enquiries (status, created_at desc);
create index enquiries_category_created_at_idx on public.enquiries (category_id, created_at desc);
create index enquiries_requester_id_idx on public.enquiries (requester_id);
create index enquiries_requester_email_idx on public.enquiries (lower(requester_email));
create index enquiries_organisation_trgm_idx on public.enquiries using gin (organisation extensions.gin_trgm_ops);
create index enquiries_requester_name_trgm_idx on public.enquiries using gin (requester_name extensions.gin_trgm_ops);

create function public.set_updated_at() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger set_updated_at
before update on public.enquiries
for each row execute function public.set_updated_at();
