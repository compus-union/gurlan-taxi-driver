import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccount = defineStore("account-store", () => {
  const isActive = ref<Boolean>();

  async function handleActivity(payload: boolean) {
    isActive.value = payload;
  }

  return { isActive, handleActivity };
});
