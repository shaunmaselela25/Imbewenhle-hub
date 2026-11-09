alter table public.profiles enable row level security;
alter table public.service_categories enable row level security;
alter table public.enquiries enable row level security;
alter table public.updates enable row level security;
alter table public.proposals enable row level security;
alter table public.milestones enable row level security;
alter table public.audit_events enable row level security;

-- Supabase grants every table to anon and authenticated by default. Only the access
-- each role needs is granted back, so anything not listed here is denied outright.
revoke all on all tables in schema public from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (name, organisation) on public.profiles to authenticated;
grant select on public.service_categories to anon, authenticated;
grant insert, update on public.service_categories to authenticated;
grant select on public.enquiries to authenticated;
grant select, insert on public.updates to authenticated;
grant select, insert, update on public.proposals to authenticated;
grant select, insert, update, delete on public.milestones to authenticated;
grant select on public.audit_events to authenticated;

create policy profiles_read on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_staff());

create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy categories_read on public.service_categories
  for select to anon, authenticated
  using (is_active or public.is_staff());

create policy categories_admin_write on public.service_categories
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy enquiries_read on public.enquiries
  for select to authenticated
  using (requester_id = (select auth.uid()) or public.is_staff());

create policy updates_read on public.updates
  for select to authenticated
  using (
    public.is_staff()
    or (
      visibility = 'client'
      and exists (
        select 1 from public.enquiries e
        where e.id = enquiry_id and e.requester_id = (select auth.uid())
      )
    )
  );

create policy updates_insert on public.updates
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (
      public.is_staff()
      or (
        visibility = 'client'
        and exists (
          select 1 from public.enquiries e
          where e.id = enquiry_id
            and e.requester_id = (select auth.uid())
            and e.status = 'awaiting_client'
        )
      )
    )
  );

create policy proposals_read on public.proposals
  for select to authenticated
  using (
    public.is_staff()
    or (
      decision_status <> 'draft'
      and exists (
        select 1 from public.enquiries e
        where e.id = enquiry_id and e.requester_id = (select auth.uid())
      )
    )
  );

create policy proposals_staff_write on public.proposals
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy milestones_read on public.milestones
  for select to authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.enquiries e
      where e.id = enquiry_id and e.requester_id = (select auth.uid())
    )
  );

create policy milestones_staff_write on public.milestones
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy audit_read on public.audit_events
  for select to authenticated
  using (public.is_staff());
