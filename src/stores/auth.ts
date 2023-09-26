import { defineStore } from "pinia";
import { ref } from "vue";
import { StatusDriver, DriverTypes, StatusLicenseDocuments } from "@/constants";
import { authInstance } from "@/http";
import { toastController } from "@ionic/core";
import { Preferences } from "@capacitor/preferences";
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

  const router = useRouter();

  async function register(payload: {
    driver: Driver;
    car: Car;
    files: any;
  }): Promise<void> {
    try {
      const response = await authInstance.post("/register", { ...payload });

      if (!response) {
        const noInternetToast = await toastController.create({
          message:
            "Server bilan aloqa mavjud emas, internetingizni tekshiring yoki dasturga boshqatdan kiring.",
          duration: 4000,
          keyboardClose: true,
        });

        await noInternetToast.present();
        return;
      }

      if (response.data.status === "bad") {
        const warningToast = await toastController.create({
          message: response.data.msg,
          duration: 4000,
          keyboardClose: true,
        });

        await warningToast.present();

        return;
      }

      if (response.data.status !== "bad") {
        // do here

        return;
      }
    } catch (error: any) {
      const toastError = await toastController.create({
        message: error.message || "Serverda xatolik",
        duration: 4000,
        keyboardClose: true,
      });

      await toastError.present();

      return;
    }
  }

  async function login(payload: {
    oneId: string;
    password: string;
  }): Promise<void> {
    try {
      const response = await authInstance.post("/login", { ...payload });

      if (!response) {
        const noInternetToast = await toastController.create({
          message:
            "Server bilan aloqa mavjud emas, internetingizni tekshiring yoki dasturga boshqatdan kiring.",
          duration: 4000,
          keyboardClose: true,
        });

        await noInternetToast.present();
        return;
      }

      if (response.data.status === "bad") {
        const warningToast = await toastController.create({
          message: response.data.msg,
          duration: 4000,
          keyboardClose: true,
        });

        await warningToast.present();

        return;
      }

      if (response.data.status !== "bad") {
        await Promise.allSettled([
          Preferences.set({
            key: "auth_token",
            value: response.data.token,
          }),
          Preferences.set({
            key: "driverOneId",
            value: response.data.driver,
          }),
          router.push("/home"),
        ]);

        const toast = await toastController.create({
          message: "Ma'lumotlaringiz jo'natildi",
          duration: 4000,
          keyboardClose: true,
        });

        await toast.present();

        return;
      }
    } catch (error: any) {
      const toastError = await toastController.create({
        message: error.message || "Serverda xatolik",
        duration: 4000,
        keyboardClose: true,
      });

      await toastError.present();

      return;
    }
  }

  return { register, driver, car };
});
