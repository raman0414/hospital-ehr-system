create extension if not exists pgcrypto;

create table if not exists public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_staff_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.staff_profiles (id, email, full_name, approved)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_staff_user();

insert into public.staff_profiles (id, email, full_name, approved)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data ->> 'full_name', ''),
  true
from auth.users
on conflict (id) do nothing;

create or replace function public.is_approved_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_profiles
    where id = auth.uid()
      and approved = true
  );
$$;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_id_number text not null unique,
  name text not null,
  hospital_room text not null,
  sex text not null check (sex in ('Male', 'Female')),
  address text not null default '',
  email text not null default '',
  date_of_birth date,
  phone text not null default '',
  marital_status text not null default '',
  country text not null default '',
  religion text not null default '',
  admitting_diagnoses text not null default '',
  final_diagnoses text not null default '',
  health_insurance_provider text not null default '',
  emergency_contact_number text not null default '',
  history_of_present_illness text not null default '',
  parents_name text not null default '',
  parents_contact text not null default '',
  parents_address text not null default '',
  attending_physician text not null default '',
  nurse_by_shift jsonb not null default '{"morning":"","afternoon":"","night":""}'::jsonb,
  admitted_date date not null default current_date,
  is_icu boolean not null default false,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vital_signs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  date date not null default current_date,
  time time not null default localtime,
  weight numeric(6, 2) not null default 0 check (weight >= 0),
  temperature numeric(4, 1) not null default 36.5 check (temperature between 25 and 50),
  blood_pressure text not null default '',
  pulse_rate integer not null default 0 check (pulse_rate between 0 and 300),
  respiration_rate integer not null default 0 check (respiration_rate between 0 and 100),
  pain integer not null default 0 check (pain between 0 and 10),
  intake numeric(8, 2) not null default 0 check (intake >= 0),
  output numeric(8, 2) not null default 0 check (output >= 0),
  stool text not null default '',
  iv_fluid text not null default '',
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists patients_created_at_idx on public.patients (created_at desc);
create index if not exists vital_signs_patient_id_idx on public.vital_signs (patient_id);
create index if not exists vital_signs_created_at_idx on public.vital_signs (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_created_by_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.created_by = old.created_by;
  return new;
end;
$$;

drop trigger if exists patients_set_updated_at on public.patients;
create trigger patients_set_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

drop trigger if exists patients_keep_creator on public.patients;
create trigger patients_keep_creator
before update on public.patients
for each row execute function public.prevent_created_by_change();

drop trigger if exists vital_signs_keep_creator on public.vital_signs;
create trigger vital_signs_keep_creator
before update on public.vital_signs
for each row execute function public.prevent_created_by_change();

alter table public.staff_profiles enable row level security;
alter table public.patients enable row level security;
alter table public.vital_signs enable row level security;

drop policy if exists "Staff can read their own profile" on public.staff_profiles;
create policy "Staff can read their own profile"
on public.staff_profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Authenticated staff can read patients" on public.patients;
create policy "Authenticated staff can read patients"
on public.patients for select
to authenticated
using (public.is_approved_staff());

drop policy if exists "Authenticated staff can create patients" on public.patients;
create policy "Authenticated staff can create patients"
on public.patients for insert
to authenticated
with check (public.is_approved_staff() and created_by = auth.uid());

drop policy if exists "Authenticated staff can update patients" on public.patients;
create policy "Authenticated staff can update patients"
on public.patients for update
to authenticated
using (public.is_approved_staff())
with check (public.is_approved_staff());

drop policy if exists "Authenticated staff can delete patients" on public.patients;
create policy "Authenticated staff can delete patients"
on public.patients for delete
to authenticated
using (public.is_approved_staff());

drop policy if exists "Authenticated staff can read vital signs" on public.vital_signs;
create policy "Authenticated staff can read vital signs"
on public.vital_signs for select
to authenticated
using (public.is_approved_staff());

drop policy if exists "Authenticated staff can create vital signs" on public.vital_signs;
create policy "Authenticated staff can create vital signs"
on public.vital_signs for insert
to authenticated
with check (public.is_approved_staff() and created_by = auth.uid());

drop policy if exists "Authenticated staff can update vital signs" on public.vital_signs;
create policy "Authenticated staff can update vital signs"
on public.vital_signs for update
to authenticated
using (public.is_approved_staff())
with check (public.is_approved_staff());

drop policy if exists "Authenticated staff can delete vital signs" on public.vital_signs;
create policy "Authenticated staff can delete vital signs"
on public.vital_signs for delete
to authenticated
using (public.is_approved_staff());
