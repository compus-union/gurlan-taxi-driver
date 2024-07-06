<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Power } from "lucide-vue-next";
import { useSocket } from "@/stores/socket";
import { useRouter } from "vue-router";

const router = useRouter()
const socketStore = useSocket();

const connectSocket = async () => {
  await socketStore.connectSocket({ loading: true });
};
</script>

<template>
  <div class="deactivated-page h-auto flex flex-col items-end">
    <div class="main-content h-auto suit-theme-reverse w-full custom-style p-6">
      <h1 class="text-xl flex items-center mb-4 text-center">
        Siz hozirda faol emassiz, sizga buyurtmalar ko’rinmaydi.
      </h1>
      <Button
        @click="connectSocket"
        class="suit-theme w-full"
        ><Power class="mr-2" /> Faollikni yoqish</Button
      >
    </div>
  </div>
</template>
