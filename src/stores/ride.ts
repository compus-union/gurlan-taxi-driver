import { defineStore } from "pinia";
import { ref } from "vue";

export const useRide = defineStore("ride-store", () => {
  const onlineDriversCount = ref(0);

  async function changeOnlineDriversCount(payload: number) {
    onlineDriversCount.value = payload;
  }

  return { onlineDriversCount, changeOnlineDriversCount };
});
