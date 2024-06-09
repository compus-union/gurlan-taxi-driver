import { ref, onUnmounted, onBeforeUnmount } from "vue";
import { io, Socket } from "socket.io-client";
import config from "@/config";
import { Preferences } from "@capacitor/preferences";
import { App } from "@capacitor/app";

export function useSocket() {
  const state = ref({
    connected: false,
    socketId: "",
  });

  const socket: Socket = io(config.SERVER_PUBLIC_URL, {
    autoConnect: false,
  });

  const initConnection = async (socketId: string) => {
    const { value } = await Preferences.get({ key: "driverOneId" });
    const user = { socketId, oneId: value, type: "driver" };
    socket.emit("connection:init", { user });
  };

  socket.on("connect", async () => {
    await initConnection(socket.id as string);
    state.value.socketId = socket.id as string;
    state.value.connected = true;
  });

  const connectSocket = async () => {
    if (!state.value.connected) {
      socket.connect();
      state.value.connected = true
    }
  };

  const disconnectSocket = async () => {
    if (state.value.connected) {
      const { value } = await Preferences.get({ key: "driverOneId" });
      socket.emit("connection:disconnect", { user: { oneId: value } });
      state.value.connected = false
      state.value.socketId = ""
    }
  };

  App.addListener("appStateChange", async (state) => {
    // if (!state.isActive) {
    //   await disconnectSocket();
    // }

    // if (state.isActive) {
    //   await connectSocket()
    // }
  });

  return {
    state,
    connectSocket,
    disconnectSocket,
    socket,
  };
}
