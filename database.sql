create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default U&'\672A\547D\540D\7B80\5386',
  template_key text not null default 'classic'
    check (template_key in ('classic', 'modern', 'minimal')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx
on public.resumes(user_id);

create index if not exists resumes_user_updated_at_idx
on public.resumes(user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists resumes_set_updated_at on public.resumes;

create trigger resumes_set_updated_at
before update on public.resumes
for each row
execute function public.set_updated_at();

alter table public.resumes enable row level security;

drop policy if exists "Users can read own resumes" on public.resumes;
create policy "Users can read own resumes"
on public.resumes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own resumes" on public.resumes;
create policy "Users can create own resumes"
on public.resumes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own resumes" on public.resumes;
create policy "Users can update own resumes"
on public.resumes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
