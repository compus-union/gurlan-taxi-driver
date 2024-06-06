<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Power, List } from "lucide-vue-next";
import { useAccount } from "@/stores/account";
import { storeToRefs } from "pinia";

const accountStore = useAccount();

const { isActive } = storeToRefs(accountStore);
</script>

<template>
  <div class="deactivated-page h-auto flex flex-col items-end">
    <div class="main-content h-auto suit-theme-reverse w-full custom-style p-6">
      <h1 class="text-xl flex items-center mb-4 text-center">
        Siz hozirda faol emassiz, sizga buyurtmalar ko’rinmaydi.
      </h1>
      <Button class="suit-theme w-full"
        ><Power class="mr-2" /> Faollikni yoqish</Button
      >
    </div>
  </div>
</template>
