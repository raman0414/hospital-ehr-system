create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  name text not null,
  dosage text not null,
  frequency text not null,
  start_date date not null default current_date,
  end_date date,
  prescribing_doctor text not null,
  notes text not null default '',
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  test_name text not null,
  date date not null default current_date,
  result_value text not null,
  reference_range text not null default '',
  unit text not null default '',
  notes text not null default '',
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists medications_patient_id_idx on public.medications (patient_id);
create index if not exists medications_created_at_idx on public.medications (created_at desc);

create index if not exists lab_results_patient_id_idx on public.lab_results (patient_id);
create index if not exists lab_results_created_at_idx on public.lab_results (created_at desc);

drop trigger if exists medications_set_updated_at on public.medications;
create trigger medications_set_updated_at
before update on public.medications
for each row execute function public.set_updated_at();

drop trigger if exists medications_keep_creator on public.medications;
create trigger medications_keep_creator
before update on public.medications
for each row execute function public.prevent_created_by_change();

drop trigger if exists lab_results_set_updated_at on public.lab_results;
create trigger lab_results_set_updated_at
before update on public.lab_results
for each row execute function public.set_updated_at();

drop trigger if exists lab_results_keep_creator on public.lab_results;
create trigger lab_results_keep_creator
before update on public.lab_results
for each row execute function public.prevent_created_by_change();

alter table public.medications enable row level security;
alter table public.lab_results enable row level security;

-- Policies for medications
drop policy if exists "Authenticated staff can read medications" on public.medications;
create policy "Authenticated staff can read medications"
on public.medications for select
to authenticated
using (public.is_approved_staff());

drop policy if exists "Authenticated staff can create medications" on public.medications;
create policy "Authenticated staff can create medications"
on public.medications for insert
to authenticated
with check (public.is_approved_staff() and created_by = auth.uid());

drop policy if exists "Authenticated staff can update medications" on public.medications;
create policy "Authenticated staff can update medications"
on public.medications for update
to authenticated
using (public.is_approved_staff())
with check (public.is_approved_staff());

drop policy if exists "Authenticated staff can delete medications" on public.medications;
create policy "Authenticated staff can delete medications"
on public.medications for delete
to authenticated
using (public.is_approved_staff());

-- Policies for lab_results
drop policy if exists "Authenticated staff can read lab_results" on public.lab_results;
create policy "Authenticated staff can read lab_results"
on public.lab_results for select
to authenticated
using (public.is_approved_staff());

drop policy if exists "Authenticated staff can create lab_results" on public.lab_results;
create policy "Authenticated staff can create lab_results"
on public.lab_results for insert
to authenticated
with check (public.is_approved_staff() and created_by = auth.uid());

drop policy if exists "Authenticated staff can update lab_results" on public.lab_results;
create policy "Authenticated staff can update lab_results"
on public.lab_results for update
to authenticated
using (public.is_approved_staff())
with check (public.is_approved_staff());

drop policy if exists "Authenticated staff can delete lab_results" on public.lab_results;
create policy "Authenticated staff can delete lab_results"
on public.lab_results for delete
to authenticated
using (public.is_approved_staff());
