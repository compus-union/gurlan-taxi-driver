<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { computed, defineAsyncComponent } from "vue";
import { vMaska } from "maska";

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
</script>

<template>
  <div class="car-form">
    <Card class="bg-primary text-warning-foreground w-full">
      <CardHeader>
        <CardTitle>Avtomobil ma'lumotlari</CardTitle>
        <CardDescription
          >Mashina rusumi va rangini kiritishda faqat lotin harflaridan
          foydalaning.</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="form-group">
          <Label for="name">Mashina rusum</Label>
          <Input
            v-model:model-value.trim="authStore.car.name"
            id="name"
            type="text"
            required
            placeholder="Cobalt"
            :pattern="/^[-@./#&+\w\s]*$/"
          />
        </div>
        <div class="form-group">
          <Label for="number">Mashina raqam</Label>
          <Input
            v-model:model-value.trim="authStore.car.number"
            class="uppercase"
            id="number"
            type="text"
            placeholder="90 A 999 AA"
          />
        </div>
        <div class="form-group">
          <Label for="color">Rangi</Label>
          <Input
            v-model:model-value.trim="authStore.car.color"
            class="uppercase"
            id="color"
            type="text"
            placeholder="QORA"
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
        <Button
          @click="events('back')"
          type="button"
          class="w-full"
          variant="outline"
        >
          Orqaga
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
