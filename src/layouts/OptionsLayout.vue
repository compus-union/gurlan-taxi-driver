<script setup lang="ts">
import { useSocket } from "@/stores/socket";
import { storeToRefs } from "pinia";

const socketStore = useSocket();

const { state } = storeToRefs(socketStore);
</script>

<template>
  <div class="options-layout py-6">
    <h1 class="text-lg font-bold text-white">
      Holat: {{ (state.connected, state.socketId) }}
    </h1>
  </div>
</template>
