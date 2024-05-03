<script lang="ts" setup>
import { Button } from "../../components/ui/button";
import { Power } from "lucide-vue-next";
</script>

<template>
  <div class="p-6 custom-style w-full transition-all">
    <p class="text-center mb-4 text-lg">
      Siz hozirda faol emassiz, sizga buyurtmalar ko’rinmaydi.
    </p>
    <Button class="w-full suit-theme"
      ><Power class="w-5 h-5 mr-2" /> Faollikni yoqish</Button
    >
  </div>
</template>
