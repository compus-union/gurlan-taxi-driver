<script setup lang="ts">
import Message from "../UI/Message.vue";
import { IonButton, IonIcon, IonText } from "@ionic/vue";
import { folderOpenOutline } from "ionicons/icons";
import { useAuth } from "@/stores/auth";
import { computed, ref } from "vue";
import axios from "axios";
const formData = new FormData();

interface MyFile extends File {
  givenName: string;
}

const events = defineEmits(["next", "back"]);
const authStore = useAuth();

const files = ref<File[]>([]);

const pravaFront = ref<HTMLInputElement>();
const pravaBack = ref<HTMLInputElement>();
const texFront = ref<HTMLInputElement>();
const texBack = ref<HTMLInputElement>();

const pravaFrontImg = computed(() => {
  console.log(pravaFront.value);
  
  if (pravaFront.value) {
    if (pravaFront.value.files) {
      return pravaFront.value.files[0] ? true : false;
    }
  }
});
const pravaBackImg = computed(() => {
  if (pravaBack.value) {
    if (pravaBack.value.files) {
      return pravaBack.value.files[0] ? true : false;
    }
  }
});
const texFrontImg = computed(() => {
  if (texFront.value) {
    if (texFront.value.files) {
      return texFront.value.files[0] ? true : false;
    }
  }
});
const texBackImg = computed(() => {
  if (texBack.value) {
    if (texBack.value.files) {
      return texBack.value.files[0] ? true : false;
    }
  }
});

const pushFile = (file: File) => {
  files.value.push(file);
  console.log(pravaFrontImg.value);
  
  return;
};
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
              <p v-if="pravaFrontImg">Rasm tanlandi</p>
            </IonButton>
            <input
              @change="(e:any) => pushFile(e.target.files[0])"
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
            <input
              @change="(e:any) => pushFile(e.target.files[0])"
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
            <input
              @change="(e:any) => pushFile(e.target.files[0])"
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
            <input
              @change="(e:any) => pushFile(e.target.files[0])"
              hidden
              ref="texBack"
              type="file"
              accept=".png, .jpg"
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <IonButton class="default-btn w-full font-bold uppercase" type="button"
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
