import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "./theme/base.css";

const app = createApp(App).use(createPinia()).use(router);

router.isReady().then(() => {
  app.mount("#app");
});
