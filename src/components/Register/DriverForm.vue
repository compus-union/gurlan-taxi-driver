<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { computed, ref } from "vue";
import { vMaska } from "maska";
import { MaskInputOptions } from "maska";

const authStore = useAuth();

const events = defineEmits(["next", "back"]);

const disableButton = computed(() => {
  if (
    authStore.driver?.fullname.includes(" ") &&
    authStore.driver?.password.length >= 8 &&
    authStore.driver?.phone[0].length === 17
  ) {
    return false;
  } else {
    return true;
  }
});

const showPass = ref<boolean>(false);

const maskOptions = ref({
  postProcess(value: string): string {
    function captilizeFirstLetterAndFirstLettersAfterSpace(
      input: string
    ): string {
      return input
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
    }
    return captilizeFirstLetterAndFirstLettersAfterSpace(value);
  },
  mask: "@",
  eager: true,
  tokens: {
    "@": {
      pattern: /[a-zA-ZÀ-ú ]/,
      repeated: true,
    },
  },
} as MaskInputOptions);
</script>

<template>
  <div>Driver form</div>
</template>

<style scoped>

</style>