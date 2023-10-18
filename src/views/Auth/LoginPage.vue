<script setup lang="ts">
import { IonText, IonButton, IonCheckbox, toastController } from "@ionic/vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";
import Message from "@/components/UI/Message.vue";
import { vMaska } from "maska";
import { vUppercase } from "@/directives/uppercase";
import {
  DriverResponseStatus,
  DriverValidation,
  UniversalResponseStatus,
} from "@/constants";
import { useLoading } from "@/stores/loading";
import router from "@/router";
import { authInstance } from "@/http";
import { key } from "ionicons/icons";

const authStore = useAuth();
const loadingStore = useLoading();

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

const action = async () => {
  try {
    const result = await authStore.login({
      oneId: authStore.driver.oneId as string,
      password: authStore.driver.password,
    });

    const toast = await toastController.create({
      message: result.msg,
      duration: 10000,
      buttons: [
        {
          text: "OK",
          async handler() {
            await toast.dismiss();
          },
        },
      ],
    });

    await toast.present();

    if (result.status === DriverResponseStatus.AUTH_WARNING) {
      return;
    }

    if (result.status === DriverResponseStatus.DRIVER_BANNED) {
      await Promise.allSettled([
        Preferences.remove({ key: "validation" }),
        Preferences.set({ key: "banned", value: "true" }),
        router.push("/banned"),
      ]);

      return;
    }

    if (result.status === DriverResponseStatus.VALIDATION_FAILED) {
      await Promise.allSettled([
        Preferences.remove({ key: "banned" }),
        Preferences.set({
          key: "validation",
          value: DriverValidation.INVALIDATED,
        }),
        router.push("/invalidation"),
      ]);

      return;
    }

    if (result.status === DriverResponseStatus.VALIDATION_WAITING) {
      await Promise.allSettled([
        Preferences.remove({ key: "banned" }),
        Preferences.set({
          key: "validation",
          value: DriverValidation.WAITING,
        }),
        router.push("/validation-waiting"),
      ]);

      return;
    }

    if (result.status === UniversalResponseStatus.ERR_NETWORK) {
      return;
    }

    if (result.status === DriverResponseStatus.DRIVER_NOT_FOUND) {
      await Promise.allSettled([Preferences.clear(), router.push("/register")]);
      return;
    }

    if (
      result.status === DriverResponseStatus.DRIVER_TOKEN_NOT_FOUND ||
      result.status === DriverResponseStatus.DRIVER_TOKEN_NOT_VALID ||
      result.status === DriverResponseStatus.HEADERS_NOT_FOUND
    ) {
      return;
    }

    if (result.status === DriverResponseStatus.LOGIN_DONE) {
      await Promise.allSettled([
        Preferences.set({ key: "validation", value: DriverValidation.SUCCESS }),
        Preferences.set({ key: "driverOneId", value: result.oneId }),
        Preferences.set({ key: "auth_token", value: result.token }),
      ]);

      setTimeout(() => {
        router.push("/home");
      }, 200);

      const { value } = await Preferences.get({ key: "validation" });
      console.log(value);

      return;
    }
  } catch (error: any) {
    if (!error.response) {
      const toast = await toastController.create({
        message: "Serverda xatolik, boshqatdan yoki keyinroq urinib ko'ring.",
        duration: 4000,
        buttons: [
          {
            text: "OK",
            async handler() {
              await toast.dismiss();
            },
          },
        ],
      });

      await toast.present();
      return;
    }
    const toast = await toastController.create({
      message:
        error.response.data.msg ||
        error.message ||
        "Serverda xatolik, boshqatdan yoki keyinroq urinib ko'ring.",
      duration: 4000,
      buttons: [
        {
          text: "OK",
          async handler() {
            await toast.dismiss();
          },
        },
      ],
    });

    await toast.present();
    return;
  }
};
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
              @click="action"
              :disabled="loadingStore.loading || disableButton"
              class="default-btn w-full font-bold uppercase"
              type="button"
              >KIRISH
            </IonButton>
          </div>
        </div>
        <Message class="mt-4"
          >Agar tizimga kirishda muammolarga duch kelayotgan bo'lsangiz,
          quyidagi raqamlarga murojaat qiling: <br />
          <br />
          +998 99 944 76 13 <br />
          +998 95 171 31 47</Message
        >
      </div>
    </div>
  </AuthLayout>
</template>
@/stores/auth/auth
