<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { IonChip, IonImg } from "@ionic/vue";
import { defineAsyncComponent, ref } from "vue";

const DriverForm = defineAsyncComponent(() => {
  return import("@/components/Register/DriverForm.vue");
});

const step = ref(1);
</script>

<template>
  <AuthLayout>
    <div
      class="component-controller h-screen flex flex-col items-center justify-evenly"
    >
      <img src="../../resources/compuss-logo.svg">
      <DriverForm v-if="step === 1" />
      <IonChip class="mt-2 text-sm">{{ step }}/4</IonChip>
    </div>
  </AuthLayout>
</template>
