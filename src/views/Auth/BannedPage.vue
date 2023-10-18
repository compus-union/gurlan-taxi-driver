<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";
import { IonButton, IonIcon, IonText, IonToolbar } from "@ionic/vue";
import { locationOutline } from "ionicons/icons";
import { onBeforeMount } from "vue";

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
    <div class="banned-page flex flex-col justify-between h-screen">
      <div class="phone">
        <IonToolbar>
          <IonText slot="start">+998 99 944 76 13</IonText>
          <IonText slot="end">+998 97 171 31 47</IonText>
        </IonToolbar>
      </div>
      <div class="box flex flex-col text-center px-1">
        <IonText class="text-3xl font-bold mb-4">Bloklandingiz.</IonText>
        <IonText
          >Sizning ma'lumotlaringiz yoki so'ngi vaqtlarda qilgan
          xatti-harakatilaringiz orqali o'zaro kelishuv asosida qo'l qo'yilgan
          nizom qoidalarini buzganligingiz sababli, adminstratsiya tomonidan
          akkauntingizga cheklov o'rnatildi. Holatni batafsil o'rganish uchun
          tepada ko'rsatilgan telefon raqamlariga murojaat qiling yoki pastda
          ko'rsatilgan manzil bo'yicha ofisimizga tashrif buyurib,
          adminstratsiyamiz bilan uchrashing
        </IonText>
        <IonButton @click="check" expand="block" class="font-bold mt-4"
          >Yangilash</IonButton
        >
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