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
      const { value: validation } = await Preferences.get({
        key: "validation",
      });

      if (
        (oneId === "undefined" && token === "undefined") ||
        (!oneId && !token) ||
        (oneId === "null" && token === "null")
      ) {
        await Preferences.remove({ key: "driverOneId" });
        await Preferences.remove({ key: "auth_token" });

        return next("/register");
      }

      if (validation === "waiting") {
        return next("/validation-waiting");
      }

      if (validation === "validated") {
        return next("/login");
      }

      if (validation === "invalidated") {
        return next("/invalidation");
      }

      return next();
    },
  },
  {
    path: "/register",
    name: "register-page",
    component: () => import("@/views/Auth/RegisterPage.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({ key: "driverOneId" });
      const { value: validation } = await Preferences.get({
        key: "validation",
      });

      if (
        (oneId === "undefined" && token === "undefined") ||
        (!oneId && !token) ||
        (oneId === "null" && token === "null")
      ) {
        await Preferences.remove({ key: "driverOneId" });
        await Preferences.remove({ key: "auth_token" });

        return next();
      }

      if (validation === "waiting") {
        return next("/validation-waiting");
      }

      if (validation === "validated") {
        return next("/login");
      }

      if (validation === "invalidated") {
        return next("/invalidation");
      }

      return next("/home");
    },
  },
  {
    path: "/login",
    name: "login-page",
    component: () => import("@/views/Auth/LoginPage.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({ key: "driverOneId" });
      const { value: validation } = await Preferences.get({
        key: "validation",
      });

      if (
        (oneId === "undefined" && token === "undefined") ||
        (!oneId && !token) ||
        (oneId === "null" && token === "null")
      ) {
        await Preferences.remove({ key: "driverOneId" });
        await Preferences.remove({ key: "auth_token" });

        return next("/register");
      }

      if (validation === "waiting") {
        return next("/validation-waiting");
      }

      if (validation === "invalidated") {
        return next("/invalidation");
      }

      if (validation === "validated") {
        return next();
      }

      return next("/home");
    },
  },
  {
    path: "/validation-waiting",
    name: "validation-waiting-page",
    component: () => import("@/views/Auth/WaitingPage.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({ key: "driverOneId" });
      const { value: validation } = await Preferences.get({
        key: "validation",
      });

      if (
        (oneId === "undefined" && token === "undefined") ||
        (!oneId && !token) ||
        (oneId === "null" && token === "null")
      ) {
        await Preferences.remove({ key: "driverOneId" });
        await Preferences.remove({ key: "auth_token" });

        return next("/register");
      }

      if (validation === "invalidated") {
        return next("/invalidation");
      }

      if (validation === "validated") {
        return next("/login");
      }

      if (validation === "waiting") {
        return next();
      }

      return next("/home");
    },
  },
  {
    path: "/invalidation",
    name: "invalidation-page",
    component: () => import("@/views/Auth/InvalidationPage.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({ key: "driverOneId" });
      const { value: validation } = await Preferences.get({
        key: "validation",
      });

      if (
        (oneId === "undefined" && token === "undefined") ||
        (!oneId && !token) ||
        (oneId === "null" && token === "null")
      ) {
        await Preferences.remove({ key: "driverOneId" });
        await Preferences.remove({ key: "auth_token" });

        return next("/register");
      }

      if (validation === "validated") {
        return next("/login");
      }

      if (validation === "waiting") {
        return next("/validation-waiting");
      }

      if (validation === "invalidated") {
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
