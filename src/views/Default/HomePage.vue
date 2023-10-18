<script lang="ts" setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { IonButton } from "@ionic/vue";
import { toastController } from "@ionic/core";

const openToast = async () => {
  const toast = await toastController.create({
    message: "Hello",
    duration: 4000,
    buttons: [
      {
        text: "OK",
        async handler() {
          await toast.dismiss();
        },
      },
    ],
  });

  await toast.present()
};
</script>

<template>
  <DefaultLayout>
    <!-- <Loading /> -->
    <div class="flex items-center w-screen justify-center h-auto">
      <IonButton @click="openToast">Open</IonButton>
    </div>
  </DefaultLayout>
</template>
