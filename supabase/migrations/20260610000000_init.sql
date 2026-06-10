-- amatda initial schema

create extension if not exists "uuid-ossp";

-- users (Supabase Auth 연동)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'standard', 'pro')),
  created_at timestamptz not null default now()
);

-- packs (가방)
create table public.packs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  emoji text not null default '🎒',
  color text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- triggers (떠날 때 / 도착할 때)
create table public.triggers (
  id uuid primary key default uuid_generate_v4(),
  pack_id uuid not null references public.packs(id) on delete cascade,
  type text not null check (type in ('departure', 'arrival')),
  lat double precision,
  lng double precision,
  radius_meters int not null default 200,
  label text,
  reminder_note text,
  is_active bool not null default true,
  created_at timestamptz not null default now(),
  unique (pack_id, type)
);

-- items (챙길 것 — 트리거에 직속)
create table public.items (
  id uuid primary key default uuid_generate_v4(),
  trigger_id uuid not null references public.triggers(id) on delete cascade,
  name text not null,
  emoji text not null default '📦',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- notification_logs
create table public.notification_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  trigger_id uuid not null references public.triggers(id) on delete cascade,
  fired_at timestamptz not null default now(),
  acknowledged_at timestamptz
);

-- check_logs (체크리스트 체크 기록)
create table public.check_logs (
  id uuid primary key default uuid_generate_v4(),
  notification_log_id uuid not null references public.notification_logs(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  checked_at timestamptz not null default now()
);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger packs_updated_at
  before update on public.packs
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.users enable row level security;
alter table public.packs enable row level security;
alter table public.triggers enable row level security;
alter table public.items enable row level security;
alter table public.notification_logs enable row level security;
alter table public.check_logs enable row level security;

-- RLS 정책: 본인 데이터만 접근
create policy "users: own row" on public.users
  for all using (auth.uid() = id);

create policy "packs: own" on public.packs
  for all using (auth.uid() = user_id);

create policy "triggers: own pack" on public.triggers
  for all using (
    exists (select 1 from public.packs where id = pack_id and user_id = auth.uid())
  );

create policy "items: own trigger" on public.items
  for all using (
    exists (
      select 1 from public.triggers t
      join public.packs p on p.id = t.pack_id
      where t.id = trigger_id and p.user_id = auth.uid()
    )
  );

create policy "notification_logs: own" on public.notification_logs
  for all using (auth.uid() = user_id);

create policy "check_logs: own notification" on public.check_logs
  for all using (
    exists (
      select 1 from public.notification_logs where id = notification_log_id and user_id = auth.uid()
    )
  );

-- 신규 유저 자동 생성 (Auth 회원가입 시)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
