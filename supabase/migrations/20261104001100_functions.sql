create function public.submit_enquiry(p jsonb) returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_user_id constant uuid := auth.uid();
  v_name text := trim(p ->> 'name');
  v_organisation text := trim(p ->> 'organisation');
  v_email text := lower(trim(p ->> 'email'));
  v_problem text := trim(p ->> 'problem');
  v_outcome text := trim(p ->> 'outcome');
  v_urgency text := p ->> 'urgency';
  v_budget text := nullif(p ->> 'budget', '');
  v_key uuid;
  v_category_id uuid;
  v_enquiry_id uuid;
  v_reference text;
begin
  begin
    v_key := (p ->> 'idempotency_key')::uuid;
  exception when invalid_text_representation then
    raise exception 'invalid_input';
  end;

  if v_user_id is not null then
    select email into v_email from public.profiles where id = v_user_id;
    v_email := lower(v_email);
  end if;

  if v_key is null
    or coalesce(length(v_name), 0) not between 2 and 100
    or coalesce(length(v_organisation), 0) not between 2 and 150
    or coalesce(length(v_email), 0) not between 1 and 254
    or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    or coalesce(length(v_problem), 0) not between 30 and 3000
    or coalesce(length(v_outcome), 0) not between 10 and 1000
    or coalesce(v_urgency, '') not in ('low', 'medium', 'high')
    or (v_budget is not null and v_budget not in ('under_50k', '50k_150k', '150k_500k', 'over_500k', 'not_sure'))
  then
    raise exception 'invalid_input';
  end if;

  select id into v_category_id
  from public.service_categories
  where slug = p ->> 'category' and is_active;

  if v_category_id is null then
    raise exception 'category_unavailable';
  end if;

  -- One lock per email keeps BR9 and BR13 correct when requests arrive together.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_email, 0));

  select public_reference into v_reference from public.enquiries where idempotency_key = v_key;
  if v_reference is not null then
    return v_reference;
  end if;

  if (
    select count(*) from public.enquiries
    where lower(requester_email) = v_email and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'rate_limited';
  end if;

  insert into public.enquiries (
    idempotency_key, requester_id, requester_name, requester_email, organisation, category_id,
    problem_description, desired_outcome, urgency, budget_range
  ) values (
    v_key, v_user_id, v_name, v_email, v_organisation, v_category_id,
    v_problem, v_outcome, v_urgency, v_budget
  )
  on conflict (idempotency_key) do nothing
  returning id, public_reference into v_enquiry_id, v_reference;

  if v_enquiry_id is null then
    select public_reference into v_reference from public.enquiries where idempotency_key = v_key;
    return v_reference;
  end if;

  insert into public.audit_events (entity_type, entity_id, action)
  values ('enquiry', v_enquiry_id, 'created');

  return v_reference;
end;
$$;

create function public.change_enquiry_status(p_reference text, p_to text) returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_status text;
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  update public.enquiries
  set status = p_to
  where public_reference = p_reference
  returning status into v_status;

  if v_status is null then
    raise exception 'not_found';
  end if;

  return v_status;
end;
$$;

create function public.set_user_role(p_user uuid, p_role text) returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_role text;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  if p_role is null or p_role not in ('client', 'consultant', 'admin') then
    raise exception 'invalid_input';
  end if;

  update public.profiles set role = p_role where id = p_user returning role into v_role;

  if v_role is null then
    raise exception 'not_found';
  end if;

  return v_role;
end;
$$;

-- Clients cannot read an inactive category (SEC1), but their enquiries keep its title.
create function public.category_title(p_category_id uuid) returns text
language sql stable security definer set search_path = ''
as $$
  select title from public.service_categories where id = p_category_id;
$$;

create view public.client_enquiry_view with (security_invoker = true) as
  select
    e.id,
    e.public_reference,
    public.category_title(e.category_id) as category_title,
    e.problem_description,
    e.desired_outcome,
    e.urgency,
    e.budget_range,
    e.status,
    e.created_at,
    e.updated_at,
    latest.body as latest_update,
    latest.created_at as latest_update_at
  from public.enquiries e
  left join lateral (
    select u.body, u.created_at
    from public.updates u
    where u.enquiry_id = e.id and u.visibility = 'client'
    order by u.created_at desc
    limit 1
  ) latest on true;

revoke all on public.client_enquiry_view from anon, authenticated;
grant select on public.client_enquiry_view to authenticated;

-- Postgres grants new functions to everyone; only these are callable through the API.
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.category_title(uuid) to authenticated;
grant execute on function public.submit_enquiry(jsonb) to anon, authenticated;
grant execute on function public.change_enquiry_status(text, text) to authenticated;
grant execute on function public.set_user_role(uuid, text) to authenticated;
