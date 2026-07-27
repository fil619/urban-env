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

**Server-driven table, not client-side slicing.**
The records table (`RecordsPage.vue`) uses Vuetify's `v-data-table-server` and
delegates paging, sorting, searching, and filtering to the mock API
(`src/mocks/handlers.ts`) via query params, rather than fetching everything and
slicing it in the client. Only one page of rows ever crosses the network or
gets held in memory, so the approach stays fast as the dataset grows — a
client-side-paginate-everything approach would scale worse and get slower with
more records. It also mirrors how the table would behave against a real
backend, so swapping the mock handlers for real endpoints later is a drop-in
change with no component rework.

**Domain-scoped Pinia stores.**
State is split by domain (`dashboard`, `records`, `notifications`, `config`)
rather than one global store, so each store's fetch logic, loading/error state,
and shape stay independent and easy to reason about in isolation.

**Request de-duplication and staleness guards.**
Both `records` and `dashboard` stores tag each fetch with a request ID and key
in-flight/last-completed requests by their serialized query. This prevents two
problems that are easy to hit with reactive filters: firing duplicate requests
for an unchanged query, and an older, slower response clobbering a newer one
when the user changes filters quickly.

**Debounced search.**
The records search field debounces input (500ms) before it triggers a
server request, avoiding a network round-trip per keystroke.

**Mocked API via MSW instead of static JSON or in-memory stubs.**
MSW intercepts real `fetch` calls at the network layer using the same handlers
in tests and in the browser, so components and stores are written against a
realistic async, HTTP-shaped contract from the start — no separate "test mode"
data path to keep in sync.

**Container / Presentational component split.**
Pages (e.g. `RecordsPage.vue`, `DashboardPage.vue`) act as containers: they own
all logic — calling stores, tracking filter/pagination state, deciding what to
fetch and when. Everything under `views/dashboard/components/` and
`views/records/` child components (`ToolBar.vue`, `RevenueTrend.vue`, etc.) is
presentational — plain props in, events out, no store access and no fetching of
their own. This keeps business logic in one place per feature and makes the
presentational components trivial to test and reuse.

**ESLint enforced strictly, not just as a suggestion.**
Linting isn't advisory: the flat ESLint config combines `typescript-eslint`'s
recommended/strict Vue+TS rules with the project's own custom rules
(`eslint-rules/`), plus `oxlint` for fast additional checks. Convention
questions (script tag conventions, dead style blocks, function style) are
settled by a lint failure, not a review comment.

**Colocated tests, one spec per unit.**
`src/test/` mirrors `src/` and pairs each component/store with its own spec.
A shared `mountWithPlugins` helper wires up Vuetify + a fresh Pinia instance for
every mounted component, keeping individual tests free of boilerplate setup.

**Consistent, strict Vue component conventions.**
Every component follows the same shape: `<script setup lang="ts">` first,
`<template>` below it, so a file reads logic-then-markup instead of jumping
around. Props and emits are declared with the compile-time (type-only) macros —
`defineProps<{ ... }>()` and a call-signature `defineEmits<{ (e: "x"): void }>()`
— rather than runtime option objects, so the component's public contract is
fully type-checked with no separate runtime/type declarations to keep in sync.

**Consistent naming conventions.**
Component files are PascalCase (`HeaderBar.vue`, `NavItem.vue`, `LogoDark.vue`),
matching the component name they export. Variables and functions are camelCase
throughout (`fromDate`, `fetchRecords`). In templates, components are referenced
in kebab-case (`<router-link>`, `<router-view>`, `<ui-title-card>`) even though
they're imported/registered as PascalCase — kebab-case in markup reads closer to
plain HTML and matches Vuetify's own component usage style (`<v-btn>`,
`<v-card>`), so app components and library components look uniform in a
template.

**Vuetify + Tailwind together.**
Vuetify provides components and theming (colors, spacing scale, dark mode
tokens in `src/styles/`); Tailwind is used for one-off utility classes in
templates where a full Vuetify prop or custom class would be overkill.

## Known Limitations

- The mock dataset (`src/mocks/generateRecords.ts`) is generated client-side —
  there's no real persistence or backend.
- KPI percentage-change values in `handlers.ts` are placeholder figures, not
  computed period-over-period deltas.
