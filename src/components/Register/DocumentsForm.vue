<script setup lang="ts">
import Message from "../UI/Message.vue";
import {
  IonButton,
  IonIcon,
  IonText,
  loadingController,
  toastController,
} from "@ionic/vue";
import { folderOpenOutline } from "ionicons/icons";
import { useAuth } from "@/stores/auth";
import { computed, ref } from "vue";
import { useLoading } from "@/stores/loading";
import router from "@/router";
import { authInstance } from "@/http";
import { ResponseStatus } from "@/constants";

const loadingStore = useLoading();
const formData = new FormData();

const events = defineEmits(["next", "back"]);
const authStore = useAuth();

const files = ref<File[]>([]);

const pravaFront = ref<HTMLInputElement>();
const pravaBack = ref<HTMLInputElement>();
const texFront = ref<HTMLInputElement>();
const texBack = ref<HTMLInputElement>();

const pravaFrontImg = ref<boolean>(false);
const pravaBackImg = ref<boolean>(false);
const texFrontImg = ref<boolean>(false);
const texBackImg = ref<boolean>(false);

const pushFile = (
  file: File,
  name: "pFront" | "pBack" | "tFront" | "tBack"
) => {
  if (name === "pFront") {
    pravaFrontImg.value = true;
  }

  if (name === "pBack") {
    pravaBackImg.value = true;
  }

  if (name === "tFront") {
    texFrontImg.value = true;
  }

  if (name === "tBack") {
    texBackImg.value = true;
  }

  files.value.push(file);
  formData.append("images", file);

  return;
};

