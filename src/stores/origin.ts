import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Geolocation } from "@capacitor/geolocation";
import router from "@/router";
import { App } from "@capacitor/app";
import { toast } from "vue-sonner";

export const useOriginCoords = defineStore("origin-coords-store", () => {
  const lat = ref<number>(0);
  const lng = ref<number>(0);
  const heading = ref();
  const watcherId = ref();

  const watchingCoords = ref<boolean>(true);

  async function getCoordsWithNavigator() {
    try {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          lat.value = coords.latitude;
          lng.value = coords.longitude;
          console.log(coords);
        },
        (err) => {
          if (err.message) {
            throw new Error(err.message);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function getCoords() {
    try {
      const permission = await Geolocation.checkPermissions();

      if (
        permission.location === "denied" &&
        permission.coarseLocation === "denied"
      ) {
        const askPermission = await Geolocation.requestPermissions({
          permissions: ["coarseLocation", "location"],
        });
        if (
          askPermission.coarseLocation === "denied" &&
          permission.location === "denied"
        ) {
          await App.exitApp();
        }
      }

      const results = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      lat.value = results.coords.latitude;
      lng.value = results.coords.longitude;

      return { coords: results.coords };
    } catch (error: any) {
      console.log(error);
    }
  }

  async function watchCoords(): Promise<void> {
    try {
      if (watchingCoords.value) {
        const watchId = await Geolocation.watchPosition(
          { enableHighAccuracy: true },
          async (results) => {
            lat.value = results?.coords.latitude as number;
            lng.value = results?.coords.longitude as number;
            heading.value = results?.coords.heading;
          }
        );

        watcherId.value = watchId;

        return;
      }

      console.log("watch coords disabled");
    } catch (error) {
      await router.push("/no-gps");
    }
  }

  async function removeWatchCoords() {
    try {
      await Geolocation.clearWatch({ id: watcherId.value });
      return
    } catch (error: any) {
      console.log(error);
      toast(error)
    }
  }

  async function changeCoords(coords: {
    lat: number;
    lng: number;
  }): Promise<void> {
    watchingCoords.value = false;
    lat.value = coords.lat;
    lng.value = coords.lng;
  }

  const coords = computed(() => {
    return { lat: lat.value, lng: lng.value };
  });

  return {
    coords,
    getCoords,
    watchCoords,
    removeWatchCoords,
    changeCoords,
    getCoordsWithNavigator,
    lat,
    lng,
    heading,
  };
});
