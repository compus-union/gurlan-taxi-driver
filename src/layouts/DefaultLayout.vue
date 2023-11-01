<script lang="ts" setup>
import { Preferences } from "@capacitor/preferences";

import { onBeforeMount, onMounted, ref } from "vue";
import { useAuth } from "@/stores/auth";
import { useMaps } from "@/stores/maps";

const authStore = useAuth();
const mapsStore = useMaps();

const toastMessage = ref<string>();
const loadingMessage = ref<string>();
const openToastBtn = ref<HTMLButtonElement>();
const openLoadingBtn = ref<HTMLButtonElement>();
const loadingComponent = ref();

const openLoading = async (message: string) => {
  loadingMessage.value = message;
  openLoadingBtn.value?.click();
};

const openToast = async (message: string) => {
  toastMessage.value = message;
  openToastBtn.value?.click();
};

const check = async () => {
  try {
    const { value: oneId } = await Preferences.get({ key: "driverOneId" });
    const { value: token } = await Preferences.get({ key: "auth_token" });

    await authStore.checkIfLoggedIn({
      oneId: oneId as string,
      token: token as string,
    });

    return;
  } catch (error: any) {
    // handle the error
  }
};

const loadMap = async () => {
  try {
    await Promise.allSettled([mapsStore.loadMap("map")]);
  } catch (error: any) {}
};

onMounted(async () => {
  await openLoading("Yuklanmoqda...");

  setTimeout(async () => {
    const [checking, loadingMap] = await Promise.allSettled([
      check(),
      loadMap(),
    ]);

    if (checking.status === "fulfilled" && loadingMap.status === "fulfilled") {
      await loadingComponent.value?.dismiss();
      loadingMessage.value = "";
      return;
    }

    await openToast("Nimadir xato ketdi, dasturni boshqatdan ishga tushuring.");
    return;
  }, 100);
});
</script>

<template>
  <div class="default-layout">
    <router-view></router-view>
  </div>
</template>

<style scoped>


img[alt="Google"] {
  display: none;
}

div.gmnoprint {
  display: none;
}
</style>
