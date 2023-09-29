import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { StatusDriver, DriverTypes, StatusLicenseDocuments } from "@/constants";
import { authInstance } from "@/http";
import { Preferences } from "@capacitor/preferences";
import { useLoading } from "./loading";
import { toastController } from "@ionic/vue";
import { useRouter } from "vue-router";

interface Driver {
  id?: string;
  oneId?: string;
  fullname: string;
  phone: string[];
  password: string;
  license?: StatusLicenseDocuments;
  registration?: StatusLicenseDocuments;
  rides?: object[];
  status?: StatusDriver;
  type?: DriverTypes;
  approval?: object;
  createdAt?: Date | null;
  lastOnline?: Date | null;
  account?: string;
  deleted?: object;
  rating?: number[];
  car?: object;
  [propName: string]: any; // for files
}

interface Car {
  id?: string;
  oneId?: string;
  name: string;
  color: string;
  number: string;
  driverId?: string;
  driver?: object;
  deleted?: boolean;
}

export const useAuth = defineStore("auth-store", () => {
  const loadingStore = useLoading();
  const router = useRouter();

  const driver = ref<Driver>({
    fullname: "",
    password: "",
    phone: ["+998"],
  });
  const car = ref<Car>({
    name: "",
    color: "",
    number: "",
  });

  const getDriver = computed(() => {
    return driver.value;
  });

  const getCar = computed(() => {
    return car.value;
  });

  async function setDriver(payload: Driver) {
    driver.value = payload;
  }

  function setDriverSync(payload: Driver) {
    driver.value = payload;
  }

  async function setCar(payload: Car) {
    car.value = payload;
  }

  function setCarSync(payload: Car) {
    car.value = payload;
  }

  async function register(payload: {
    driver: Driver;
    car: Car;
    files: FormData;
  }): Promise<{ status: "ok" | "bad" | "unknown"; msg: string }> {
    try {
      await loadingStore.setLoading(true);
      // const
      const sendingDriverInfo = await authInstance.post("/register", {
        driver: payload.driver,
        car: payload.car,
      });

      if (!sendingDriverInfo) {
        return {
          msg: "Server bilan aloqa mavjud emas, internetingizni tekshirib, dasturga qaytaldan kiring.",
          status: "bad",
        };
      }

      if (sendingDriverInfo.data.status === "bad") {
        return {
          msg: sendingDriverInfo.data.msg,
          status: "bad",
        };
      }

      if (sendingDriverInfo.data.status === "ok") {
        await Promise.allSettled([
          Preferences.set({
            key: "auth_token",
            value: sendingDriverInfo.data.token,
          }),
          Preferences.set({
            key: "driverOneId",
            value: sendingDriverInfo.data.driver.oneId,
          }),
          Preferences.set({
            key: "validation",
            value: "waiting",
          }),
          setDriver(sendingDriverInfo.data.driver as Driver),
          setCar(sendingDriverInfo.data.car as Car),
        ]);

        return {
          msg: sendingDriverInfo.data.msg,
          status: "ok",
        };
      }

      return {
        status: "unknown",
        msg: "Something just happened",
      };
    } catch (error: any) {
      if (!error.response) {
        return {
          status: "bad",
          msg: "Internetingizni tekshirib boshqatdan urinib ko'ring",
        };
      }

      return {
        status: "bad",
        msg: error.message,
      };
    } finally {
      await loadingStore.setLoading(false);
    }
  }

  async function login(payload: {
    oneId: string;
    password: string;
  }): Promise<void> {}

  async function checkIfExists(payload: {
    token: string | null;
    oneId: string | null;
  }) {
    try {
      const res = await authInstance.get("/check/" + payload.oneId, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      });

      if (!res) {
        const toast = await toastController.create({
          message: "Nimadir xato ketdi, internetingizni tekshiring.",
          duration: 4000,
          buttons: [
            {
              text: "OK",
              handler: async () => {
                await toast.dismiss();
              },
            },
          ],
        });

        await toast.present();

        return;
      }

      if (res.data.status === "forbidden" || res.data.status === "bad") {
        const toast = await toastController.create({
          message: res.data.msg,
          duration: 4000,
          buttons: [
            {
              text: "OK",
              handler: async () => {
                await toast.dismiss();
              },
            },
          ],
        });

        await toast.present();
        await Promise.allSettled([Preferences.clear()]);
        await router.push("/register");
        return;
      }

      if (res.data.status === "ok") {
        await Promise.allSettled([
          Preferences.clear(),
          Preferences.set({ key: "validation", value: "waiting" }),
          Preferences.set({ key: "driverOneId", value: res.data.driver.oneId }),
          Preferences.set({ key: "auth_token", value: res.data.token }),
          setDriver(res.data.driver),
          setCar(res.data.car),
        ]);

        return;
      }
    } catch (error: any) {
      const toast = await toastController.create({
        message: error.message || "Nimadir xato ketdi",
        buttons: [
          {
            text: "OK",
            async handler() {
              await toast.dismiss();
            },
          },
        ],
        duration: 4000,
      });

      await toast.present();
    }
  }

  return { register, driver, car, getDriver, getCar, checkIfExists };
});
