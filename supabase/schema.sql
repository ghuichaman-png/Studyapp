-- =====================================================================
--  ACREDITACIÓN HOSPITALARIA · Esquema de base de datos (Supabase)
--  Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- ---------- EXTENSIONES ----------
create extension if not exists "pgcrypto";

-- ---------- TABLAS ----------

-- Perfiles (1:1 con auth.users). role = 'admin' | 'player'
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade unique,
  username    text not null,
  role        text not null default 'player' check (role in ('admin', 'player')),
  last_login  timestamptz,
  created_at  timestamptz not null default now()
);

-- Temas
create table if not exists public.topics (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  color        text default '#1e3a5f',
  order_index  int  not null default 0,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);

-- Resumen / contenido educativo por tema
create table if not exists public.content_summaries (
  id          uuid primary key default gen_random_uuid(),
  topic_id    uuid not null references public.topics (id) on delete cascade,
  body_text   text,
  updated_at  timestamptz not null default now()
);

-- Flashcards
create table if not exists public.flashcards (
  id           uuid primary key default gen_random_uuid(),
  topic_id     uuid not null references public.topics (id) on delete cascade,
  front        text not null,
  back         text not null,
  order_index  int  not null default 0
);

-- Imágenes por tema
create table if not exists public.topic_images (
  id           uuid primary key default gen_random_uuid(),
  topic_id     uuid not null references public.topics (id) on delete cascade,
  url          text not null,
  title        text,
  order_index  int  not null default 0
);

-- PDFs por tema
create table if not exists public.topic_pdfs (
  id           uuid primary key default gen_random_uuid(),
  topic_id     uuid not null references public.topics (id) on delete cascade,
  url          text not null,
  filename     text not null,
  order_index  int  not null default 0
);

-- Banco de preguntas
create table if not exists public.questions (
  id              uuid primary key default gen_random_uuid(),
  topic_id        uuid not null references public.topics (id) on delete cascade,
  text            text not null,
  option_a        text not null,
  option_b        text not null,
  option_c        text not null,
  option_d        text not null,
  correct_option  text not null check (correct_option in ('a','b','c','d')),
  difficulty      text not null default 'basic'
                    check (difficulty in ('basic','intermediate','advanced')),
  explanation     text not null,
  created_at      timestamptz not null default now()
);

-- Sesiones de juego (rondas de trivia)
create table if not exists public.game_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  topic_id         uuid references public.topics (id) on delete set null,
  difficulty       text not null check (difficulty in ('basic','intermediate','advanced')),
  score            int  not null default 0,
  total_questions  int  not null default 0,
  correct_answers  int  not null default 0,
  streak_max       int  not null default 0,
  completed_at     timestamptz not null default now()
);

-- Catálogo de insignias
create table if not exists public.badges (
  id                    uuid primary key default gen_random_uuid(),
  key                   text not null unique,
  name                  text not null,
  description           text,
  icon_emoji            text,
  condition_description text
);

-- Insignias desbloqueadas por usuario
create table if not exists public.user_badges (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  badge_key    text not null references public.badges (key) on delete cascade,
  unlocked_at  timestamptz not null default now(),
  unique (user_id, badge_key)
);

-- ---------- ÍNDICES ----------
create index if not exists idx_questions_topic       on public.questions (topic_id);
create index if not exists idx_questions_difficulty  on public.questions (difficulty);
create index if not exists idx_flashcards_topic      on public.flashcards (topic_id);
create index if not exists idx_sessions_user         on public.game_sessions (user_id);
create index if not exists idx_userbadges_user       on public.user_badges (user_id);

-- =====================================================================
--  FUNCIÓN AUXILIAR: ¿el usuario actual es admin?
--  SECURITY DEFINER evita recursión en las políticas de profiles.
-- =====================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- =====================================================================
--  ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles          enable row level security;
alter table public.topics            enable row level security;
alter table public.content_summaries enable row level security;
alter table public.flashcards        enable row level security;
alter table public.topic_images      enable row level security;
alter table public.topic_pdfs        enable row level security;
alter table public.questions         enable row level security;
alter table public.game_sessions     enable row level security;
alter table public.badges            enable row level security;
alter table public.user_badges       enable row level security;

