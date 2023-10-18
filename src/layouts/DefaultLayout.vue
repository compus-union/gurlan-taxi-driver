<script lang="ts" setup>
import { Preferences } from "@capacitor/preferences";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLoading,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonSplitPane,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/vue";
import { onBeforeMount, onMounted, ref } from "vue";
import { useAuth } from "@/stores/auth";
import { loadingController, toastController } from "@ionic/core";
import { useMaps } from "@/stores/maps";

const authStore = useAuth();
const mapsStore = useMaps();

const toastMessage = ref<string>();
const loadingMessage = ref<string>();
const openToastBtn = ref<HTMLButtonElement>();
const openLoadingBtn = ref<HTMLButtonElement>();
const loadingComponent = ref<HTMLIonLoadingElement>();

const openLoading = async (message: string) => {
  loadingMessage.value = message;
  openLoadingBtn.value?.click();
};

const openToast = async (message: string) => {
  toastMessage.value = message;
  openToastBtn.value?.click();
};

const check = async () => {
  try {
    const { value: oneId } = await Preferences.get({ key: "driverOneId" });
    const { value: token } = await Preferences.get({ key: "auth_token" });

    await authStore.checkIfLoggedIn({
      oneId: oneId as string,
      token: token as string,
    });

    return;
  } catch (error: any) {
    const toast = await toastController.create({
      message:
        error.message ||
        "Xatolik sodir bo'ldi, dasturni boshqatdan ishga tushiring",
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

    await toast.present();
  }
};

const loadMap = async () => {
  try {
    await Promise.allSettled([mapsStore.loadMap("map")]);
  } catch (error: any) {}
};

onMounted(async () => {
  await openLoading("Yuklanmoqda...");

  setTimeout(async () => {
    const [checking, loadingMap] = await Promise.allSettled([
      check(),
      loadMap(),
    ]);

    if (checking.status === "fulfilled" && loadingMap.status === "fulfilled") {
      await loadingComponent.value?.dismiss();
      loadingMessage.value = "";
      return;
    }

    await openToast("Nimadir xato ketdi, dasturni boshqatdan ishga tushuring.");
    return;
  }, 100);
});
</script>

<template>
  <IonPage>
    <IonToast
      trigger="open-toast"
      :message="toastMessage"
      :duration="4000"
    ></IonToast>
    <button hidden id="open-toast" ref="openToastBtn"></button>

    <button id="open-loading" hidden ref="openLoadingBtn"></button>
    <IonLoading
      ref="loadingComponent"
      trigger="open-loading"
      :message="loadingMessage"
    ></IonLoading>

    <IonSplitPane contentId="my-content">
      <IonMenu contentId="my-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="p-4">
          <IonTitle>Hello</IonTitle>
        </IonContent>
      </IonMenu>

      <div class="ion-page font-bricolage flex" id="my-content">
        <IonHeader>
          <IonToolbar class="flex">
            <IonButtons slot="start">
              <IonButton>
                <IonMenuButton></IonMenuButton>
              </IonButton>
            </IonButtons>
            <IonTitle class="font-bricolage text-lg">
              Bugun: 45,000 so'm</IonTitle
            >
          </IonToolbar>
        </IonHeader>
        <IonContent class="fixed inset-0">
          <div id="map" class="h-[100vh] w-full"></div>
        </IonContent>
        <div
          class="ion-content fixed w-full border-t z-[99999] bg-transparent h-auto bottom-0 rounded-t-lg shadow"
        >
          <slot></slot>
        </div>
      </div>
    </IonSplitPane>
  </IonPage>
</template>

<style scoped>
.ion-content {
  background-color: var(--ion-background-color);
}
ion-menu::part(backdrop) {
  background-color: rgba(0, 0, 0, 0.694);
}

img[alt="Google"] {
  display: none;
}

div.gmnoprint {
  display: none;
}
</style>
