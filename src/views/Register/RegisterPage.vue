<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { defineAsyncComponent, ref } from "vue";

const DriverForm = defineAsyncComponent(() => {
  return import("@/components/Register/DriverForm.vue")
})

const steps = ref(1)
</script>

<template>
  <AuthLayout> 
    <div class="component-controller">
      <DriverForm v-if="steps === 1"/>
    </div>
  </AuthLayout>
</template>
