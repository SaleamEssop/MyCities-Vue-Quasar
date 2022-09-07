<template>
  <div>
    <h1>Geolocation</h1>
    <p>Your location is:</p>
    <p>Latitude: {{ loc.lat }}</p>
    <p>Longitude: {{ loc.long }}</p>
    <button @click="getCurrentPosition">Get Current Location</button>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";

import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;

export default defineComponent({
  setup() {
    const loc = ref({
      lat: null,
      long: null,
    });
    const getCurrentPosition = async () => {
      // const pos = { coords: { latitude: 1, longitude: 1 } };
      const pos = await Geolocation.getCurrentPosition();
      console.log("pos", JSON.stringify(pos));
      loc.value = {
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
      };
    };
    return { getCurrentPosition, loc };
  },
});
</script>