-- ---------- PROFILES ----------
-- Cada usuario lee el propio; admin lee todos.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using ( user_id = auth.uid() or public.is_admin() );

-- Cada usuario inserta su propio perfil (al registrarse).
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check ( user_id = auth.uid() );

-- Cada usuario actualiza el propio (p.ej. last_login); admin actualiza todos.
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using ( user_id = auth.uid() or public.is_admin() );

-- ---------- TEMAS / CONTENIDO / PREGUNTAS ----------
-- Lectura: cualquier usuario autenticado. Escritura: solo admin.
do $$
declare t text;
begin
  foreach t in array array[
    'topics','content_summaries','flashcards',
    'topic_images','topic_pdfs','questions'
  ]
  loop
    execute format('drop policy if exists %I_select on public.%I;', t, t);
    execute format(
      'create policy %I_select on public.%I for select to authenticated using (true);', t, t);

    execute format('drop policy if exists %I_write on public.%I;', t, t);
    execute format(
      'create policy %I_write on public.%I for all using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;

-- ---------- GAME_SESSIONS ----------
-- Cada usuario escribe/lee las propias; admin lee todas.
drop policy if exists sessions_select on public.game_sessions;
create policy sessions_select on public.game_sessions
  for select using ( user_id = auth.uid() or public.is_admin() );

drop policy if exists sessions_insert on public.game_sessions;
create policy sessions_insert on public.game_sessions
  for insert with check ( user_id = auth.uid() );

-- Admin puede borrar (reset de progreso); el usuario puede borrar las propias.
drop policy if exists sessions_delete on public.game_sessions;
create policy sessions_delete on public.game_sessions
  for delete using ( user_id = auth.uid() or public.is_admin() );

-- ---------- USER_BADGES ----------
drop policy if exists userbadges_select on public.user_badges;
create policy userbadges_select on public.user_badges
  for select using ( user_id = auth.uid() or public.is_admin() );

drop policy if exists userbadges_insert on public.user_badges;
create policy userbadges_insert on public.user_badges
  for insert with check ( user_id = auth.uid() );

drop policy if exists userbadges_delete on public.user_badges;
create policy userbadges_delete on public.user_badges
  for delete using ( user_id = auth.uid() or public.is_admin() );

-- ---------- BADGES (catálogo) ----------
-- Lectura para todos los autenticados; escritura solo admin.
drop policy if exists badges_select on public.badges;
create policy badges_select on public.badges
  for select to authenticated using (true);

drop policy if exists badges_write on public.badges;
create policy badges_write on public.badges
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
--  SEED: catálogo de insignias
-- =====================================================================
insert into public.badges (key, name, description, icon_emoji, condition_description) values
  ('first_round',   'Primera ronda',      'Completaste tu primera ronda de trivia.',        '🎯', 'Completar 1 ronda'),
  ('streak_5',      'En racha',           'Lograste 5 respuestas correctas seguidas.',      '🔥', 'Racha de 5'),
  ('streak_10',     'Imparable',          'Lograste 10 respuestas correctas seguidas.',     '⚡', 'Racha de 10'),
  ('perfect_round', 'Ronda perfecta',     'Acertaste las 10 preguntas de una ronda.',       '🏆', '10/10 en una ronda'),
  ('all_topics',    'Estudiante modelo',  'Estudiaste todos los temas disponibles.',        '📚', 'Estudiar todos los temas'),
  ('topic_master',  'Maestro del tema',   'Lograste ≥80% en dificultad Avanzado.',          '🌟', '≥80% en Avanzado'),
  ('fifty_q',       'Veterano',           'Respondiste 50 preguntas en total.',             '🚀', '50 preguntas respondidas'),
  ('points_1000',   'Élite',              'Acumulaste 1000 puntos o más.',                  '💎', 'Puntaje acumulado ≥1000')
on conflict (key) do nothing;
