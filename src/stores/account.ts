import { driverInstance } from "@/http";
import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { ref } from "vue";
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
export const useAccount = defineStore("account-store", () => {
  const status = ref<StatusDriver>();

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

  async function changeStatus(payload: StatusDriver) {
    status.value = payload;
  }

  return { status, getStatus, changeStatus };
});
