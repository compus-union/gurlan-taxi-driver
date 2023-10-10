<script setup lang="ts">
import Message from "../UI/Message.vue";
import { IonButton, IonText } from "@ionic/vue";
import { useAuth } from "@/stores/auth";
import { computed } from "vue";
import { vUppercase } from "@/directives/uppercase";

const authStore = useAuth();

const disableButton = computed(() => {
  if (authStore.car?.name && authStore.car?.number && authStore.car?.color) {
    return false;
  } else {
    return true;
  }
});

const events = defineEmits(["next", "back"]);
</script>

<template>
  <div class="car-form container mx-auto sm:px-4 px-2">
    <Message> Iltimos, lotinchada yozing </Message>
    <div class="form my-border border rounded p-4 mt-4">
      <IonText class="text-xl font-bold"> Avtomobil ma’lumotlari</IonText>
      <div class="groups mt-4 space-y-3">
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="name">Rusumi</label>
          <input
            v-model.trim="authStore.car.name"
            required
            class="border my-border rounded w-full px-2 py-1 outline-none bg-transparent"
            type="text"
            placeholder="COBALT"
            id="name"
            v-uppercase
          />
        </div>
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="number">Raqami</label>
          <input
            v-model.trim="authStore.car.number"
            required
            class="border rounded my-border w-full px-2 py-1 outline-none bg-transparent"
            type="text"
            placeholder="90 A 999 AA"
            id="number"
            v-uppercase
          />
        </div>
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="color">Rangi</label>
          <input
            required
            v-model.trim="authStore.car.color"
            class="border rounded my-border w-full px-2 py-1 outline-none bg-transparent"
            type="text"
            placeholder="OQ"
            id="color"
            v-uppercase
          />
        </div>
        <IonButton
          :disabled="disableButton"
          @click="events('next')"
          class="default-btn w-full font-bold uppercase"
          type="button"
          >Keyingisi
        </IonButton>
        <IonButton
          @click="events('back')"
          class="w-full font-bold uppercase"
          type="button"
          fill="outline"
          >Orqaga</IonButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-color-scheme: dark) {
  .default-btn {
    color: white;
  }
}

@media (prefers-color-scheme: dark) {
  .default-btn {
    color: black;
  }
}

@media (prefers-color-scheme: light) {
  .my-border {
    @apply border-gray-200;
  }
}

@media (prefers-color-scheme: dark) {
  .my-border {
    @apply border-neutral-700;
  }
}
</style>
@/stores/auth/auth