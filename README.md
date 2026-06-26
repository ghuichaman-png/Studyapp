# 🏥 Acreditación Hospitalaria — App de preparación

Aplicación web para preparar la **acreditación hospitalaria** mediante estudio
de contenidos y trivia gamificada (puntos, rachas, niveles e insignias),
con ranking de equipo y panel de administración.

**Stack:** React + Vite + Tailwind CSS · Supabase (PostgreSQL + Auth + Storage) ·
React Router v6 · Supabase JS SDK v2.

---

## ✨ Funcionalidades

- **Autenticación** email + password (registro público de *jugadores*; admin manual).
- **Estudio** (`/study`): temas con 4 pestañas — Resumen (acordeón), Flashcards
  (flip CSS), Imágenes (lightbox) y PDFs (descarga).
- **Trivia** (`/trivia`): rondas de 10 preguntas, dificultad progresiva
  (Básico/Intermedio/Avanzado con desbloqueo por ≥80%), racha, puntos, feedback
  con explicación, resultados y **8 insignias**.
- **Ranking** (`/ranking`): clasificación del equipo por puntaje, con insignias y % de aciertos.
- **Admin** (`/admin`, solo `role = 'admin'`): CRUD de temas, contenido educativo,
  banco de preguntas (con import/export JSON) y gestión del equipo (con reset de progreso).

---

## 🚀 Puesta en marcha

### 1. Requisitos

- Node.js 18+ y npm
- Una cuenta gratuita en [Supabase](https://supabase.com)

### 2. Crear el proyecto Supabase y la base de datos

1. Crea un proyecto en el [Dashboard de Supabase](https://app.supabase.com).
2. Ve a **SQL Editor → New query**, pega el contenido de
   [`supabase/schema.sql`](supabase/schema.sql) y ejecútalo. Esto crea tablas,
   políticas RLS, la función `is_admin()` y el catálogo de insignias.
3. (Opcional) Ejecuta [`supabase/seed_example.sql`](supabase/seed_example.sql)
   para cargar 2 temas, 10 preguntas y 5 flashcards de ejemplo.

### 3. Variables de entorno

```bash
cp .env.example .env
```

Rellena `.env` con los valores de **Project Settings → API**:

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-public-key
```

> Nunca subas `.env` al repositorio. Usa solo claves `VITE_*` (públicas/anon).

### 4. Instalar y ejecutar

```bash
npm install
npm run dev
```

Abre la URL que indica Vite (por defecto `http://localhost:5173`).

---

## 👤 Crear el usuario administrador

El admin **no tiene registro público**. Para crearlo:

1. Abre la app y **regístrate normalmente** con el formulario de registro
   (esto crea un perfil con `role = 'player'`).
2. En el **Dashboard de Supabase → Table Editor → `profiles`**, localiza tu fila
   y cambia el campo `role` de `player` a **`admin`**. Guarda.
3. Cierra sesión y vuelve a entrar. Verás la pestaña **Admin** en la barra superior.

> Alternativa por SQL (reemplaza el email):
> ```sql
> update public.profiles set role = 'admin'
> where user_id = (select id from auth.users where email = 'admin@hospital.org');
> ```

### Confirmación de email

Por defecto Supabase puede exigir confirmar el correo. Para pruebas rápidas,
desactívalo en **Authentication → Providers → Email → "Confirm email"**.
Si lo dejas activado, el usuario debe confirmar antes de iniciar sesión.

---

## 🗄️ Modelo de datos (resumen)

| Tabla | Descripción |
|---|---|
| `profiles` | Perfil 1:1 con `auth.users`; `role` = `admin` \| `player`. |
| `topics` | Temas de estudio. |
| `content_summaries` | Texto de resumen por tema. |
| `flashcards` | Tarjetas frente/reverso. |
| `topic_images` / `topic_pdfs` | Galería e índice de PDFs por tema. |
| `questions` | Banco de preguntas (4 opciones, dificultad, explicación). |
| `game_sessions` | Resultado de cada ronda de trivia. |
| `badges` / `user_badges` | Catálogo de insignias y desbloqueos por usuario. |

**RLS aplicada:**
- `profiles`: cada usuario lee/edita el propio; el admin lee/edita todos.
- `topics`, `content_summaries`, `flashcards`, `topic_images`, `topic_pdfs`,
  `questions`, `badges`: lectura para autenticados; escritura solo admin.
- `game_sessions`, `user_badges`: cada usuario lee/escribe las propias; el admin
  las lee todas y puede borrarlas (reset de progreso).

---

## 🧮 Reglas de gamificación

- **Puntos base:** Básico = 10, Intermedio = 20, Avanzado = 30 por acierto.
- **Bonus de racha:** +5 puntos por cada acierto consecutivo (desde el 2.º en racha).
- **Hitos de racha:** mensajes de celebración a 3, 5 y 10 aciertos seguidos.
- **Desbloqueo de niveles:** Intermedio/Avanzado requieren ≥80% de aciertos en la
  dificultad anterior (calculado desde `game_sessions`).
- **Insignias:** 🎯 primera ronda · 🔥 racha 5 · ⚡ racha 10 · 🏆 ronda perfecta ·
  📚 todos los temas estudiados · 🌟 maestro de tema (≥80% avanzado) ·
  🚀 50 preguntas · 💎 1000 puntos.

---

## 📁 Estructura del proyecto

```
supabase/
  schema.sql            # DDL + RLS + seed de badges
  seed_example.sql      # datos de ejemplo
src/
  main.jsx, App.jsx, router.jsx
  index.css             # Tailwind + animaciones CSS (flip, fade, pop, shake)
  lib/supabaseClient.js
  contexts/AuthContext.jsx
  hooks/                # useAuth, useTopics, useQuestions, useBadges
  components/           # TopicCard, FlashCard, QuestionCard, BadgePopup,
                        #   ProgressBar, Navbar, ProtectedRoute
  pages/                # Login, Register, Study, Trivia, Ranking, Admin
  admin/                # paneles del admin (Temas, Contenido, Preguntas, Equipo)
.env.example
```

---

## ☁️ Despliegue (Vercel / Netlify)

1. Sube el repositorio a GitHub.
2. **Vercel:** *New Project* → importa el repo. Framework: **Vite**.
   Build command `npm run build`, output `dist`.
   **Netlify:** build `npm run build`, publish `dist`.
3. Añade las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
   en la configuración del proyecto.
4. **SPA routing:** para que las rutas (`/trivia`, etc.) funcionen al recargar:
   - *Netlify*: crea `public/_redirects` con `/*  /index.html  200`.
   - *Vercel*: añade `vercel.json` con un rewrite de `/(.*)` a `/index.html`.

---

## 📝 Notas

- Todas las llamadas usan el **SDK JS v2** de Supabase con manejo de carga/error.
- No se hardcodean credenciales: todo vía `import.meta.env.VITE_*`.
- El estado de "tema revisado" y "todos los temas estudiados" se guarda en
  `localStorage` del navegador (la insignia 📚 se valida con ese estado).
- Para imágenes/PDFs puedes pegar URLs públicas o usar **Supabase Storage**
  (crea un bucket público y pega la URL pública del archivo).
