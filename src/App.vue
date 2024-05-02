<script setup lang="ts">
import { Toaster } from "vue-sonner";
import { PageTransition } from "vue3-page-transition";
</script>

<template>
  <div class="content">
    <vue3-progress-bar></vue3-progress-bar>
    <Toaster
      position="top-center"
      :duration="4000"
      :toast-options="{ class: 'my-toast' }"
    />
    <router-view v-slot="{ Component }">
      <PageTransition name="fade-in-up" appear>
        <component :is="Component" />
      </PageTransition>
    </router-view>
  </div>
</template>

<style>
.scale-slide-enter-active,
.scale-slide-leave-active {
  position: absolute;
  transition: all 0.85s ease;
}

.scale-slide-enter-from {
  left: -100%;
}

.scale-slide-enter-to {
  left: 0%;
}

.scale-slide-leave-from {
  transform: scale(1);
}

.scale-slide-leave-to {
  transform: scale(0.8);
}

.vue3-progress-bar-container .vue3-progress-bar {
  background-color: #fcdc2a !important;
  height: 5px !important;
  z-index: 9999999 !important;
}

.my-toast,
.my-toast * {
  @apply text-lg;
}
</style>
