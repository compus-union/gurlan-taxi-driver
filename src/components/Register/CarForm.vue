<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { computed } from "vue";
import { vUppercase } from "@/directives/uppercase";

const authStore = useAuth();

const disableButton = computed(() => {
  if (authStore.car?.name && authStore.car?.number && authStore.car?.color) {
    return false;
  } else {
    return true;
  }
});

const events = defineEmits(["next", "back"]);
</script>

<template>
  <div>Car form</div>
</template>

<style scoped>

</style>