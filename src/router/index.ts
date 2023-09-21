import { Preferences } from "@capacitor/preferences";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },

  {
    path: "/home",
    name: "home-page",
    component: () => import("@/views/Default/HomePage.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({ key: "driverOneId" });

      if (
        (oneId === "undefined" && token === "undefined") ||
        (!oneId && !token) ||
        (oneId === "null" && token === "null")
      ) {
        await Preferences.remove({ key: "driverOneId" });
        await Preferences.remove({ key: "auth_token" });

        return next("/register");
      }

      return next(); 
    },
  },
  {
    path: "/register",
    name: "register-page",
    component: () => import("@/views/Register/RegisterPage.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({ key: "driverOneId" });

      if (
        (oneId === "undefined" && token === "undefined") ||
        (!oneId && !token) ||
        (oneId === "null" && token === "null")
      ) {
        await Preferences.remove({ key: "driverOneId" });
        await Preferences.remove({ key: "auth_token" });

        return next();
      }

      return next("/home");
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
// })

export default router;
