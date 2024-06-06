import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  StatusDriver,
  DriverTypes,
  StatusLicenseDocuments,
  DriverValidation,
} from "@/constants";
import { authInstance } from "@/http";
import { Preferences } from "@capacitor/preferences";
import { useLoading } from "./loading";
import { useRouter } from "vue-router";
import { ResponseStatus } from "@/constants";
import { UniversalResponseStatus } from "@/constants";
import { loadingController } from "@ionic/vue";
import { toast } from "vue-sonner";

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
    emergencyPassword: "",
  });
  const car = ref<Car>({
    name: "",
    color: "",
    number: "",
  });
  const plainPass = ref("");
  const token = ref("");
  const bannedReason = ref("");

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

  async function setToken(payload: string) {
    token.value = payload;
  }

  function setTokenSync(payload: string) {
    token.value = payload;
  }

  async function register(payload: {
    driver: Driver;
    car: Car;
    files: FormData;
  }): Promise<{
    status: UniversalResponseStatus | ResponseStatus;
    msg: string;
    [propName: string]: any;
  }> {
    try {
      await loadingStore.setLoading(true);
      plainPass.value = driver.value.password;

      const sendingDriverInfo = await authInstance.post("/register", {
        driver: payload.driver,
        car: payload.car,
      });

      if (sendingDriverInfo.status >= 400) {
        return {
          msg: "Server bilan aloqa mavjud emas, internetingizni tekshirib, dasturga qaytaldan kiring.",
          status: UniversalResponseStatus.ERR_NETWORK,
        };
      }

      if (sendingDriverInfo.data.status === ResponseStatus.AUTH_WARNING) {
        return {
          msg: sendingDriverInfo.data.msg,
          status: ResponseStatus.AUTH_WARNING,
        };
      }

      if (
        sendingDriverInfo.data.status ===
        ResponseStatus.DRIVER_REGISTRATION_DONE
      ) {
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
          setToken(sendingDriverInfo.data.token),
        ]);

        driver.value.password = "";

        return {
          msg: sendingDriverInfo.data.msg,
          status: ResponseStatus.DRIVER_REGISTRATION_DONE,
          oneId: sendingDriverInfo.data.driver.oneId,
          password: driver.value.password,
        };
      }

      return {
        status: ResponseStatus.UNKNOWN_ERR,
        msg: "Something just happened",
      };
    } catch (error: any) {
      console.log(error);

      if (
        error.message === "Network Error" ||
        error.message.includes("timeout")
      ) {
        return {
          msg: "Server bilan aloqa mavjud emas, internetingizni tekshirib, dasturga qaytaldan kiring.",
          status: UniversalResponseStatus.ERR_NETWORK,
        };
      }

      // Handle other unknown errors
      return {
        msg: "An unknown error occurred, please try again later.",
        status: ResponseStatus.UNKNOWN_ERR,
      };
    } finally {
      await loadingStore.setLoading(false);
    }
  }

  async function checkIfValidated(payload: {
    token: string | null;
    oneId: string | null;
  }) {
    await loadingStore.setLoading(true);

    const loading = await loadingController.create({
      message: "Yuklanmoqda...",
    });

    try {
      await loading.present();
      const res = await authInstance.get(`/check-validation/${payload.oneId}`, {
        headers: { Authorization: `Bearer ${payload.token}` },
      });
      if (res.status >= 400) {
        await loading.dismiss();

        toast(
          "Server bilan aloqa mavjud emas, boshqatdan urinib ko'ring yoki dasturni boshqatdan ishga tushiring"
        );

        return;
      }

      if (res.data.status === ResponseStatus.VALIDATION_WAITING) {
        await loading.dismiss();

        toast(res.data.msg);

        await Promise.allSettled([
          Preferences.remove({ key: "banned" }),
          Preferences.set({ key: "validation", value: "waiting" }),
          Preferences.set({ key: "auth_token", value: res.data.token }),
        ]);

        if (router.currentRoute.value.fullPath === "/auth/validation-waiting") {
          return;
        }

        await router.push("/auth/validation-waiting");
        return;
      }

      if (
        res.data.status === ResponseStatus.DRIVER_NOT_FOUND ||
        res.data.status === ResponseStatus.HEADERS_NOT_FOUND ||
        res.data.status === ResponseStatus.TOKEN_NOT_FOUND ||
        res.data.status === ResponseStatus.TOKEN_NOT_VALID
      ) {
        await loading.dismiss();

        toast(res.data.msg);

        await Promise.allSettled([
          Preferences.clear(),
          router.push("/auth/register"),
        ]);

        return;
      }

      if (res.data.status === ResponseStatus.BANNED) {
        await loading.dismiss();

        toast(res.data.msg);

        await Promise.allSettled([
          Preferences.remove({ key: "validation" }),
          Preferences.set({ key: "banned", value: "true" }),
        ]);

        if (router.currentRoute.value.fullPath === "/auth/banned") {
          return;
        }

        await router.push("/auth/banned");

        return;
      }

      if (res.data.status === ResponseStatus.VALIDATION_FAILED) {
        await loading.dismiss();

        const { value: validation } = await Preferences.get({
          key: "validation",
        });

        toast(res.data.msg);

        if (validation !== DriverValidation.INVALIDATED) {
          await Preferences.set({
            key: "validation",
            value: DriverValidation.INVALIDATED,
          });
        }

        if (router.currentRoute.value.fullPath !== "/invalidation") {
          await router.push("/auth/invalidation");
          return;
        }

        return;
      }

      if (res.data.status === ResponseStatus.VALIDATION_DONE) {
        await loading.dismiss();
        const { value: validation } = await Preferences.get({
          key: "validation",
        });

        if (validation !== "validated") {
          toast(res.data.msg);
        }

        await Promise.allSettled([
          Preferences.remove({ key: "banned" }),
          Preferences.set({ key: "validation", value: "validated" }),
          Preferences.set({ key: "auth_token", value: res.data.token }),
          Preferences.set({ key: "driverOneId", value: res.data.driver.oneId }),
        ]);
        setTimeout(() => {
          router.push("/home");
        }, 500);
        return;
      }

      if (res.data.status === ResponseStatus.DRIVER_LOGIN_FAILED) {
        toast(res.data.msg);

        return;
      }

      if (res.data.status === ResponseStatus.DRIVER_LOGIN_DONE) {
        await Promise.allSettled([
          Preferences.set({
            key: "validation",
            value: DriverValidation.SUCCESS,
          }),
          Preferences.set({ key: "driverOneId", value: res.data.driver.oneId }),
          Preferences.set({ key: "auth_token", value: res.data.token }),
        ]);

        return;
      }
    } catch (error: any) {
      await loading.dismiss();

      console.log(error);

      if (
        error.message === "Network Error" ||
        error.message.includes("timeout")
      ) {
        toast("Server bilan aloqa mavjud emas");

        return;
      }

      toast(
        error.response.data.msg ||
          error.message ||
          "Xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring."
      );

      return;
    } finally {
      await loadingStore.setLoading(false);
    }
  }

  async function checkIfLoggedIn(payload: {
    oneId: string;
    token: string;
  }): Promise<void> {
    const loading = await loadingController.create({
      message: "Ma'lumotlaringiz tekshirilmoqda...",
    });
    await loading.present();
    try {
      const res = await authInstance.get(`/check-logged-in/${payload.oneId}`, {
        headers: { Authorization: `Bearer ${payload.token}` },
      });

      if (res.status >= 400) {
        await loading.dismiss();

        toast("Server bilan aloqa mavjud emas, boshqatdan urinib ko'ring");

        return;
      }

      if (
        res.data.status === ResponseStatus.DRIVER_NOT_FOUND ||
        res.data.status === ResponseStatus.HEADERS_NOT_FOUND ||
        res.data.status === ResponseStatus.TOKEN_NOT_FOUND ||
        res.data.status === ResponseStatus.TOKEN_NOT_FOUND
      ) {
        await loading.dismiss();

        toast(res.data.msg);
        await Preferences.clear();

        setTimeout(() => {
          router.push("/auth/register");
        }, 300);
        return;
      }

      if (res.data.status === ResponseStatus.BANNED) {
        await loading.dismiss();

        toast(res.data.msg);

        await Promise.allSettled([
          Preferences.set({ key: "banned", value: "true" }),
          Preferences.remove({ key: "validation" }),
        ]);

        setTimeout(() => {
          router.push("/auth/banned");
        }, 300);
        return;
      }

      if (res.data.status === ResponseStatus.DRIVER_LOGIN_FAILED) {
        await loading.dismiss();

        toast(res.data.msg);

        await Promise.allSettled([
          Preferences.set({
            key: "validation",
            value: DriverValidation.INVALIDATED,
          }),
          Preferences.remove({ key: "banned" }),
        ]);
        return;
      }

      if (res.data.status === ResponseStatus.DRIVER_LOGIN_DONE) {
        await loading.dismiss();

        await Promise.allSettled([
          Preferences.set({
            key: "validation",
            value: DriverValidation.SUCCESS,
          }),
          Preferences.set({ key: "driverOneId", value: res.data.driver.oneId }),
          Preferences.set({ key: "auth_token", value: res.data.token }),
        ]);
        return;
      }

      return;
    } catch (error: any) {
      await loading.dismiss();
      console.log(error);

      if (
        error.message === "Network Error" ||
        error.message.includes("timeout")
      ) {
        toast("Server bilan aloqa mavjud emas, boshqatdan urinib ko'ring");

        return;
      }

      toast(
        error.response.data.msg ||
          error.message ||
          "Xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring."
      );

      return;
    } finally {
      await loading.dismiss();
    }
  }

  async function login(
    payload: { oneId: string; password: string; emergencyPassword: string },
    type: "emergency" | "simple"
  ): Promise<{
    msg: string;
    status: UniversalResponseStatus | ResponseStatus;
    [propName: string]: any;
  }> {
    try {
      await loadingStore.setLoading(true);
      const { value: token } = await Preferences.get({ key: "auth_token" });

      const res = await authInstance.post(
        type === "emergency" ? "/emergency-login" : "/login",
        { ...payload, emergencyLogin: type === "emergency" ? true : false },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status >= 400) {
        return {
          msg: "Server bilan aloqa mavjud emas, internetingizni tekshirib, dasturga qaytaldan kiring.",
          status: UniversalResponseStatus.ERR_NETWORK,
        };
      }

      return {
        msg: res.data.msg,
        status: res.data.status,
        reason: res.data?.reason || null,
        token: res.data?.token || null,
        oneId: res.data?.driver?.oneId || null,
      };
    } catch (error: any) {
      if (
        error.message === "Network Error" ||
        error.message.includes("timeout")
      ) {
        return {
          msg: "Server bilan aloqa mavjud emas, internetingizni tekshirib, dasturga qaytaldan kiring.",
          status: UniversalResponseStatus.ERR_NETWORK,
        };
      }

      return {
        msg: "An unknown error occurred, please try again later.",
        status: ResponseStatus.UNKNOWN_ERR,
      };
    } finally {
      await loadingStore.setLoading(false);
    }
  }

  async function restart(payload: {
    oneId: string;
    token: string;
  }): Promise<void> {
    const loading = await loadingController.create({
      message: "Restart qilinmoqda...",
    });

    try {
      await loading.present();
      const response = await authInstance.delete(`/restart/${payload.oneId}`, {
        headers: { Authorization: `Bearer ${payload.token}` },
      });

      if (response.status >= 400) {
        toast(`Server bilan aloqa mavjud emas`);

        return;
      }

      if (
        response.data.status === ResponseStatus.DRIVER_NOT_FOUND ||
        response.data.status === ResponseStatus.HEADERS_NOT_FOUND ||
        response.data.status === ResponseStatus.TOKEN_NOT_FOUND ||
        response.data.status === ResponseStatus.TOKEN_NOT_VALID ||
        response.data.status === ResponseStatus.DRIVER_RESTART_DONE
      ) {
        toast(response.data.msg);

        await Promise.allSettled([
          Preferences.clear(),
          router.push("/auth/register"),
        ]);

        return;
      }

      return;
    } catch (error: any) {
      if (
        error.message === "Network Error" ||
        error.message.includes("timeout")
      ) {
        toast(
          "Server bilan aloqa mavjud emas, internetingizni tekshirib, dasturga qaytaldan kiring."
        );

        return;
      }

      toast(
        error.message ||
          error.response.data.msg ||
          `Qandaydir xatolik yuz berdi, boshqatdan urinib ko'ring`
      );
    } finally {
      await loading.dismiss();
      return;
    }
  }

  return {
    register,
    driver,
    car,
    getDriver,
    getCar,
    plainPass,
    token,
    checkIfValidated,
    bannedReason,
    login,
    checkIfLoggedIn,
    restart,
  };
});
