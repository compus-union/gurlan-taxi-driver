import { defineStore } from "pinia";
import { ref } from "vue";
import { loadingController } from "@ionic/vue";
import { useOriginCoords } from "@/stores/origin";

// Define a store for maps
export const useMaps = defineStore("maps-store", () => {
  async function loadMap(id: string) {
    console.log(id);
  }

  return { loadMap };
});
