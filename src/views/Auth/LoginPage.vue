<script setup lang="ts">
import { IonText, IonToolbar, IonIcon, IonButton } from "@ionic/vue";
import { locationOutline } from "ionicons/icons";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { onBeforeMount } from "vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";

const authStore = useAuth();

const checkValidation = async () => {
  const { value: oneId } = await Preferences.get({ key: "driverOneId" });
  const { value: token } = await Preferences.get({ key: "auth_token" });

  await authStore.checkIfValidated({ oneId, token });
};

onBeforeMount(async () => {
  await checkValidation();
});
</script>

<template>
  <AuthLayout>
    <div>Login</div>
  </AuthLayout>
</template>
