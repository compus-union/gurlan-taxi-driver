<script lang="ts" setup>
import { toast } from "vue-sonner";
import { useOriginCoords } from "@/stores/origin";
import { onMounted } from "vue";
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
import router from "@/router";
import { useProfile } from "@/stores/profile";

const profileStore = useProfile()
const mapsStore = useMaps();
const originStore = useOriginCoords();

const loadMap = async () => {
  try {
    await mapsStore.loadMap("map");
  } catch (error: any) {
    console.log(error);
  }
};

onMounted(async () => {
  try {
    await originStore.getCoords();
    await originStore.watchCoords();
    await loadMap();
    await profileStore.getProfile({ loading: true });
  } catch (error: any) {
    toast(
      error.message ||
        error.response.data.msg ||
        "Ma'lumotlarni yuklashda xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring"
    );
  }
});

const pushToOptions = async () => {
  await router.push("/options/profile");
};
</script>

<template>
  <div class="default-layout">
    <nav
      class="navbar suit-theme-reverse mx-auto p-2 flex items-center w-full fixed top-0 z-50"
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button
            class="bg-primary-foreground p-2 flex items-center text-primary rounded-full"
          >
            <AlignJustify :size="24" /></button
        ></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="pushToOptions">
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
