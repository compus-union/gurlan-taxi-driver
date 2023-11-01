<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { onBeforeMount } from "vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";

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
  <div>Waiting</div>
</template>