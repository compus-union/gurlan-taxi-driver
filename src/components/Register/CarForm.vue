<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { computed, defineAsyncComponent, watch } from "vue";
import { vUppercase } from "@/directives/uppercase";
import { vMaska } from "maska";
import { TreesIcon } from "lucide-vue-next";

const Card = defineAsyncComponent(() => {
  return import("@/components/ui/card/Card.vue");
});
const CardContent = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardContent.vue");
});
const CardDescription = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardDescription.vue");
});
const CardHeader = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardHeader.vue");
});
const CardTitle = defineAsyncComponent(() => {
  return import("@/components/ui/card/CardTitle.vue");
});
const Input = defineAsyncComponent(() => {
  return import("@/components/ui/input/Input.vue");
});
const Label = defineAsyncComponent(() => {
  return import("@/components/ui/label/Label.vue");
});
const Button = defineAsyncComponent(() => {
  return import("@/components/ui/button/Button.vue");
});

const authStore = useAuth();

const disableButton = computed(() => {
  if (authStore.car?.name && authStore.car?.number && authStore.car?.color) {
    return false;
  } else {
    return true;
  }
});

const events = defineEmits(["next", "back"]);

watch(
  () => authStore.car.name,
  (newOne, oldOne) => {
    const letterPattern = /[a-zA-Z]/;
    const numberPattern = /\d/;

    const firstChar = newOne.charAt(0);
    const secondChar = newOne.charAt(0);

    if (!numberPattern.test(firstChar)) {
      authStore.car.name = "";
      return;
    }

    if (!numberPattern.test(secondChar)) {
      authStore.car.name = oldOne;
      return;
    }

  },
  { deep: true }
);
</script>

<template>
  <div class="car-form">
    <Card class="bg-primary text-warning-foreground">
      <CardHeader>
        <CardTitle>Ro'yxatdan o'tish</CardTitle>
        <CardDescription
          >Agarda ro'yxatdan o'tishda ba'zi muammolarga duch kelsangiz, pastdagi
          telefon raqamlarimizga murojaat qilishingiz mumkin.</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="form-group">
          <Label for="name">Mashina rusum</Label>
          <Input
            v-model:model-value.trim.lazy="authStore.car.name"
            id="name"
            type="text"
            required
            v-uppercase
            placeholder="COBALT"
          />
        </div>
        <div class="form-group">
          <Label for="number">Mashina raqam</Label>
          <Input
            v-model:model-value.trim.lazy="authStore.car.number"
            id="number"
            type="text"
            v-uppercase
            placeholder="90 A 999 AA"
          />
        </div>
        <div class="form-group">
          <Label for="password">Parol</Label>
          <Input
            v-model:model-value.trim.lazy="authStore.driver.password"
            id="password"
            type="text"
            placeholder="******"
          />
        </div>

        <Button
          @click="events('next')"
          :disabled="disableButton"
          class="w-full suit-theme"
          type="button"
        >
          Keyingisi
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
