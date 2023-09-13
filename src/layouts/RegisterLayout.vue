<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  IonCheckbox,
  IonRouterOutlet,
  IonText,
} from "@ionic/vue";
</script>

<template>
  <IonPage>
    <IonContent class="auth-content font-bricolage">
      <IonRouterOutlet></IonRouterOutlet>
    </IonContent>
  </IonPage>
</template>
