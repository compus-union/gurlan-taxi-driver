<script lang="ts" setup>
import { Preferences } from "@capacitor/preferences";
import { toast } from "vue-sonner";
import { useOriginCoords } from "@/stores/origin";
import { onMounted } from "vue";
import { useAuth } from "@/stores/auth";
import { useMaps } from "@/stores/maps";
import { PageTransition } from "vue3-page-transition";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignJustify } from "lucide-vue-next";
import { User } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/stores/account";
import { storeToRefs } from "pinia";
import { useSocket } from "@/stores/socket";

const { state, connectSocket, disconnectSocket } = useSocket();

const authStore = useAuth();
const mapsStore = useMaps();
const originStore = useOriginCoords();
const accountStore = useAccount();

const { isActive } = storeToRefs(accountStore);

const check = async () => {
  try {
    const { value: oneId } = await Preferences.get({ key: "driverOneId" });
    const { value: token } = await Preferences.get({ key: "auth_token" });

    await authStore.checkIfLoggedIn({
      oneId: oneId as string,
      token: token as string,
    });

    return;
  } catch (error: any) {
    console.log(error);
    toast(error.message || error.response.data.msg || error);
  }
};

const loadMap = async () => {
  try {
    await mapsStore.loadMap("map");
  } catch (error: any) {
    console.log(error);
  }
};

onMounted(async () => {
  try {
    await check();
    await originStore.getCoords();
    await originStore.watchCoords();
    await loadMap();
    await connectSocket({ loading: true });
  } catch (error: any) {
    toast(error);
  }
});

onMounted(async () => {
  window.addEventListener("beforeunload", async (e) => {
    await disconnectSocket();
  });
});
</script>

<template>
  <div class="default-layout">
    <nav
      class="navbar suit-theme-reverse mx-auto p-2 flex items-center w-full fixed top-0 z-50"
    >
      <DropdownMenu class="suit-theme-reverse">
        <DropdownMenuTrigger>
          <button
            class="bg-primary-foreground p-2 flex items-center text-primary rounded-full"
          >
            <AlignJustify :size="24" /></button
        ></DropdownMenuTrigger>
        <DropdownMenuContent
          class="font-manrope font-semibold space-y-2 border-none"
        >
          <DropdownMenuItem class="text-lg">
            <User class="mr-2" /> Akkauntim
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div class="right text-lg ml-2">Bugun: 233,000 so'm</div>
    </nav>
    <div class="h-screen z-[49]" id="map"></div>

    <router-view
      class="h-auto fixed bottom-0 w-full z-[49]"
      v-slot="{ Component }"
    >
      <PageTransition name="fade-in-up" appear>
        <component :is="Component" />
      </PageTransition>
    </router-view>
  </div>
</template>

<style>
.custom-style {
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 8px -2px rgba(0, 0, 0, 0.2);
}

img[alt="Google"] {
  display: none;
}

div.gmnoprint {
  display: none;
}
</style>
