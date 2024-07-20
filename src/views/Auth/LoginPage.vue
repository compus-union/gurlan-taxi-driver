<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from "vue";
import { useAuth } from "@/stores/auth";
import { Preferences } from "@capacitor/preferences";
import { vMaska } from "maska/vue";
import { vUppercase } from "@/directives/uppercase";
import {
  ResponseStatus,
  DriverValidation,
  UniversalResponseStatus,
} from "@/constants";
import router from "@/router";
import { loadingController } from "@ionic/vue";
import { toast } from "vue-sonner";

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
const Input = defineAsyncComponent(() => {
  return import("@/components/ui/input/Input.vue");
});
const Label = defineAsyncComponent(() => {
  return import("@/components/ui/label/Label.vue");
});
const Button = defineAsyncComponent(() => {
  return import("@/components/ui/button/Button.vue");
});
const Checkbox = defineAsyncComponent(() => {
  return import("@/components/ui/checkbox/Checkbox.vue");
});

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

const action = async () => {
  const loading = await loadingController.create({
    message: "Tizimga kirilmoqda...",
  });
  try {
    await loading.present();
    const result = await authStore.login({
      oneId: authStore.driver.oneId as string,
      password: authStore.driver.password,
      emergencyPassword: ""
    }, "simple");

    if (result.status === ResponseStatus.AUTH_WARNING) {
      toast(result.msg);

      return;
    }

    if (result.status === ResponseStatus.BANNED) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.remove({ key: "validation" }),
        Preferences.set({ key: "banned", value: "true" }),
        router.push("/auth/banned"),
      ]);

      return;
    }

    if (result.status === ResponseStatus.VALIDATION_FAILED) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.remove({ key: "banned" }),
        Preferences.set({
          key: "validation",
          value: DriverValidation.INVALIDATED,
        }),
        router.push("/auth/invalidation"),
      ]);

      return;
    }

    if (result.status === ResponseStatus.VALIDATION_WAITING) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.remove({ key: "banned" }),
        Preferences.set({
          key: "validation",
          value: DriverValidation.WAITING,
        }),
        router.push("/auth/validation-waiting"),
      ]);

      return;
    }

    if (result.status === UniversalResponseStatus.ERR_NETWORK) {
      toast(result.msg || "Server bilan aloqa mavjud emas");

      return;
    }

    if (result.status === ResponseStatus.DRIVER_NOT_FOUND) {
      toast(result.msg);

      await Promise.allSettled([
        Preferences.clear(),
        router.push("/auth/register"),
      ]);
      return;
    }

    if (
      result.status === ResponseStatus.TOKEN_NOT_FOUND ||
      result.status === ResponseStatus.TOKEN_NOT_VALID ||
      result.status === ResponseStatus.HEADERS_NOT_FOUND
    ) {
      toast(result.msg);

      return;
    }

    if (result.status === ResponseStatus.DRIVER_LOGIN_DONE) {
      toast(result.msg);

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
      toast(
        "Xatolik yuz berdi, boshqatdan urinib ko'ring yoki dasturni boshqatdan ishga tushiring"
      );

      return;
    }
    toast(error.response.data.msg || error.message);

    return;
  } finally {
    await loading.dismiss();
  }
};
</script>

<template>
  <div
    class="container px-2 mx-auto h-screen flex flex-col items-center justify-center py-4"
  >
    <Card class="bg-primary text-warning-foreground w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription
          >Sizga berilgan oneId va o'zingiz tergan parol orqali tizimga
          kiring.</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="form-group">
          <Label for="oneId">OneId</Label>
          <Input
            v-model:model-value.trim.lazy="authStore.driver.oneId"
            id="oneId"
            type="text"
            required
            v-uppercase
            v-maska="'@@#######'"
            placeholder="One Id"
          />
        </div>
        <div class="form-group">
          <Label for="password">Parol</Label>
          <Input
            v-model:model-value.trim.lazy="authStore.driver.password"
            id="password"
            :type="showPass ? 'text' : 'password'"
            placeholder="Parol"
          />
        </div>
        <div class="form-group flex items-center space-x-4">
          <Checkbox
            v-model:checked="showPass"
            class="suit-theme-checkbox"
            id="showPass"
          />
          <Label for="showPass"> Parolni ko'rsatish </Label>
        </div>
        <Button
          @click="action"
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
