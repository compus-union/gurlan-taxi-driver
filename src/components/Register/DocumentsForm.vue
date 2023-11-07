<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { computed, defineAsyncComponent, ref } from "vue";
import { useLoading } from "@/stores/loading";
import router from "@/router";
import { authInstance } from "@/http";
import { ResponseStatus } from "@/constants";

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
const Label = defineAsyncComponent(() => {
  return import("@/components/ui/label/Label.vue");
});
const Input = defineAsyncComponent(() => {
  return import("@/components/ui/input/Input.vue");
});
const Button = defineAsyncComponent(() => {
  return import("@/components/ui/button/Button.vue");
});
const PravaFrontIcon = defineAsyncComponent(() => {
  return import("@/components/custom-icons/PravaFront.vue");
});
const TexFrontIcon = defineAsyncComponent(() => {
  return import("@/components/custom-icons/TexFront.vue");
});
const PravaTexBackIcon = defineAsyncComponent(() => {
  return import("@/components/custom-icons/PravaTexBack.vue");
});

const loadingStore = useLoading();
const formData = new FormData();

const events = defineEmits(["next", "back"]);
const authStore = useAuth();

const files = ref<File[]>([]);

const pravaFront = ref<HTMLInputElement>();
const pravaBack = ref<HTMLInputElement>();
const texFront = ref<HTMLInputElement>();
const texBack = ref<HTMLInputElement>();

const pravaFrontImg = ref();
const pravaBackImg = ref();
const texFrontImg = ref();
const texBackImg = ref();

const pushFile = (
  filesArg: FileList,
  name: "pFront" | "pBack" | "tFront" | "tBack"
) => {
  const createImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (name === "pFront") {
        pravaFrontImg.value = e.target?.result;
      }
      if (name === "pBack") {
        pravaBackImg.value = e.target?.result;
      }
      if (name === "tFront") {
        texFrontImg.value = e.target?.result;
      }
      if (name === "tBack") {
        texBackImg.value = e.target?.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (files: FileList) => {
    if (!files.length) return;
    createImage(files[0]);
  };

  onFileChange(filesArg);

  files.value.push(filesArg[0]);
  formData.append("images", filesArg[0]);

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
  <div class="document-form">
    <Card class="bg-primary text-warning-foreground w-full">
      <CardHeader>
        <CardTitle>Haydovchi hujjatlari</CardTitle>
        <CardDescription
          >So'ralgan hujjatlarning orqa va oldi tomonlarini rasm holatida
          alohida alohida joylashtirish lozim</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="wrapper">
          <CardTitle>Haydovchilik guvohnomasi</CardTitle>
          <div class="groups flex gap-x-6">
            <div class="form-group w-full flex flex-col">
              <div
                class="icon flex flex-col items-center justify-center w-[90%] my-3 h-[50%]"
              >
                <PravaFrontIcon v-show="!pravaFrontImg" class="w-full" />
                <img
                  v-show="pravaFrontImg"
                  class="w-full h-full object-cover"
                  :src="pravaFrontImg"
                  alt=""
                />
              </div>
              <Label for="pravaFront" class="w-full">Old tomoni</Label
              ><Button variant="outline" class="overflow-hidden w-full"
                ><Label for="pravaFront">Yuklash</Label></Button
              >
              <Input
                type="file"
                id="pravaFront"
                class="hidden"
                @change="(e: any) => pushFile(e.target.files, 'pFront')"
                accept="image/*"
              />
            </div>
            <div class="form-group w-full flex flex-col">
              <div
                class="icon flex flex-col items-center justify-center w-[90%] my-3 h-[50%]"
              >
              <PravaTexBackIcon v-show="!pravaBackImg" class="w-full" />
                <img
                  v-show="pravaBackImg"
                  class="w-full h-full object-cover"
                  :src="pravaBackImg"
                  alt=""
                />
              </div>
              <Label for="pravaBack" class="w-full">Orqa tomoni</Label
              ><Button variant="outline" class="overflow-hidden w-full"
                ><Label for="pravaBack">Yuklash</Label></Button
              >
              <Input
                type="file"
                id="pravaBack"
                class="hidden"
                @change="(e: any) => pushFile(e.target.files, 'pBack')"
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div class="wrapper">
          <CardTitle>Avtomobil pasporti</CardTitle>
          <div class="groups flex gap-x-6">
            <div class="form-group w-full flex flex-col">
              <div
                class="icon flex flex-col items-center justify-center w-[90%] my-3 h-[50%]"
              >
                <TexFrontIcon v-show="!texFrontImg" class="w-full" />
                <img
                  v-show="texFrontImg"
                  class="w-full h-full object-cover"
                  :src="texFrontImg"
                  alt=""
                />
              </div>
              <Label for="texFront" class="w-full">Old tomoni</Label
              ><Button variant="outline" class="overflow-hidden w-full"
                ><Label for="texFront">Yuklash</Label></Button
              >
              <Input
                type="file"
                id="texFront"
                class="hidden"
                @change="(e: any) => pushFile(e.target.files, 'tFront')"
                accept="image/*"
              />
            </div>
            <div class="form-group w-full flex flex-col">
              <div
                class="icon flex flex-col items-center justify-center w-[90%] my-3 h-[50%]"
              >
              <PravaTexBackIcon v-show="!texBackImg" class="w-full" />
                <img
                  v-show="texBackImg"
                  class="w-full h-full object-cover"
                  :src="texBackImg"
                  alt=""
                />
              </div>
              <Label for="texBack" class="w-full">Orqa tomoni</Label
              ><Button variant="outline" class="overflow-hidden w-full"
                ><Label for="texBack">Yuklash</Label></Button
              >
              <Input
                type="file"
                id="texBack"
                class="hidden"
                @change="(e: any) => pushFile(e.target.files, 'tBack')"
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <Button
          @click="events('next')"
          :disabled="disableButton"
          class="w-full suit-theme"
          type="button"
        >
          Jo'natish
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
