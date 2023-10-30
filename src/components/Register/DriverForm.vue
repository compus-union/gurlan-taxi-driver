<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { computed, defineAsyncComponent, ref } from "vue";
import { vMaska } from "maska";
import { MaskInputOptions } from "maska";

const Card = defineAsyncComponent(() => {
  return import("@/components/ui/card/Card.vue");
});
const CardContent = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardContent.vue");
});
const CardDescription = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardDescription.vue");
});
const CardFooter = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardFooter.vue");
});
const CardHeader = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardHeader.vue");
});
const CardTitle = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardTitle.vue");
});

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
  <div class="driver-form">
    <Card class="bg-primary text-warning-foreground">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent> Card Content </CardContent>
      <CardFooter> Card Footer </CardFooter>
    </Card>
  </div>
</template>

<style scoped></style>
