import { driverInstance } from "@/http";
import { Preferences } from "@capacitor/preferences";
import { loadingController } from "@ionic/vue";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
type StatusDriver =
  | "ONLINE"
  | "GOINGTOCLIENT"
  | "WAITING"
  | "ONTHEWAY"
  | "BANNED"
  | "LIMITED"
  | "OFFLINE"
  | "APPROVED"
  | "IGNORED";
export const useProfile = defineStore("profile-store", () => {
  const status = ref<StatusDriver>();
  const profile = ref();

  const fullnameSplitted = computed(() => {
    const splittedFirstname = profile.value?.fullname.split(" ")[0];
    const splittedLastname = profile.value?.fullname.split(" ")[1];

    return { firstname: splittedFirstname, lastname: splittedLastname };
  });

  async function getStatus() {
    try {
      const oneId = await Preferences.get({ key: "driverOneId" });
      const token = await Preferences.get({ key: "auth_token" });

      if (!oneId.value) {
        toast("OneId mavjud emas, dasturni boshqatdan ishga tushiring");
        return;
      }
      if (!token.value) {
        toast("Token mavjud emas, dasturni boshqatdan ishga tushiring");
        return;
      }

      const response = await driverInstance.get(`/get-status/${oneId.value}`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      if (!response) {
        toast("Internet bilan aloqa mavjud emas");
        return;
      }

      if (response.data.status !== "ok") {
        toast(response.data.msg);
        return;
      }

      console.log(response);

      status.value = response.data.result;
    } catch (error: any) {
      toast(error || error.response.data.msg || error.message);
    }
  }

  async function getProfile(payload: { loading?: boolean }) {
    const loading = await loadingController.create({
      message: "Profil yuklanmoqda...",
    });
    try {
      const oneId = await Preferences.get({ key: "driverOneId" });
      const token = await Preferences.get({ key: "auth_token" });

      if (!oneId.value) {
        toast("OneId mavjud emas, dasturni boshqatdan ishga tushiring");
        return;
      }
      if (!token.value) {
        toast("Token mavjud emas, dasturni boshqatdan ishga tushiring");
        return;
      }

      if (payload.loading) {
        await loading.present();
      }

      const response = await driverInstance.get(`/get-profile/${oneId.value}`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });

      if (!response) {
        toast("Internet bilan aloqa mavjud emas");
        return;
      }

      if (response.data.status !== "ok") {
        toast(response.data.msg);
        return;
      }

      profile.value = response.data.profile;
    } catch (error: any) {
      toast(
        error ||
          error.response.data.msg ||
          error.message ||
          "Profilni yuklashda xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring"
      );
    } finally {
      if (payload.loading) {
        await loading.dismiss();
      }
    }
  }

  async function changeStatus(payload: StatusDriver) {
    status.value = payload;
  }

  return {
    status,
    getStatus,
    changeStatus,
    getProfile,
    profile,
    fullnameSplitted,
  };
});
