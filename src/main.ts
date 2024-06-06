import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { Vue3ProgressPlugin } from "@marcoschulte/vue3-progress";

import "@marcoschulte/vue3-progress/dist/index.css"
import "leaflet/dist/leaflet.css";
import "./theme/base.css";

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(Vue3ProgressPlugin);

router.isReady().then(() => {
  app.mount("#app");
});
