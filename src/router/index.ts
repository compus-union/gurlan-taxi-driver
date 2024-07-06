import { Preferences } from "@capacitor/preferences";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { DriverValidation } from "@/constants";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },

  {
    path: "/home",
    name: "default-layout",
    component: () => import("@/layouts/DefaultLayout.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({
        key: "driverOneId",
      });
      const { value: validation } = await Preferences.get({
        key: "validation",
      });
      const { value: banned } = await Preferences.get({ key: "banned" });

      if (validation === DriverValidation.SUCCESS && oneId && token) {
        return next();
      }
      if (!validation && !oneId && !token && !banned) {
        return next("/auth/register");
      }
      if (validation === DriverValidation.WAITING && oneId && token) {
        return next("/auth/validation-waiting");
      }
      if (validation === DriverValidation.INVALIDATED && oneId && token) {
        return next("/auth/invalidation");
      }
      if (validation === DriverValidation.VALIDATED && oneId && token) {
        return next("/auth/login");
      }
      if (!validation && banned === "true") {
        return next("/auth/banned");
      }
      return next();
    },
    children: [
      {
        path: "",
        component: () => import("@/views/Default/HomePage.vue"),
        name: "default-layout-home-page",
      },
      {
        path: "deactivated",
        component: () => import("@/views/Default/DeactivatedPage.vue"),
        name: "default-layout-deactivated-page",
      },
    ],
  },
  {
    path: "/auth/",
    name: "auth-layout",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "register",
        name: "auth-layout-register-page",
        component: () => import("@/views/Auth/RegisterPage.vue"),
        async beforeEnter(to, from, next) {
          const { value: token } = await Preferences.get({ key: "auth_token" });
          const { value: oneId } = await Preferences.get({
            key: "driverOneId",
          });
          const { value: validation } = await Preferences.get({
            key: "validation",
          });
          const { value: banned } = await Preferences.get({ key: "banned" });
          if (!validation && !oneId && !token && !banned) {
            return next();
          }
          if (validation === DriverValidation.SUCCESS && oneId && token) {
            return next("/home");
          }
          if (validation === DriverValidation.WAITING && oneId && token) {
            return next("/auth/validation-waiting");
          }
          if (validation === DriverValidation.INVALIDATED && oneId && token) {
            return next("/auth/invalidation");
          }
          if (validation === DriverValidation.VALIDATED && oneId && token) {
            return next("/auth/login");
          }
          if (!validation && banned === "true") {
            return next("/auth/banned");
          }

          return next();
        },
        meta: {
          layout: "auth-layout",
        },
      },
      {
        path: "login",
        name: "auth-layout-login-page",
        component: () => import("@/views/Auth/LoginPage.vue"),
        async beforeEnter(to, from, next) {
          const { value: token } = await Preferences.get({ key: "auth_token" });
          const { value: oneId } = await Preferences.get({
            key: "driverOneId",
          });
          const { value: validation } = await Preferences.get({
            key: "validation",
          });
          if (validation === DriverValidation.VALIDATED && oneId && token) {
            return next();
          }
          const { value: banned } = await Preferences.get({ key: "banned" });
          if (!token && !oneId && !validation && !banned) {
            return next("/auth/register");
          }
          if (validation === DriverValidation.SUCCESS && oneId && token) {
            return next("/home");
          }
          if (validation === DriverValidation.WAITING && oneId && token) {
            return next("/auth/validation-waiting");
          }
          if (validation === DriverValidation.INVALIDATED && oneId && token) {
            return next("/auth/invalidation");
          }
          if (!validation && banned === "true") {
            return next("/auth/banned");
          }
          next();
        },
        meta: {
          layout: "auth-layout",
        },
      },
      {
        path: "invalidation",
        name: "auth-layout-invalidation-page",
        component: () => import("@/views/Auth/InvalidationPage.vue"),
        async beforeEnter(to, from, next) {
          const { value: token } = await Preferences.get({ key: "auth_token" });
          const { value: oneId } = await Preferences.get({
            key: "driverOneId",
          });
          const { value: validation } = await Preferences.get({
            key: "validation",
          });
          const { value: banned } = await Preferences.get({ key: "banned" });
          if (validation === DriverValidation.INVALIDATED && oneId && token) {
            return next();
          }
          if (!token && !oneId && !validation && !banned) {
            return next("/auth/register");
          }
          if (validation === DriverValidation.SUCCESS && oneId && token) {
            return next("/home");
          }
          if (validation === DriverValidation.WAITING && oneId && token) {
            return next("/auth/validation-waiting");
          }
          if (validation === DriverValidation.VALIDATED && oneId && token) {
            return next("/auth/login");
          }
          if (!validation && banned === "true") {
            return next("/auth/banned");
          }
          next();
        },
        meta: {
          layout: "auth-layout",
        },
      },
      {
        path: "validation-waiting",
        name: "auth-layout-validation-waiting-page",
        component: () => import("@/views/Auth/WaitingPage.vue"),
        async beforeEnter(to, from, next) {
          const { value: token } = await Preferences.get({ key: "auth_token" });
          const { value: oneId } = await Preferences.get({
            key: "driverOneId",
          });
          const { value: validation } = await Preferences.get({
            key: "validation",
          });
          const { value: banned } = await Preferences.get({ key: "banned" });
          if (validation === DriverValidation.WAITING && oneId && token) {
            return next();
          }
          if (!token && !oneId && !validation && !banned) {
            return next("/auth/register");
          }

          if (validation === DriverValidation.SUCCESS && oneId && token) {
            return next("/home");
          }

          if (validation === DriverValidation.VALIDATED && oneId && token) {
            return next("/auth/login");
          }

          if (validation === DriverValidation.INVALIDATED && oneId && token) {
            return next("/auth/invalidation");
          }

          if (!validation && banned === "true") {
            return next("/auth/banned");
          }

          next();
        },
        meta: {
          layout: "auth-layout",
        },
      },
      {
        path: "banned",
        name: "auth-layout-banned-page",
        component: () => import("@/views/Auth/BannedPage.vue"),
        async beforeEnter(to, from, next) {
          const { value: token } = await Preferences.get({ key: "auth_token" });
          const { value: oneId } = await Preferences.get({
            key: "driverOneId",
          });
          const { value: validation } = await Preferences.get({
            key: "validation",
          });
          const { value: banned } = await Preferences.get({ key: "banned" });
          if (!validation && banned === "true") {
            return next();
          }
          if (!token && !oneId && !validation && !banned) {
            return next("/auth/register");
          }
          if (validation === DriverValidation.SUCCESS && oneId && token) {
            return next("/home");
          }
          if (validation === DriverValidation.WAITING && oneId && token) {
            return next("/auth/validation-waiting");
          }
          if (validation === DriverValidation.INVALIDATED && oneId && token) {
            return next("/auth/invalidation");
          }
          if (validation === DriverValidation.VALIDATED && oneId && token) {
            return next("/auth/login");
          }
          next();
        },
        meta: {
          layout: "auth-layout"
        }
      },
      {
        path: "emergency-login",
        name: "emergency-login-page",
        component: () => import("@/views/Auth/EmergencyLoginPage.vue"),
        async beforeEnter(to, from, next) {
          const { value: token } = await Preferences.get({ key: "auth_token" });
          const { value: oneId } = await Preferences.get({
            key: "driverOneId",
          });
          const { value: validation } = await Preferences.get({
            key: "validation",
          });
          const { value: banned } = await Preferences.get({ key: "banned" });
          if (!validation && !oneId && !token && !banned) {
            return next();
          }
          if (validation === DriverValidation.SUCCESS && oneId && token) {
            return next("/home");
          }
          if (validation === DriverValidation.WAITING && oneId && token) {
            return next("/auth/validation-waiting");
          }
          if (validation === DriverValidation.INVALIDATED && oneId && token) {
            return next("/auth/invalidation");
          }
          if (validation === DriverValidation.VALIDATED && oneId && token) {
            return next("/auth/login");
          }
          if (!validation && banned === "true") {
            return next("/auth/banned");
          }

          return next();
        },
        meta: {
          layout: "auth-layout"
        }
      },
    ],
  },
  {
    path: "/options",
    name: "options-layout",
    component: () => import("@/layouts/OptionsLayout.vue"),
    async beforeEnter(to, from, next) {
      const { value: token } = await Preferences.get({ key: "auth_token" });
      const { value: oneId } = await Preferences.get({
        key: "driverOneId",
      });
      const { value: validation } = await Preferences.get({
        key: "validation",
      });
      const { value: banned } = await Preferences.get({ key: "banned" });

      if (validation === DriverValidation.SUCCESS && oneId && token) {
        return next();
      }
      if (!validation && !oneId && !token && !banned) {
        return next("/auth/register");
      }
      if (validation === DriverValidation.WAITING && oneId && token) {
        return next("/auth/validation-waiting");
      }
      if (validation === DriverValidation.INVALIDATED && oneId && token) {
        return next("/auth/invalidation");
      }
      if (validation === DriverValidation.VALIDATED && oneId && token) {
        return next("/auth/login");
      }
      if (!validation && banned === "true") {
        return next("/auth/banned");
      }

      return next();
    },
    children: [
      {
        path: "profile",
        name: "options-layout-profile-page",
        component: () => import("@/views/Options/ProfilePage.vue")
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

// {
//   path: "/login",
//   name: "login-page",
//   component: () => import("@/views/Auth/LoginPage.vue"),
//   async beforeEnter(to, from, next) {
//     const { value: token } = await Preferences.get({ key: "auth_token" });
//     const { value: oneId } = await Preferences.get({ key: "driverOneId" });
//     const { value: validation } = await Preferences.get({
//       key: "validation",
//     });
//     const { value: banned } = await Preferences.get({ key: "banned" });

//     if (!token && !oneId && !validation && !banned) {
//       return next("/register");
//     }

//     if (validation === DriverValidation.SUCCESS && oneId && token) {
//       return next("/home");
//     }

//     if (validation === DriverValidation.WAITING && oneId && token) {
//       return next("/validation-waiting");
//     }

//     if (validation === DriverValidation.INVALIDATED && oneId && token) {
//       return next("/invalidation");
//     }

//     if (!validation && banned === "true") {
//       return next("/banned");
//     }

//     return next();
//   },
// },
// {
//   path: "/validation-waiting",
//   name: "validation-waiting-page",
//   component: () => import("@/views/Auth/WaitingPage.vue"),

// {
//   path: "/invalidation",
//   name: "invalidation-page",
//   component: () => import("@/views/Auth/InvalidationPage.vue"),
//
// },
// {
//   path: "/banned",
//   name: "banned-page",
//   component: () => import("@/views/Auth/BannedPage.vue"),
//   async beforeEnter(to, from, next) {
//     const { value: token } = await Preferences.get({ key: "auth_token" });
//     const { value: oneId } = await Preferences.get({ key: "driverOneId" });
//     const { value: validation } = await Preferences.get({
//       key: "validation",
//     });
//     const { value: banned } = await Preferences.get({ key: "banned" });

//     if (!token && !oneId && !validation && !banned) {
//       return next("/register");
//     }

//     if (validation === DriverValidation.SUCCESS && oneId && token) {
//       return next("/home");
//     }

//     if (validation === DriverValidation.WAITING && oneId && token) {
//       return next("/validation-waiting");
//     }

//     if (validation === DriverValidation.INVALIDATED && oneId && token) {
//       return next("/invalidation");
//     }

//     if (validation === DriverValidation.VALIDATED && oneId && token) {
//       return next("/login");
//     }

//     return next();
//   },
// },
