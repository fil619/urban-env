/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";
import VueApexCharts from "vue3-apexcharts";

// Styles
import "unfonts.css";
import "./styles/tailwind.css";
import "./styles/main.scss";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

const pinia = createPinia();
const app = createApp(App);

registerPlugins(app);

app.use(pinia);
app.use(router);
app.use(VueApexCharts);

//Because registering the Service Worker is an asynchronous operation, it’s a good idea to defer the rendering of your application until the registration Promise resolves.
enableMocking().then(() => {
  app.mount("#app");
});
