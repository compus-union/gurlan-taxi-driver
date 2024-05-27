<script lang="ts" setup>
import { LocalNotifications } from "@capacitor/local-notifications";
import { useRouter } from "vue-router";

const router = useRouter();

async function schedule() {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "Mijoz sizni kutmoqda",
        body: "Mijoz sizni manzilida kutib turibdi, uni kuttirib qo'ymang",
        id: 2,
      },
    ],
  });
}
</script>

<template>
  <div class="home-page">

  </div>
</template>
