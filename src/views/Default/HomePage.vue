<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { List, PowerOff } from "lucide-vue-next";
import { useAccount } from "@/stores/account";
import { useRouter } from "vue-router";

const router = useRouter();

const accountStore = useAccount();

const pushToOptions = () => {
  router.push("/options");
};
</script>

<template>
  <div class="home-page h-auto flex flex-col items-end">
    <button class="suit-theme-reverse rounded-md p-4 w-auto mr-6 mb-4">
      <PowerOff class="w-6 h-6" />
    </button>
    <div class="main-content h-auto suit-theme-reverse w-full custom-style p-6">
      <h1 class="text-xl flex items-center mb-4">
        <span class="online w-3 h-3 bg-green-400 rounded-full mr-2"></span> 26
        haydovchilar
      </h1>
      <Button class="suit-theme w-full" @click="pushToOptions"
        ><List class="mr-2" /> Buyurtmalar</Button
      >
    </div>
  </div>
</template>
