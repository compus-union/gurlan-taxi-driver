import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { loadingController } from "@ionic/vue";
import { useOriginCoords } from "@/stores/origin";
import L from "leaflet";
import { toast } from "vue-sonner";

// Define a store for maps
export const useMaps = defineStore("maps-store", () => {
  const originStore = useOriginCoords();
  const { lat: originLat, lng: originLng } = storeToRefs(originStore);
  const sharedMap = ref<L.Map>();
  const defaultZoom = ref(16);
  const mapLoaded = ref(false);
  async function loadMap(id: string) {
    try {
      sharedMap.value = L.map(id, { zoomControl: false, maxZoom: 20 }).setView(
        [originLat.value, originLng.value],
        defaultZoom.value
      );

      L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 20,
        }
      )
        .addTo(sharedMap.value)
        .addEventListener("load", async () => {
          if (mapLoaded.value) return;
          mapLoaded.value = true;
        });
    } catch (error: any) {
      console.log(error);
      toast(error)
    }
  }

  return { loadMap };
});
