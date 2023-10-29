<script setup lang="ts">
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
  // show loading
  try {
    const result = await authStore.register({
      driver: authStore.driver,
      car: authStore.car,
      files: formData,
    });

    if (result.status === ResponseStatus.AUTH_WARNING) {
      // dismiss loading

      // show error with toast

      return;
    }

    if (result.status === ResponseStatus.DRIVER_REGISTRATION_DONE) {
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
        // dismiss loading

        // show error with toast

        return;
      }

      if (sendingPictures.data.status !== ResponseStatus.IMAGES_SENT) {
        // dismiss loading

        // show error with toast

        return;
      }

      // dismiss loading

      // show error with toast

      setTimeout(() => {
        router.push("/validation-waiting");
      }, 500);

      return;
    }

    if (result.status === ResponseStatus.UNKNOWN_ERR) {
      // dismiss loading

      // show error with toast

      return;
    }
  } catch (error: any) {
    // dismiss loading

    if (!error.response) {
      // show error with toast

      return;
    }
    // show error with toast

    return;
  } finally {
    // dismiss loading
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
  <div>Documents form</div>
</template>

<style scoped></style>
