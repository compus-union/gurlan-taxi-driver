<script setup lang="ts">
import Message from "../UI/Message.vue";
import { IonButton, IonIcon, IonText } from "@ionic/vue";
import { folderOpenOutline } from "ionicons/icons";
import { ref } from "vue";

const events = defineEmits(["next", "back"]);

const pravaFront = ref<HTMLInputElement>();
const pravaBack = ref<HTMLInputElement>();
const texFront = ref<HTMLInputElement>();
const texBack = ref<HTMLInputElement>();
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
            <input hidden ref="pravaFront" type="file" accept=".png, .jpg" />
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
            <input hidden ref="pravaBack" type="file" accept=".png, .jpg" />
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
            <input hidden ref="texFront" type="file" accept=".png, .jpg" />
          </div>
          <div class="back">
            <IonButton @click="() => texBack?.click()" class="font-semibold" color="light">
              <IonIcon
                class="mr-3"
                slot="start"
                :icon="folderOpenOutline"
              ></IonIcon>
              Orqa tomon
            </IonButton>
            <input hidden ref="texBack" type="file" accept=".png, .jpg" />
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
