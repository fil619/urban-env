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
- **Vite as the build tool.** It's the recommended build tool for Vue apps,
  that gives near-instant startup and HMR that stays fast as the app grows, 
  instead of bundling the whole app on every change.
- **Container / Presentational split.** Pages own all logic (store calls,
  filter/pagination state); child components (`ToolBar.vue`, `RevenueTrend.vue`,
  etc.) are pure props-in/events-out, with no store access of their own. 
  This makes the components reusable.
- **Server-side pagination/sorting/filtering.** The records table 
  sends paging, sorting, search, and filters to the
  mock API as query params instead of fetching everything and slicing
  client-side — only one page of data ever hits the network or memory, so it
  stays fast as the dataset grows.
- **ESLint enforced strictly.** `typescript-eslint`'s strict rules, project
  custom rules (`eslint-rules/`), and `oxlint` all run on lint — conventions
  are settled by a failing lint, not a review comment.
- **Consistent component shape.** `<script setup lang="ts">` above
  `<template>`; props/emits use the compile-time macros
  (`defineProps<{...}>()`, call-signature `defineEmits<{ (e: "x"): void }>()`)
  instead of runtime option objects.
- **Domain-scoped Pinia stores.** State is split by domain (`dashboard`,
  `records`, `notifications`, `config`) instead of one global store, so each
  store's data and loading/error state stay independent.
- **Request de-duplication and staleness guards.** Stores tag each fetch with a
  request ID keyed by its query, so an unchanged query doesn't re-fetch and a
  slow, stale response can't clobber a newer one when filters change quickly.
- **Debounced search.** The records search input debounces 500ms before
  triggering a request, instead of firing one per keystroke.
- **Colocated tests.** `src/test/` mirrors `src/`, one spec per
  component/store, with a shared `mountWithPlugins` helper for setup.
- **Naming conventions.** PascalCase component files, camelCase variables/
  functions, kebab-case component tags in templates (`<router-link>`,
  `<ui-title-card>`) to match Vuetify's own `<v-btn>`-style usage.
- **Vuetify + Tailwind together.** Vuetify for components/theming; Tailwind for
  one-off utility classes where a full Vuetify prop would be overkill.

### Accessibility

A skip-link jumps to `#main-content`; every interactive element (buttons,
fields, sortable table headers, chart SVGs, links) gets a consistent, visible
`focus-visible` outline instead of relying on inconsistent browser defaults;
field labels are recolored to meet WCAG AA contrast; nav/notification lists
carry `aria-label`/`aria-busy`/`role` attributes for screen readers.
The entire app is navigable via keyboard alone.

* The 2 Accessibility issues are know Vuetify issues : https://github.com/vuetifyjs/vuetify/issues/22522

<img width="1918" height="916" alt="image" src="https://github.com/user-attachments/assets/a6006cf8-eb97-4e04-bf7c-924512849825" />

### Performance

Local metrics (LCP, CLS, INP) are currently measured against the mock service
worker, which adds its own request overhead. These numbers are expected to
improve once the app talks to a real backend instead of mocks.

<img width="1919" height="916" alt="image" src="https://github.com/user-attachments/assets/a23a4eed-3e61-4124-8942-a607c5ac9f20" />


