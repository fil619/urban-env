# Urban Environments — Revenue Dashboard

A Vue 3 + Vuetify dashboard exercise: a KPI/analytics dashboard plus a filterable,
sortable, server-paginated records table, backed by a mocked REST API.

## Stack

- **Framework:** Vue 3 (Composition API, `<script setup>`) + Vite
- **UI Library:** Vuetify 4
- **State:** Pinia
- **Routing:** Vue Router
- **Charts:** ApexCharts (`vue3-apexcharts`)
- **Styling:** Vuetify theme + Tailwind CSS (utility classes) + SCSS overrides
- **Mock API:** Mock Service Worker (MSW) — intercepts `fetch` calls in the browser
- **Language:** TypeScript
- **Testing:** Vitest + Vue Test Utils + jsdom
- **Linting:** ESLint (flat config) with a small set of custom project rules, plus oxlint

## Setup Instructions

Requires Node.js 20+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/fil619/urban-env.git
cd urban-env

# 2. Install dependencies
npm install

# 3. Run the dev server (http://localhost:3000)
npm run dev
```

No environment variables or external services are required — all data comes from
the in-browser MSW mock API, which starts automatically in `src/main.ts`.

### Other scripts

```bash
npm run build        # type-check + production build
npm run preview       # preview the production build
npm run test          # run the test suite once (Vitest)
npm run test:watch    # run tests in watch mode
npm run type-check     # vue-tsc project-wide type check
npm run lint          # ESLint
npm run lint:fix       # ESLint with autofix
```

## Project Structure

```
src/
├─ components/          # Reusable UI: header, navigation, shared cards
├─ layout/               # Page shells (dashboard chrome vs. blank/error pages)
├─ views/
│  ├─ dashboard/         # KPI cards + charts, each chart is its own component
│  └─ records/           # Server-driven records data table + toolbar filters
├─ stores/               # Pinia stores (one per domain: dashboard, records,
│                         #  notifications, config)
├─ router/               # Route definitions, split into main/public route groups
├─ mocks/                # MSW request handlers + generated mock dataset
├─ plugins/              # Vuetify setup, registered on app bootstrap
├─ styles/               # Theme variables, Vuetify overrides, Tailwind entry
└─ test/                 # Vitest specs, mirroring the src/ structure
```

## Architecture Decisions

Ordered roughly by impact:

- **Server-side pagination/sorting/filtering.** The records table
  (`v-data-table-server`) sends paging, sorting, search, and filters to the
  mock API as query params instead of fetching everything and slicing
  client-side — only one page of data ever hits the network or memory, so it
  stays fast as the dataset grows, and it's a drop-in swap for a real backend.
- **Container / Presentational split.** Pages own all logic (store calls,
  filter/pagination state); child components (`ToolBar.vue`, `RevenueTrend.vue`,
  etc.) are pure props-in/events-out, with no store access of their own.
- **Domain-scoped Pinia stores.** State is split by domain (`dashboard`,
  `records`, `notifications`, `config`) instead of one global store, so each
  store's data and loading/error state stay independent.
- **Request de-duplication and staleness guards.** Stores tag each fetch with a
  request ID keyed by its query, so an unchanged query doesn't re-fetch and a
  slow, stale response can't clobber a newer one when filters change quickly.
- **MSW for the mock API.** Intercepts real `fetch` calls at the network layer
  (same handlers in the browser and in tests), so the data layer is realistic
  and HTTP-shaped from the start, with no separate "test mode" path.
- **Debounced search.** The records search input debounces 500ms before
  triggering a request, instead of firing one per keystroke.
- **ESLint enforced strictly.** `typescript-eslint`'s strict rules, project
  custom rules (`eslint-rules/`), and `oxlint` all run on lint — conventions
  are settled by a failing lint, not a review comment.
- **Colocated tests.** `src/test/` mirrors `src/`, one spec per
  component/store, with a shared `mountWithPlugins` helper for setup.
- **Consistent component shape.** `<script setup lang="ts">` above
  `<template>`; props/emits use the compile-time macros
  (`defineProps<{...}>()`, call-signature `defineEmits<{ (e: "x"): void }>()`)
  instead of runtime option objects.
- **Naming conventions.** PascalCase component files, camelCase variables/
  functions, kebab-case component tags in templates (`<router-link>`,
  `<ui-title-card>`) to match Vuetify's own `<v-btn>`-style usage.
- **Vuetify + Tailwind together.** Vuetify for components/theming; Tailwind for
  one-off utility classes where a full Vuetify prop would be overkill.

## Known Limitations

- The mock dataset (`src/mocks/generateRecords.ts`) is generated client-side —
  there's no real persistence or backend.
- KPI percentage-change values in `handlers.ts` are placeholder figures, not
  computed period-over-period deltas.
