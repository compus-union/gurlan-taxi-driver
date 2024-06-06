import { defineStore, storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useOriginCoords } from "@/stores/origin";
import L from "leaflet";
import { toast } from "vue-sonner";
import NavigatorMarkerIco from "@/resources/navigator-marker.svg";
import "leaflet-rotatedmarker";

export interface CustomMarker extends L.Marker {
  latLng?: L.LatLng;
  _custom_id?: string;
}

// Define a store for maps
export const useMaps = defineStore("maps-store", () => {
  const originStore = useOriginCoords();
  const { lat: originLat, lng: originLng, heading } = storeToRefs(originStore);
  const sharedMap = ref<L.Map>();
  const defaultZoom = ref(16);
  const mapLoaded = ref(false);
  const markers = ref<CustomMarker[]>([]);

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

      await loadNavigatorMarker();
    } catch (error: any) {
      console.log(error);
      toast(error);
    }
  }

  async function loadNavigatorMarker() {
    try {
      const navigatorMarkerIcon = L.icon({
        iconUrl: NavigatorMarkerIco,
        iconSize: [42, 54],
        iconAnchor: [10, 16],
      });

      const navigatorMarker = L.marker([originLat.value, originLng.value], {
        icon: navigatorMarkerIcon,
        // @ts-ignore
        rotationAngle: 0,
        rotationOrigin: "center center",
      }).addTo(sharedMap.value as L.Map | L.LayerGroup<any>) as CustomMarker;

      navigatorMarker._custom_id === "navigator-marker";
      markers.value.push(navigatorMarker);
      console.log(markers.value);

      // watch(
      //   () => heading.value,
      //   (newVal, oldVal) => {
      //     if (navigatorMarker) {
      //       alert(newVal);
      //       //@ts-ignore
      //       navigatorMarker.setRotationAngle(newVal);
      //     }
      //   }
      // );
    } catch (error: any) {
      alert(error);
      console.log("Error loading navigator marker: ", error);
    }
  }

  return { loadMap, markers };
});
