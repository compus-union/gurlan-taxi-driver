<script setup lang="ts">
import { IonText, IonButton, IonCheckbox } from "@ionic/vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";
import Message from "@/components/UI/Message.vue";
import { vMaska } from "maska";
import { vUppercase } from "@/directives/uppercase";

const authStore = useAuth();

const checkValidation = async () => {
  const { value: oneId } = await Preferences.get({ key: "driverOneId" });
  const { value: token } = await Preferences.get({ key: "auth_token" });

  await authStore.checkIfValidated({ oneId, token });
};

const showPass = ref<boolean>();

onBeforeMount(async () => {
  await checkValidation();
});

const disableButton = computed(() => {
  if (
    authStore.driver?.password.length >= 8 &&
    authStore.driver?.oneId?.length === 9
  ) {
    return false;
  } else {
    return true;
  }
});
</script>

<template>
  <AuthLayout>
    <div
      class="login-page container mx-auto sm:px-4 px-2 flex items-center justify-center h-screen"
    >
      <div class="wrapper">
        <Message>
          Sizga berilgan One Id va o'zingiz kiritgan parolni yozing.
        </Message>
        <div class="form border my-border rounded p-4 mt-4">
          <IonText class="text-xl font-bold">Tizimga kirish</IonText>
          <div class="groups mt-4 space-y-3">
            <div class="form-group flex flex-col items-start">
              <label class="mb-1" for="oneId">One Id</label>
              <input
                autocomplete="off"
                required
                v-model.trim="authStore.driver.oneId"
                class="border my-border rounded w-full px-2 py-1 outline-none bg-transparent"
                type="text"
                placeholder="One Id"
                id="oneId"
                v-maska
                v-uppercase
                data-maska="@@#######"
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
              @click="() => console.log(disableButton)"
              :disabled="disableButton"
              class="default-btn w-full font-bold uppercase"
              type="button"
              >KIRISH
            </IonButton>
          </div>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>
@/stores/auth/auth
