<script setup lang="ts">
import Message from "../UI/Message.vue";
import { IonButton, IonCheckbox, IonText } from "@ionic/vue";
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
  <div class="driver-form container mx-auto sm:px-4 px-2">
    <Message> Iltimos, lotinchada yozing </Message>
    <div class="form border my-border rounded p-4 mt-4">
      <IonText class="text-xl font-bold"> Haydovchi ma’lumotlari</IonText>
      <div class="groups mt-4 space-y-3">
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="fullname">Ism familiya</label>
          <input
            autocomplete="off"
            required
            v-model.trim="authStore.driver.fullname"
            class="border my-border rounded w-full px-2 py-1 outline-none bg-transparent"
            type="text"
            placeholder="Sardor Aminov"
            id="fullname"
            v-maska:[maskOptions]
          />
        </div>
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="phone">Telefon raqamingiz</label>
          <input
            required
            v-model.trim="authStore.driver.phone[0]"
            class="border my-border rounded w-full px-2 py-1 outline-none bg-transparent"
            type="text"
            placeholder="+998"
            id="phone"
            v-maska
            data-maska="+998 ## ### ## ##"
          />
        </div>
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="password">Parolingiz</label>
          <input
            required
            v-model.trim="authStore.driver.password"
            class="border my-border rounded w-full px-2 py-1 outline-none bg-transparent"
            :type="showPass ? 'text' : 'password'"
            placeholder="*****"
            id="password"
          />
        </div>
        <div class="form-group">
          <IonCheckbox v-model="showPass" label-placement="end"
            >Parolni ko'rsatish</IonCheckbox
          >
        </div>
        <IonButton
          :disabled="disableButton"
          @click="events('next')"
          class="default-btn w-full font-bold uppercase"
          type="button"
          >Keyingisi
        </IonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-color-scheme: dark) {
  .default-btn {
    color: white;
  }
}

@media (prefers-color-scheme: dark) {
  .default-btn {
    color: black;
  }
}

@media (prefers-color-scheme: light) {
  .my-border {
    @apply border-gray-200;
  }
}

@media (prefers-color-scheme: dark) {
  .my-border {
    @apply border-neutral-700;
  }
}
</style>
@/stores/auth/auth