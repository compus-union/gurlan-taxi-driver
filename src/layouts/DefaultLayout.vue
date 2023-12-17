<script lang="ts" setup>
import { Preferences } from "@capacitor/preferences";

import { onBeforeMount, onMounted, ref } from "vue";
import { useAuth } from "@/stores/auth";
import { useMaps } from "@/stores/maps";
import { toast } from "vue3-toastify";
import { loadingController } from "@ionic/vue";

const authStore = useAuth();
const mapsStore = useMaps();

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
    console.log(error);
    toast(error.message || error.response.data.msg || error);
  }
};

const loadMap = async () => {
  try {
    await Promise.allSettled([mapsStore.loadMap("map")]);
  } catch (error: any) {
    console.log(error);
  }
};

onMounted(async () => {
  try {
    setTimeout(async () => {
      const [checking, loadingMap] = await Promise.allSettled([
        check(),
        loadMap(),
      ]);

      if (
        checking.status === "fulfilled" &&
        loadingMap.status === "fulfilled"
      ) {
        return;
      }

      toast("Nimadir xato ketdi, dasturni boshqatdan ishga tushiring");
    }, 100);
  } catch (error: any) {
    toast(error);
  }
});
</script>

<template>
  <div class="default-layout">
    <div class="h-screen" id="map"></div>
    <router-view class="fixed bottom-0 h-auto suit-theme-reverse w-full"></router-view>
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
