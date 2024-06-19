<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Power } from "lucide-vue-next";
import { useAccount } from "@/stores/account";
import { storeToRefs } from "pinia";
import { useSocket } from "@/stores/socket";

const socketStore = useSocket();
const accountStore = useAccount();

const {} = storeToRefs(socketStore);
const { status } = storeToRefs(accountStore);
</script>

<template>
  <div class="deactivated-page h-auto flex flex-col items-end">
    <div class="main-content h-auto suit-theme-reverse w-full custom-style p-6">
      <h1 class="text-xl flex items-center mb-4 text-center">
        Siz hozirda faol emassiz, sizga buyurtmalar ko’rinmaydi.
        {{ status }}
      </h1>
      <Button
        @click="socketStore.connectSocket({ loading: true })"
        class="suit-theme w-full"
        ><Power class="mr-2" /> Faollikni yoqish</Button
      >
    </div>
  </div>
</template>
