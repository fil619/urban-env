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
- **Unit tests.** `src/test/` mirrors `src/`, one spec per
  component/store, with a shared `mountWithPlugins` helper for setup.
- **Naming conventions.** PascalCase component files, camelCase variables/
  functions, kebab-case component tags in templates (`<router-link>`,
  `<ui-title-card>`) to match Vuetify's own `<v-btn>`-style usage.
- **Vuetify + Tailwind together.** Vuetify for components/theming; Tailwind for
  one-off utility classes where a full Vuetify prop would be overkill.
- **Chart colors.** pull live from the Vuetify theme,  which keeps chart colors
  consistent with the rest of the UI and easier to maintain.

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

## Further Improvements

- **Storybook.** Isolated component development/documentation, decoupled
  from the app's routes and stores.
- **Pre-commit hooks.** Husky + lint-staged to run lint/format/type-check on
  staged files before a commit lands, instead of relying on CI or review to
  catch it.

### The records API may return up to 100,000 records. Explain in the README how you would handle this scenario in production.

First, check why the API is returning 100,000 records, and whether anyone actually needs all of them at once.
So the right approach depends on what the data is for.

## If it's a table or list view

* Don't pull everything.
* Use server-side pagination, filtering, sorting, and search so the user narrows the data before it comes down the wire.
* Request one page at a time, and load more with infinite scroll or lazy loading as the user scrolls.

## If a large dataset really has to reach the front end

* Store it in a shallowRef. Big read-only lists don't need per-row reactivity, so this skips the cost of making every object reactive.
  Reassign the whole array to trigger an update.
* Shape the data once, when it lands in the store, not per-row inside the table while it renders. The table should just show values.
* Give each row a key (:key="item.id") so Vue can track each row correctly as the list changes.
* Show skeleton loaders while data loads, so the user sees structure instead of a blank screen.
* Use virtualization (vue-virtual-scroller) if a large list must be rendered at once, so only the rows visible in the viewport are in the DOM. 
  Render cost stays flat whether it's 1k or 100k rows.
* Debounce the search/filter inputs so you're not firing a request on every keystroke against a large dataset.
