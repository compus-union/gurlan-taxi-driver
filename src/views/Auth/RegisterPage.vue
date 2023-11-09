<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { InfoIcon } from "lucide-vue-next";

const CarForm = defineAsyncComponent(() => {
  return import("@/components/Register/CarForm.vue");
});

const DriverForm = defineAsyncComponent(() => {
  return import("@/components/Register/DriverForm.vue");
});

const DocumentsForm = defineAsyncComponent(() => {
  return import("@/components/Register/DocumentsForm.vue");
});

const Alert = defineAsyncComponent(() => {
  return import("@/components/ui/alert/Alert.vue");
});

const AlertDescription = defineAsyncComponent(() => {
  return import("@/components/ui/alert/AlertDescription.vue");
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
    class="component-controller px-4 relative h-screen flex flex-col items-center justify-center"
  >
    <DriverForm @next="addStep" v-if="step === 1" />
    <CarForm @next="addStep" @back="minusStep" v-if="step === 2" />
    <DocumentsForm @next="addStep" @back="minusStep" v-if="step === 3" />
    <Alert class="mt-4">
      <InfoIcon class="w-4 h-4" />
      <AlertDescription>
        Ro'yxatdan o'tishda muammolarga duch kelsangiz, pastdagi telefon
        raqamlari orqali bizga murojaat qilishingiz mumkin.
      </AlertDescription>
      <AlertDescription> +998 99 994 76 13 </AlertDescription>
    </Alert>
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
