-- 공주네 데이터베이스 설정
-- Supabase 대시보드 → SQL Editor → New query 에 전체를 붙여 넣고 Run 한 번이면 끝나요.

-- 1) 테이블 ---------------------------------------------------------------

create table if not exists public.events (
  id         uuid primary key default gen_random_uuid(),
  owner      text not null check (owner in ('hj', 'gy')),
  date       date not null,
  at_time    text,                                   -- 'HH:MM', 비어 있으면 하루 종일
  title      text not null check (char_length(title) between 1 and 80),
  created_at timestamptz not null default now()
);

create table if not exists public.bucket_items (
  id         uuid primary key default gen_random_uuid(),
  owner      text not null check (owner in ('hj', 'gy')),
  body       text not null check (char_length(body) between 1 and 120),
  done       boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.anniversaries (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(title) between 1 and 40),
  date          date not null,
  repeat_yearly boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.menus (
  id         uuid primary key default gen_random_uuid(),
  owner      text not null check (owner in ('hj', 'gy')),
  name       text not null check (char_length(name) between 1 and 30),
  created_at timestamptz not null default now()
);

-- 처음 만난 날처럼 둘이 같이 쓰는 값 (항상 한 줄만 있어요)
create table if not exists public.couple_settings (
  id         int primary key default 1 check (id = 1),
  start_date date,
  created_at timestamptz not null default now()
);

-- 2) 보안 규칙 -------------------------------------------------------------
-- 로그인한 사람(= 둘이 만든 두 계정)만 읽고 쓸 수 있어요.
-- 회원가입을 꺼 두면 다른 사람은 계정을 만들 수 없으니 둘만 쓰게 돼요.

alter table public.events          enable row level security;
alter table public.bucket_items    enable row level security;
alter table public.anniversaries   enable row level security;
alter table public.menus           enable row level security;
alter table public.couple_settings enable row level security;

create policy "couple only" on public.events          for all to authenticated using (true) with check (true);
create policy "couple only" on public.bucket_items    for all to authenticated using (true) with check (true);
create policy "couple only" on public.anniversaries   for all to authenticated using (true) with check (true);
create policy "couple only" on public.menus           for all to authenticated using (true) with check (true);
create policy "couple only" on public.couple_settings for all to authenticated using (true) with check (true);

grant select, insert, update, delete on
  public.events, public.bucket_items, public.anniversaries, public.menus, public.couple_settings
  to authenticated;

-- 3) 실시간 반영 -----------------------------------------------------------
-- 한 사람이 바꾸면 다른 사람 화면에도 바로 보이게 해요.

alter publication supabase_realtime add table
  public.events, public.bucket_items, public.anniversaries, public.menus, public.couple_settings;
