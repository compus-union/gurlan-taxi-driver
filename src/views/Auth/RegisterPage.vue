<script setup lang="ts">
import { ref } from "vue";
import { InfoIcon } from "lucide-vue-next";
import CarForm from "@/components/Register/CarForm.vue";
import DriverForm from "@/components/Register/DriverForm.vue";
import DocumentsForm from "@/components/Register/DocumentsForm.vue";
import Alert from "@/components/ui/alert/Alert.vue";
import AlertDescription from "@/components/ui/alert/AlertDescription.vue";
import { LocalNotifications } from "@capacitor/local-notifications";

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
async function schedule() {
  setTimeout(async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Mijoz sizni kutmoqda",
          body: "Mijoz sizni manzilida kutib turibdi, uni kuttirib qo'ymang",
          id: 2,
        },
      ],
    });
  }, 5000);
}
</script>

<template>
  <div
    class="component-controller px-4 relative h-screen flex flex-col items-center justify-center"
  >
    <DriverForm @next="addStep" v-if="step === 1" />
    <CarForm @next="addStep" @back="minusStep" v-if="step === 2" />
    <DocumentsForm @next="addStep" @back="minusStep" v-if="step === 3" />
    <button @click="schedule">Redirect</button>

    <Alert v-show="step !== 3" class="mt-4">
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
