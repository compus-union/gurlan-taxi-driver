import { defineStore } from "pinia";
import { Loader } from "@googlemaps/js-api-loader";
import { ref } from "vue";

// Define a store for maps
export const useMaps = defineStore("maps-store", () => {
  // Initialize a loader with the API key and version
  const loader = new Loader({
    apiKey: `AIzaSyDKUe31BzfxFHUc4harDoHY61VSpLC3d4g`,
    version: "weekly",
  });

  // Create a reference for the map and marker
  const sharedMap = ref<google.maps.Map>();
  const markers = ref([]);

  // Load the Google Maps API
  async function loadMap(id: string) {
    const { Map } = (await loader.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;
    
    sharedMap.value = new Map(document.getElementById(id) as HTMLElement, {
      center: { lat: 5, lng: 5 },
      zoom: 20,
      mapTypeId: "OSM",
      mapTypeControl: false,
      streetViewControl: false,
      disableDefaultUI: true,
      rotateControl: true,
    });

    sharedMap.value.mapTypes.set(
      "OSM",
      new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
          let tilesPerGlobe = 1 << zoom;
          let x = coord.x % tilesPerGlobe;
          if (x < 0) {
            x = tilesPerGlobe + x;
          }

          return (
            "https://tile.openstreetmap.org/" +
            zoom +
            "/" +
            x +
            "/" +
            coord.y +
            ".png"
          );
        },
        tileSize: new google.maps.Size(256, 256),
        name: "OpenStreetMap",
        maxZoom: 18,
      })
    );

    const newMarker = new google.maps.Marker({
      map: sharedMap.value,
      position: sharedMap.value?.getCenter(),
      title: "origin-marker",
    });

    sharedMap.value.addListener("drag", () => {
      if (sharedMap.value && sharedMap.value.getCenter()) {
        newMarker.setPosition(sharedMap.value.getCenter());
      }
    });

    sharedMap.value.addListener("dragend", async () => {
      const lat = sharedMap.value?.getCenter()?.lat() as number;
      const lng = sharedMap.value?.getCenter()?.lng() as number;

      console.log(lat, lng);
    });

    markers.value?.push(newMarker as unknown as never);
    console.log(sharedMap.value);

    return {
      Map,
      sharedMap,
    };
  }

  // Return the map and marker
  return {
    sharedMap,
    markers,
    loadMap,
  };
});
