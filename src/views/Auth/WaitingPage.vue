<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";
import { loadingController } from "@ionic/vue";
import { Button } from "@/components/ui/button";

const authStore = useAuth();

const check = async () => {
  const { value: oneId } = await Preferences.get({ key: "driverOneId" });
  const { value: token } = await Preferences.get({ key: "auth_token" });

  await authStore.checkIfValidated({ oneId, token });
};

onBeforeMount(async () => {
  await check();

  const loading = await loadingController.create({
    message: "test...",
    spinner: "lines-small",
  });
  await loading.present();
});
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <Button
      variant="default"
      class="suit-theme"
      @click="() => console.log('clicked')"
      >Click</Button
    >
  </div>
</template>
