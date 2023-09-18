<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
</script>

<template>
  <IonPage>
    <IonContent class="auth-layout font-bricolage">
      <slot></slot>
    </IonContent>
  </IonPage>
</template>
