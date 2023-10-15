<script lang="ts">
import { Preferences } from "@capacitor/preferences";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { onBeforeMount } from "vue";
import { useAuth } from "@/stores/auth";

export default {
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonSplitPane,
    IonTitle,
    IonToolbar,
  },

  setup() {
    const authStore = useAuth();

    const check = async () => {
      const { value: oneId } = await Preferences.get({ key: "driverOneId" });
      const { value: token } = await Preferences.get({ key: "auth_token" });

      await authStore.checkIfLoggedIn({
        oneId: oneId as string,
        token: token as string,
      });
    };

    onBeforeMount(async () => {
      await check();
    });
  },
};
</script>


<template>
  <IonPage>
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
