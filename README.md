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
slicing it in the client. This mirrors how the table would behave against a real
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

**Colocated tests, one spec per unit.**
`src/test/` mirrors `src/` and pairs each component/store with its own spec.
A shared `mountWithPlugins` helper wires up Vuetify + a fresh Pinia instance for
every mounted component, keeping individual tests free of boilerplate setup.

**Custom ESLint rules for project conventions.**
`eslint-rules/` enforces a few house rules that generic configs don't cover:
`<script setup lang="ts">` everywhere, no dead empty `<style>` blocks, and arrow
functions over function declarations/expressions — checked automatically on
every lint run rather than relying on review comments.

**Vuetify + Tailwind together.**
Vuetify provides components and theming (colors, spacing scale, dark mode
tokens in `src/styles/`); Tailwind is used for one-off utility classes in
templates where a full Vuetify prop or custom class would be overkill.

## Known Limitations

- The mock dataset (`src/mocks/generateRecords.ts`) is generated client-side —
  there's no real persistence or backend.
- KPI percentage-change values in `handlers.ts` are placeholder figures, not
  computed period-over-period deltas.
