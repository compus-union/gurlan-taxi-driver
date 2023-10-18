<script setup lang="ts">
import { IonText, IonToolbar, IonIcon, IonButton } from "@ionic/vue";
import { locationOutline } from "ionicons/icons";
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
  <AuthLayout>
    <div class="still-waiting flex flex-col justify-between h-screen">
      <div class="phone">
        <IonToolbar>
          <IonText slot="start">+998 99 944 76 13</IonText>
          <IonText slot="end">+998 97 171 31 47</IonText>
        </IonToolbar>
      </div>
      <div class="box flex flex-col text-center px-1">
        <IonText class="text-3xl font-bold mb-4">Kuting.</IonText>
        <IonText
          >Sizni ma'lumotlaringiz adminlarimiz tomonidan uzog'i 24 soat ichida
          tekshirib chiqiladi. Iltimos, akkauntingiz tasdiqlanganidan keyin 3
          kun ichida offislarimizdan biriga tashrif buyurishingizni so'rab
          qolamiz.</IonText
        >
        <IonButton @click="check" expand="block" class="font-bold mt-4">Yangilash</IonButton>
      </div>
      <div class="locations text-center flex flex-col mb-6">
        <IonText
          ><IonIcon :icon="locationOutline"></IonIcon> Mo'ljal: Eski bozor yoni
        </IonText>
        <a href="#" class="underline font-bold">Xaritada ko'rish</a>
      </div>
    </div>
  </AuthLayout>
</template>
@/stores/auth/auth