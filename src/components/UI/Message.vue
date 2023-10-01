<script setup lang="ts">
import { IonText } from "@ionic/vue";
</script>

<template>
  <div class="message bg-[#f4f5f8] rounded px-4 py-2">
    <IonText>
      <slot></slot>
    </IonText>
  </div>
</template>

<style scoped>
@media (prefers-color-scheme: dark) {
  .message {
    @apply bg-neutral-900
  }
}
</style>
