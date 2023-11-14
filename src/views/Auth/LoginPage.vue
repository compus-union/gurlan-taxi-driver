<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";
import { vMaska } from "maska";
import { vUppercase } from "@/directives/uppercase";
import {
  ResponseStatus,
  DriverValidation,
  UniversalResponseStatus,
} from "@/constants";
import { useLoading } from "@/stores/loading";
import router from "@/router";
import { toastController } from "@ionic/vue";
import { toast } from "vue3-toastify";

const authStore = useAuth();
const loadingStore = useLoading();

const checkValidation = async () => {
  const { value: oneId } = await Preferences.get({ key: "driverOneId" });
  const { value: token } = await Preferences.get({ key: "auth_token" });

  await authStore.checkIfValidated({ oneId, token });
};

const showPass = ref<boolean>();

onBeforeMount(async () => {
  await checkValidation();
});

const disableButton = computed(() => {
  if (
    authStore.driver?.password.length >= 8 &&
    authStore.driver?.oneId?.length === 9
  ) {
    return false;
  } else {
    return true;
  }
});

const action = async () => {
  try {
    const result = await authStore.login({
      oneId: authStore.driver.oneId as string,
      password: authStore.driver.password,
    });

    if (result.status === ResponseStatus.AUTH_WARNING) {
      toast(result.msg);

      return;
    }

    if (result.status === ResponseStatus.BANNED) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.remove({ key: "validation" }),
        Preferences.set({ key: "banned", value: "true" }),
        router.push("/auth/banned"),
      ]);

      return;
    }

    if (result.status === ResponseStatus.VALIDATION_FAILED) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.remove({ key: "banned" }),
        Preferences.set({
          key: "validation",
          value: DriverValidation.INVALIDATED,
        }),
        router.push("/auth/invalidation"),
      ]);

      return;
    }

    if (result.status === ResponseStatus.VALIDATION_WAITING) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.remove({ key: "banned" }),
        Preferences.set({
          key: "validation",
          value: DriverValidation.WAITING,
        }),
        router.push("/auth/validation-waiting"),
      ]);

      return;
    }

    if (result.status === UniversalResponseStatus.ERR_NETWORK) {
      toast(result.msg || "Server bilan aloqa mavjud emas");

      return;
    }

    if (result.status === ResponseStatus.DRIVER_NOT_FOUND) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.clear(),
        router.push("/auth/register"),
      ]);
      return;
    }

    if (
      result.status === ResponseStatus.TOKEN_NOT_FOUND ||
      result.status === ResponseStatus.TOKEN_NOT_VALID ||
      result.status === ResponseStatus.HEADERS_NOT_FOUND
    ) {
      toast(result.msg);

      return;
    }

    if (result.status === ResponseStatus.DRIVER_LOGIN_DONE) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.set({ key: "validation", value: DriverValidation.SUCCESS }),
        Preferences.set({ key: "driverOneId", value: result.oneId }),
        Preferences.set({ key: "auth_token", value: result.token }),
      ]);

      setTimeout(() => {
        router.push("/home");
      }, 200);

      const { value } = await Preferences.get({ key: "validation" });
      console.log(value);

      return;
    }
  } catch (error: any) {
    if (!error.response) {
      toast(
        "Xatolik yuz berdi, boshqatdan urinib ko'ring yoki dasturni boshqatdan ishga tushiring"
      );

      return;
    }
    toast(error.response.data.msg || error.message);

    return;
  }
};
</script>

<template>
  <div
    class="login-page container mx-auto sm:px-4 px-2 flex items-center justify-center h-screen"
  >
    <div class="wrapper">
      <div class="form border my-border rounded p-4 mt-4">
        <h5 class="text-xl font-bold">Tizimga kirish</h5>
        <div class="groups mt-4 space-y-3">
          <div class="form-group flex flex-col items-start">
            <label class="mb-1" for="oneId">One Id</label>
            <input
              autocomplete="off"
              required
              v-model.trim="authStore.driver.oneId"
              class="border my-border rounded w-full px-2 py-1 outline-none bg-transparent"
              type="text"
              placeholder="One Id"
              id="oneId"
              v-maska
              v-uppercase
              data-maska="@@#######"
            />
          </div>
          <div class="form-group flex flex-col items-start">
            <label class="mb-1" for="password">Parolingiz</label>
            <input
              required
              v-model.trim="authStore.driver.password"
              class="border my-border rounded w-full px-2 py-1 outline-none bg-transparent"
              :type="showPass ? 'text' : 'password'"
              placeholder="*****"
              id="password"
            />
          </div>
          <div class="form-group">
            <div>Parolni ko'rsatish</div>
          </div>
          <button
            @click="action"
            :disabled="loadingStore.loading || disableButton"
            class="default-btn w-full font-bold uppercase"
            type="button"
          >
            KIRISH
          </button>
        </div>
      </div>
      <div class="mt-4">
        Agar tizimga kirishda muammolarga duch kelayotgan bo'lsangiz, quyidagi
        raqamlarga murojaat qiling: <br />
        <br />
        +998 99 944 76 13 <br />
        +998 95 171 31 47
      </div>
    </div>
  </div>
</template>
