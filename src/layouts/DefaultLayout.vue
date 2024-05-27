<script lang="ts" setup>
import { Preferences } from "@capacitor/preferences";
import { toast } from "vue-sonner";

import { onMounted } from "vue";
import { useAuth } from "@/stores/auth";
import { useMaps } from "@/stores/maps";
import { useOriginCoords } from "@/stores/origin";

const authStore = useAuth();
const mapsStore = useMaps();
const originCoords = useOriginCoords();

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
    await mapsStore.loadMap("map");
  } catch (error: any) {
    console.log(error);
  }
};

const getCoords = async () => {
  try {
    await originCoords.getCoords();
    return;
  } catch (error: any) {
    console.log(error);
    toast(error);
  }
};

onMounted(async () => {
  try {
    await check();
    await getCoords();
    await loadMap();
  } catch (error: any) {
    toast(error);
  }
});
</script>

<template>
  <div class="default-layout">
    <div class="h-screen z-[49]" id="map"></div>
    <router-view
      class="h-auto fixed bottom-0 w-full z-[49]"
      v-slot="{ Component }"
    >
      <PageTransition name="fade-in-up" appear>
        <component :is="Component" />
      </PageTransition>
    </router-view>
  </div>
</template>

<style>
.custom-style {
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 8px -2px rgba(0, 0, 0, 0.2);
}

img[alt="Google"] {
  display: none;
}

div.gmnoprint {
  display: none;
}
</style>
