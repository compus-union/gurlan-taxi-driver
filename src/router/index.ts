import { Preferences } from "@capacitor/preferences";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { DriverValidation } from "@/constants";

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
      const { value: banned } = await Preferences.get({ key: "banned" });

      if (!validation && !oneId && !token && !banned) {
        return next("/register");
      }

      if (validation === DriverValidation.WAITING && oneId && token) {
        return next("/validation-waiting");
      }

      if (validation === DriverValidation.INVALIDATED && oneId && token) {
        return next("/invalidation");
      }

      if (validation === DriverValidation.VALIDATED && oneId && token) {
        return next("/login");
      }

      if (!validation && banned === "true") {
        return next("/banned");
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
      const { value: banned } = await Preferences.get({ key: "banned" });

      if (validation === DriverValidation.SUCCESS && oneId && token) {
        return next("/home");
      }

      if (validation === DriverValidation.WAITING && oneId && token) {
        return next("/validation-waiting");
      }

      if (validation === DriverValidation.INVALIDATED && oneId && token) {
        return next("/invalidation");
      }

      if (validation === DriverValidation.VALIDATED && oneId && token) {
        return next("/login");
      }

      if (!validation && banned === "true") {
        return next("/banned");
      }

      return next();
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
      const { value: banned } = await Preferences.get({ key: "banned" });

      if (!token && !oneId && !validation && !banned) {
        return next("/register");
      }

      if (validation === DriverValidation.SUCCESS && oneId && token) {
        return next("/home");
      }

      if (validation === DriverValidation.WAITING && oneId && token) {
        return next("/validation-waiting");
      }

      if (validation === DriverValidation.INVALIDATED && oneId && token) {
        return next("/invalidation");
      }

      if (!validation && banned === "true") {
        return next("/banned");
      }

      return next();
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
      const { value: banned } = await Preferences.get({ key: "banned" });

      if (!token && !oneId && !validation && !banned) {
        return next("/register");
      }

      if (validation === DriverValidation.SUCCESS && oneId && token) {
        return next("/home");
      }

      if (validation === DriverValidation.VALIDATED && oneId && token) {
        return next("/login");
      }

      if (validation === DriverValidation.INVALIDATED && oneId && token) {
        return next("/invalidation");
      }

      if (!validation && banned === "true") {
        return next("/banned");
      }

      return next();
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
      const { value: banned } = await Preferences.get({ key: "banned" });

      if (!token && !oneId && !validation && !banned) {
        return next("/register");
      }

      if (validation === DriverValidation.SUCCESS && oneId && token) {
        return next("/home");
      }

      if (validation === DriverValidation.WAITING && oneId && token) {
        return next("/validation-waiting");
      }

      if (validation === DriverValidation.VALIDATED && oneId && token) {
        return next("/login");
      }

      if (!validation && banned === "true") {
        return next("/banned");
      }

      return next();
    },
  },
  {
    path: "/banned",
    name: "banned-page",
    component: () => import("@/views/Auth/BannedPage.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({ key: "driverOneId" });
      const { value: validation } = await Preferences.get({
        key: "validation",
      });
      const { value: banned } = await Preferences.get({ key: "banned" });

      if (!token && !oneId && !validation && !banned) {
        return next("/register");
      }

      if (validation === DriverValidation.SUCCESS && oneId && token) {
        return next("/home");
      }

      if (validation === DriverValidation.WAITING && oneId && token) {
        return next("/validation-waiting");
      }

      if (validation === DriverValidation.INVALIDATED && oneId && token) {
        return next("/invalidation");
      }

      if (validation === DriverValidation.VALIDATED && oneId && token) {
        return next("/login");
      }

      return next();
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
