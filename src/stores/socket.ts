import { ref, onUnmounted } from "vue";
import { io, Socket } from "socket.io-client";
import config from "@/config";
import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { loadingController } from "@ionic/core";
import { toast } from "vue-sonner";
import { useAccount } from "./account";
import router from "@/router";

export const useSocket = defineStore("socket-store", () => {
  const accountStore = useAccount();
  const state = ref({
    connected: false,
    socketId: "",
  });

  const socket: Socket = io(config.SERVER_PUBLIC_URL, {
    autoConnect: false,
  });

  const initConnection = async (socketId: string) => {
    try {
      const { value } = await Preferences.get({ key: "driverOneId" });
      if (value) {
        const user = { socketId, oneId: value, type: "driver" };
        socket.emit("connection:init", { user });
      } else {
        throw new Error("Driver ID not found");
      }
    } catch (error) {
      console.error("Error initializing connection:", error);
      toast("Connection initialization failed. Please try again.");
    }
  };

  socket.on("connect", async () => {
    await initConnection(socket.id as string);
    state.value.socketId = socket.id as string;
    state.value.connected = true;
  });

  socket.on("disconnect", () => {
    state.value.connected = false;
    state.value.socketId = "";
    console.log("Disconnected from server");
  });

  const connectSocket = async (payload: { loading?: boolean }) => {
    const loading = await loadingController.create({
      message: "Faollik ishga tushmoqda...",
    });
    try {
      if (!state.value.connected) {
        if (payload.loading) {
          await loading.present();
        }
        socket.connect();
      }
    } catch (error: any) {
      console.error("Error connecting socket:", error);
      toast(
        error.message ||
          error.response?.data?.msg ||
          "Faollikni ishga tushirishda xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring"
      );
    } finally {
      if (payload.loading) {
        await loading.dismiss();
      }
    }
  };

  const disconnectSocket = async (payload: { loading?: boolean }) => {
    const loading = await loadingController.create({
      message: "Faollik uzilmoqda...",
    });
    try {
      if (state.value.connected) {
        if (payload.loading) {
          await loading.present();
        }
        const { value } = await Preferences.get({ key: "driverOneId" });
        if (value) {
          socket.emit("connection:disconnect", { user: { oneId: value } });
        } else {
          throw new Error("Driver ID not found");
        }
      }
    } catch (error: any) {
      console.error("Error disconnecting socket:", error);
      toast(
        error.message ||
          error.response?.data?.msg ||
          "Faollikni o'chirishda xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring"
      );
    } finally {
      if (payload.loading) {
        await loading.dismiss();
      }
    }
  };

  socket.on("message:disconnection-confirmed", async (data) => {
    await accountStore.changeStatus(data.status);
    alert(data.status);
    await router.push("/home/deactivated");
    toast(data.msg);
  });

  socket.on("message:connection-confirmed", async (data) => {
    if (
      !router.currentRoute.value.fullPath.includes("/home") ||
      router.currentRoute.value.fullPath === "/home/deactivated"
    ) {
      await router.push("/home");
    }
    await accountStore.changeStatus(data.status);
    alert(data.status);
    toast(data.msg);
  });

  onUnmounted(() => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("message:disconnection-confirmed");
    socket.off("message:connection-confirmed");
  });

  return {
    state,
    connectSocket,
    disconnectSocket,
    socket,
  };
});
