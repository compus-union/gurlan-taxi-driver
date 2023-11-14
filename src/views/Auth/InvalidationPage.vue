<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";
import CatSad from "@/components/custom-illustrations/CatSad.vue";
import { Button } from "@/components/ui/button";
import { Browser } from "@capacitor/browser";
import { Phone, RefreshCcw, MapPin } from "lucide-vue-next";
import { Power } from "lucide-vue-next";

const authStore = useAuth();

const check = async () => {
  const { value: oneId } = await Preferences.get({ key: "driverOneId" });
  const { value: token } = await Preferences.get({ key: "auth_token" });

  await authStore.checkIfValidated({ oneId, token });
};

onBeforeMount(async () => {
  await check();
});

const openLocation = async () => {
  await Browser.open({ url: "https://maps.app.goo.gl/U6QA44remacDwuXr7" });
};

const checkWithButton = async () => {
  try {
    loading.value = true;
    await check();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const restart = async () => {
  try {
    const { value: oneId } = await Preferences.get({ key: "driverOneId" });
    const { value: token } = await Preferences.get({ key: "auth_token" });

    loading.value = true;
    await authStore.restart({ oneId: oneId as string, token: token as string });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const loading = ref(false);
</script>

<template>
  <div
    class="container px-2 mx-auto h-screen flex flex-col items-center justify-between py-4"
  >
    <Button variant="link" class="toolbar font-semibold">
      <a class="flex items-center" href="tel:+998999447613">
        <Phone class="w-[18px] mr-2" /> +998 99 944 76 13
      </a>
    </Button>
    <div class="content flex flex-col items-center">
      <div class="img w-[60%] h-auto my-4">
        <CatSad class="w-full object-cover" />
      </div>
      <h1 class="title text-3xl font-bold">Afsus!</h1>
      <p class="desc text-center my-4">
        Siz taqdim qilgan ma'lumotlar bizning ichki nizom va talablarimizga
        to'g'ri kelmaydi. 
      </p>
      <div class="buttons space-x-2">
        <Button @click="checkWithButton" variant="default" class="suit-theme"
          ><RefreshCcw
            class="w-[18px] mr-2"
            :class="{ 'animate-spin': loading }"
          />
          Yangilash</Button
        >
        <Button @click="restart" variant="outline"
          ><Power class="w-[18px] mr-2" /> Restart</Button
        >
      </div>
      <small class="opacity-50 text-center mt-4">Restart tugmasini bosish orqali boshqatdan ro'yxatdan o'tishingiz mumkin.</small>
    </div>
    <div class="locations">
      <Button :disabled="loading" variant="link" @click="openLocation"
        ><MapPin class="w-[18px] mr-2" /> Manzil</Button
      >
    </div>
  </div>
</template>