const action = async () => {
  const loading = await loadingController.create({
    message: "Ma'lumotlaringiz jo'natilmoqda",
  });

  await loading.present();
  try {
    const result = await authStore.register({
      driver: authStore.driver,
      car: authStore.car,
      files: formData,
    });

    if (result.status === ResponseStatus.AUTH_WARNING) {
      await loading.dismiss();
      const toast = await toastController.create({
        message: result.msg,
        duration: 4000,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            handler: async () => {
              await toast.dismiss();
            },
          },
        ],
      });

      await toast.present();

      return;
    }

    if (result.status === ResponseStatus.REGISTRATION_DONE) {
      const sendingPictures = await authInstance.post(
        `/send-images/${result.oneId}/${authStore.plainPass}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!sendingPictures) {
        await loading.dismiss();

        const warningToast = await toastController.create({
          message:
            "Rasmlarni yuborishda muammo. Internetingizni tekshirib boshqatdan urinib ko'ring.",
          duration: 4000,
          buttons: [
            {
              text: "OK",
              role: "cancel",
              handler: async () => {
                await warningToast.dismiss();
              },
            },
          ],
        });

        await warningToast.present();

        return;
      }

      if (sendingPictures.data.status !== ResponseStatus.IMAGES_SENT) {
        await loading.dismiss();

        const warningToast = await toastController.create({
          message:
            sendingPictures.data.msg ||
            "Rasmlarni yuborishda muammo. Boshqatdan urinib ko'ring",
          duration: 4000,
          buttons: [
            {
              text: "OK",
              role: "cancel",
              handler: async () => {
                await warningToast.dismiss();
              },
            },
          ],
        });

        await warningToast.present();

        return;
      }

      await loading.dismiss();

      const toast = await toastController.create({
        message: result.msg,
        duration: 4000,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            handler: async () => {
              await toast.dismiss();
            },
          },
        ],
      });

      await toast.present();

      setTimeout(() => {
        router.push("/validation-waiting");
      }, 500);

      return;
    }

    if (result.status === ResponseStatus.UNKNOWN_ERR) {
      await loading.dismiss();

      const toast = await toastController.create({
        message: result.msg,
        duration: 4000,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            handler: async () => {
              await toast.dismiss();
            },
          },
        ],
      });

      await toast.present();

      return;
    }
  } catch (error: any) {
    await loading.dismiss();

    if (!error.response) {
      const toast = await toastController.create({
        message: "Internetingiz bilan aloqa mavjudligini tekshirib ko'ring",
        duration: 4000,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            handler: async () => {
              await toast.dismiss();
            },
          },
        ],
      });

      await toast.present();

      return;
    }
    const toast = await toastController.create({
      message: error.message,
      duration: 4000,
      buttons: [
        {
          text: "OK",
          role: "cancel",
          handler: async () => {
            await toast.dismiss();
          },
        },
      ],
    });

    await toast.present();
    return;
  } finally {
    await loading.dismiss();
  }
};

const disableButton = computed(() => {
  if (loadingStore.loading) {
    return true;
  } else {
    return files.value.length !== 4 ? true : false;
  }
});
</script>

<template>
  <div class="car-form container mx-auto sm:px-4 px-2">
    <Message class="py-3 leading-relaxed"
      >Haydovchilik guvohnomangiz va avtomobilning texnik pasportini har
      ikkalasining ham old va orqa tomonlarini rasmga olib tegishli maydonlarga
      yuklang. Qabul qilinadigan formatlar: JPEG, PNG</Message
    >
    <div class="form my-4 space-y-6">
      <div class="first-part">
        <IonText class="text-xl">Haydovchilik guvohnomasi</IonText>
        <div class="parts flex mt-2 flex-wrap">
          <div class="front">
            <IonButton
              @click="() => pravaFront?.click()"
              class="font-semibold"
              color="light"
            >
              <IonIcon
                class="mr-3"
                slot="start"
                :icon="folderOpenOutline"
              ></IonIcon>
              Old tomon
            </IonButton>
            <p class="text-sm opacity-50" v-if="pravaFrontImg">Rasm tanlandi</p>
            <input
              @change="(e:any) => pushFile(e.target.files[0], 'pFront')"
              hidden
              ref="pravaFront"
              type="file"
              accept=".png, .jpg"
            />
          </div>
          <div class="back">
            <IonButton
              @click="() => pravaBack?.click()"
              class="font-semibold"
              color="light"
            >
              <IonIcon
                class="mr-3"
                slot="start"
                :icon="folderOpenOutline"
              ></IonIcon>
              Orqa tomon
            </IonButton>
            <p class="text-sm opacity-50" v-if="pravaBackImg">Rasm tanlandi</p>
            <input
              @change="(e:any) => pushFile(e.target.files[0], 'pBack')"
              hidden
              ref="pravaBack"
              type="file"
              accept=".png, .jpg"
            />
          </div>
        </div>
      </div>
      <div class="first-part">
        <IonText class="text-xl">Avtomobil pasporti</IonText>
        <div class="parts flex mt-2 flex-wrap">
          <div class="front">
            <IonButton
              @click="() => texFront?.click()"
              class="font-semibold"
              color="light"
            >
              <IonIcon
                class="mr-3"
                slot="start"
                :icon="folderOpenOutline"
              ></IonIcon>
              Old tomon
            </IonButton>
            <p class="text-sm opacity-50" v-if="texFrontImg">Rasm tanlandi</p>
            <input
              @change="(e:any) => pushFile(e.target.files[0], 'tFront')"
              hidden
              ref="texFront"
              type="file"
              accept=".png, .jpg"
            />
          </div>
          <div class="back">
            <IonButton
              @click="() => texBack?.click()"
              class="font-semibold"
              color="light"
            >
              <IonIcon
                class="mr-3"
                slot="start"
                :icon="folderOpenOutline"
              ></IonIcon>
              Orqa tomon
            </IonButton>
            <p class="text-sm opacity-50" v-if="texBackImg">Rasm tanlandi</p>
            <input
              @change="(e:any) => pushFile(e.target.files[0], 'tBack')"
              hidden
              ref="texBack"
              type="file"
              accept=".png, .jpg"
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <IonButton
          id="loading-trigger"
          :disabled="disableButton"
          @click="action"
          class="default-btn w-full font-bold uppercase"
          type="button"
          >Jo'natish
        </IonButton>
        <IonButton
          @click="events('back')"
          class="w-full font-bold uppercase"
          type="button"
          fill="outline"
          >Orqaga</IonButton
        >
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