<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { computed, defineAsyncComponent, ref } from "vue";
import { useLoading } from "@/stores/loading";
import router from "@/router";
import { authInstance } from "@/http";
import { ResponseStatus } from "@/constants";
import { loadingController } from "@ionic/vue";
import { toast } from "vue-sonner";
import { storeToRefs } from "pinia";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
const { car, driver } = storeToRefs(authStore);

const files = ref<File[]>([]);

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
  const loading = await loadingController.create({ message: "Kuting..." });

  try {
    await loading.present();
    const result = await authStore.register({
      driver: driver.value,
      car: {
        name: car.value.name.toUpperCase(),
        color: car.value.color.toUpperCase(),
        number: car.value.number.toUpperCase(),
      },
      files: formData,
    });

    if (result.status === ResponseStatus.AUTH_WARNING) {
      await loading.dismiss();

      toast(result.msg);

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
        await loading.dismiss();

        toast("Hujjatlaringizni yuborishda xatolik yuzaga keldi");

        return;
      }

      if (sendingPictures.data.status !== ResponseStatus.IMAGES_SENT) {
        await loading.dismiss();

        toast(sendingPictures.data.msg);

        return;
      }

      await loading.dismiss();

      toast(result.msg);

      setTimeout(() => {
        router.push("/auth/validation-waiting");
      }, 500);

      return;
    }

    if (result.status === ResponseStatus.UNKNOWN_ERR) {
      await loading.dismiss();

      toast(result.msg);

      return;
    }
  } catch (error: any) {
    console.log(error);

    await loading.dismiss();

    if (!error.response) {
      toast(`Serverga ulanishda xatolik, boshqatdan urinib ko'ring`);

      return;
    }
    toast(
      error.response.data.msg ||
        error.message ||
        `Serverga ulanishda xatolik, boshqatdan urinib ko'ring`
    );

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
  <div class="document-form">
    <Card class="bg-primary text-warning-foreground w-full">
      <CardHeader>
        <CardTitle>Haydovchi hujjatlari</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="wrapper -mb-6">
          <CardTitle>Haydovchilik guvohnomasi</CardTitle>
          <div class="groups flex gap-x-4">
            <div class="form-group w-full flex flex-col">
              <div
                class="icon flex flex-col items-center justify-center w-[50%] my-3 h-[30%]"
              >
                <PravaFrontIcon v-show="!pravaFrontImg" class="w-full h-full" />
                <img
                  v-show="pravaFrontImg"
                  class="w-full h-full object-cover"
                  :src="pravaFrontImg"
                  alt=""
                />
              </div>
              <Label for="pravaFront" class="w-full">Old tomoni</Label
              ><Button variant="outline" class="overflow-hidden w-full py-4"
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
                class="icon flex flex-col items-center justify-center w-[50%] my-3 h-[30%]"
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
              ><Button variant="outline" class="overflow-hidden w-full py-4"
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
          <div class="groups flex gap-x-4">
            <div class="form-group w-full flex flex-col">
              <div
                class="icon flex flex-col items-center justify-center w-[50%] my-3 h-[30%]"
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
              ><Button variant="outline" class="overflow-hidden w-full py-4"
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
                class="icon flex flex-col items-center justify-center w-[50%] my-3 h-[30%]"
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
              ><Button variant="outline" class="overflow-hidden w-full py-4"
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
          @click="action"
          :disabled="disableButton"
          class="w-full suit-theme"
          type="button"
        >
          Jo'natish
        </Button>
        <Button
          @click="events('back')"
          type="button"
          class="w-full"
          variant="outline"
        >
          Orqaga
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
