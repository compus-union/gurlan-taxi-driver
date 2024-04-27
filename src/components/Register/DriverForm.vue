<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { computed, ref } from "vue";
import { vMaska } from "maska";
import { MaskInputOptions } from "maska";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
    <Card class="bg-primary text-warning-foreground w-full">
      <CardHeader>
        <CardTitle>Haydovchi ma'lumotlari</CardTitle>
        <CardDescription
          >Parol kamida 8 ta belgidan, bitta katta harfdan, faqat lotin
          harflaridan va raqamlardan tashkil topishi kerak. Bo'sh joy va
          ortiqcha belgilar bilan yozish mumkin emas.</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="form-group">
          <Label for="fullname">Ism familiya</Label>
          <Input
            required
            v-model:model-value.trim.lazy="authStore.driver.fullname"
            id="fullname"
            type="text"
            v-maska:[maskOptions]
            placeholder="Sardor Aminov"
          />
        </div>
        <div class="form-group">
          <Label for="phone">Telefon raqam</Label>
          <Input
            v-model:model-value.trim.lazy="authStore.driver.phone[0]"
            id="phone"
            type="text"
            required
            v-maska
            data-maska="+998 ## ### ## ##"
            placeholder="+998"
          />
        </div>
        <div class="form-group">
          <Label for="password">Parol</Label>
          <Input
            required
            v-model:model-value.trim.lazy="authStore.driver.password"
            id="password"
            :type="showPass ? 'text' : 'password'"
            placeholder="******"
          />
        </div>
        <div class="form-group flex items-center space-x-4">
          <Checkbox
            v-model:checked="showPass"
            class="suit-theme-checkbox"
            id="showPass"
          />
          <Label for="showPass"> Parolni ko'rsatish </Label>
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
