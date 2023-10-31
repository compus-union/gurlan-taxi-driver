<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { defineAsyncComponent, ref } from "vue";

const CarForm = defineAsyncComponent(() => {
  return import("@/components/Register/CarForm.vue");
});

const DriverForm = defineAsyncComponent(() => {
  return import("@/components/Register/DriverForm.vue");
});

const DocumentsForm = defineAsyncComponent(() => {
  return import("@/components/Register/DocumentsForm.vue");
});

const Badge = defineAsyncComponent(() => {
  return import("@/components/ui/badge/Badge.vue");
});

const step = ref(1);

const addStep = () => {
  if (step.value === 3) {
    return;
  }
  step.value++;
};

const minusStep = () => {
  if (step.value === 1) {
    return;
  }
  step.value--;
};
</script>

<template>
  <div
    class="component-controller relative h-screen flex flex-col items-center justify-evenly"
  >
    <DriverForm @next="addStep" v-if="step === 1" />
    <CarForm @next="addStep" @back="minusStep" v-if="step === 2" />
    <DocumentsForm @next="addStep" @back="minusStep" v-if="step === 3" />
    <!-- <Badge class="suit-theme badge absolute bottom-4">{{ step }}/3</Badge> -->
  </div>
</template>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
