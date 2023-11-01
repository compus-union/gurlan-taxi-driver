<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";

import { onBeforeMount } from "vue";

const authStore = useAuth();

const check = async () => {
  const { value: oneId } = await Preferences.get({ key: "driverOneId" });
  const { value: token } = await Preferences.get({ key: "auth_token" });

  await authStore.checkIfValidated({ oneId, token });
};

onBeforeMount(async () => {
  await check();
});
</script>

<template>
  <div>Invalidated</div>
</template>
