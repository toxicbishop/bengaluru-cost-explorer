## Copilot / AI assistant instructions for bengaluru-cost-explorer

Target: Quickly become productive in this repo. Keep suggestions precise, edit code in-place, and prefer minimal, low-risk changes.

- Big picture
  - Single-page React app (Vite + TypeScript) that visualizes cost-of-living data for Bengaluru.
  - Frontend fetches data from a Supabase edge function at: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cost-of-living` (see `supabase/functions/cost-of-living/index.ts`).
  - Auth is handled client-side via `@supabase/supabase-js` (see `src/integrations/supabase/client.ts` and `src/pages/Index.tsx`).
  - UI uses Tailwind + shadcn / Radix-based components under `src/components` and `src/components/ui`.

- Key files to reference when editing or implementing features
  - App entry & routing: `src/main.tsx`, `src/App.tsx`
  - Data fetch + UX: `src/pages/Index.tsx` (search, filters, auth handling, uses the edge function)
  - Supabase client (auto-generated): `src/integrations/supabase/client.ts` — do NOT modify this file manually.
  - Supabase edge function (server logic): `supabase/functions/cost-of-living/index.ts` (Deno). Edit here for server-side data logic.
  - SQL migrations: `supabase/migrations/*.sql`
  - Components and patterns: `src/components/CostCharts.tsx`, `src/components/AreaSelector.tsx`, `src/components/CategoryCard.tsx`, `src/components/CostItem.tsx`

- Build / Dev / Debug flows (concrete commands)
  - Run dev server: `npm run dev` (also works with `pnpm`/`bun` if you prefer; project contains a `bun.lockb` but scripts are in `package.json`).
  - Production build: `npm run build`; preview production build: `npm run preview`.
  - Linting: `npm run lint` uses ESLint.
  - Environment variables needed at runtime: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (used directly by frontend fetch to call the edge function; set these in your local env or .env).

- Conventions and patterns to follow
  - Import alias `@/...` is used widely (e.g., `@/components`). Respect existing file locations and TypeScript path mappings.
  - UI components are small, presentational, and live in `src/components` (shared `ui` primitives under `src/components/ui`). Prefer composing these rather than creating duplicate primitives.
  - Data flow: frontend pages call the Supabase function (not direct DB access). If adding features that need server-side logic, extend the edge function(s) under `supabase/functions/` rather than leaking complex logic to the client.
  - Auth: session is persisted via the generated Supabase client (localStorage). Use `supabase.auth` helpers for sign-in/out and `onAuthStateChange` to subscribe to changes (see `Index.tsx`).

- Integration notes / gotchas
  - The cost-of-living API is an edge function implemented in Deno and intentionally allows public access (see `supabase/config.toml` — `verify_jwt = false`) so the frontend calls it using the publishable key. Confirm security before changing this behavior.
  - The frontend expects the edge function response shape: { success: boolean, data: CostItem[], summary: { areas: string[] } }. Follow that shape when editing server code.
  - The Supabase client file is generated; editing it locally will be overwritten by generation tools. If you need a change, update the generator or env used to create it.

- Small examples to copy/paste
  - Call the edge function (already used in `Index.tsx`):
    - fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cost-of-living?area=HSR Layout`, { headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` } })
  - Use supabase auth helper to sign out (pattern used in `Index.tsx`):
    - await supabase.auth.signOut(); // check error and show toast

- Safety and risk model
  - Prefer small, reversible frontend edits (UI tweaks, bug fixes) in a single commit.
  - For server code in `supabase/functions/*`, prefer adding tests or manual smoke checks if changing filtering/summary logic because these functions drive the primary dataset.
  - Do not commit secrets. Use environment variables for keys.

- Where to look for follow-ups
  - If you need more domain context (why numbers and categories exist), inspect `supabase/functions/cost-of-living/index.ts` (it contains the canonical dataset and filtering logic).
  - For styling or Tailwind tokens, see `tailwind.config.ts` and `src/index.css` / `App.css`.

If any of the above is unclear or you want the file to include extra sections (e.g., review checklist, commit conventions, or automated test commands), tell me which area to expand and I will iterate.
