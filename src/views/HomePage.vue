<script lang="ts" setup>
import { IonPage, IonButton } from "@ionic/vue";
import { ref } from "vue";

const fileInputRef = ref<HTMLElement>();
const displayImgRef = ref<HTMLElement>();
const size = ref("0")

const openFileDialog = () => {
  fileInputRef.value?.click();
};

const setImages = (e: any) => {
  const file = e.target.files[0];

  const fileReader = new FileReader();

  fileReader.onload = (e) => {
    displayImgRef.value?.setAttribute("src", e.target?.result as any);
  };

  fileReader.readAsDataURL(file);

  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

  size.value = sizeInMB
};
</script>

<template>
  <IonPage>
    
  </IonPage>
</template>
