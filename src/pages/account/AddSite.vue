<template>
  <q-page padding class="flex-center">
    <q-card class="mobile-full-width no-shadow">
      <q-card-section>
        <l-map
          v-if="site.latLng"
          style="height: 25vh"
          :zoom="zoom"
          :center="center"
        >
          <l-tile-layer :url="url" :attribution="attribution" />
          <l-marker
            :lat-lng="site.latLng"
            :draggable="true"
            @update:latLng="onMarkerMove"
          >
          </l-marker>
          <!-- <l-geo-json :geojson="geojson" :options="geojsonOptions" /> -->
        </l-map>
      </q-card-section>
      <div v-if="hasLocation != null && !hasLocation" class="q-px-md">
        <span class="text-color-red"
          >Seems Like location does not enable. Please, enable it from setting
          and click on below button.</span
        >
        <br />
        <q-btn
          class="q-m-sm"
          color="primary"
          text-color="black"
          @click="printCurrentPosition"
          >Request For Location</q-btn
        >
      </div>
      <q-card-section class="column q-col-gutter-md" :horizontal="false">
        <q-input
          color="black"
          type="text"
          label="Enter the site name or complex name"
          v-model.trim="site.title"
        />
      </q-card-section>
      <q-card-section v-for="(account, index) in site.accounts" :key="index">
        <!-- <q-separator /> -->
        Account {{ index + 1 }}
        <div class="row">
          <div class="col-12 col-md-6">
            <q-input
              color="black"
              type="text"
              label="Enter name - As per bill"
              v-model.trim="account.title"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              color="black"
              type="text"
              label="Enter account number - As per bill"
              v-model.number="account.number"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          color="primary"
          text-color="black"
          class="q-my-none"
          @click="addNullAccount"
        >
          Add Account
        </q-btn>
      </q-card-actions>
      <q-card-section class="column q-col-gutter-md" :horizontal="false">
        <q-input
          color="black"
          type="textarea"
          outlined
          label="Site Address"
          v-model.trim="site.address"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn color="primary" text-color="black" @click="addSite">Save</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, watch } from "vue";
import { latLng } from "leaflet";
import { useSiteStore } from "/src/stores/site";
import { useRouter } from "vue-router";
//https://capacitorjs.com/docs/apis/geolocation
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;

const geojson = ref({
  type: "FeatureCollection",
  features: [],
});

const url = ref("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
const attribution = ref(
  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
);
const geolocation = ref({});

const site = ref({
  id: Date.now(),
  title: "",
  latLng: null,
  address: "",
  accounts: [],
});

const addNullAccount = () => {
  site.value.accounts.push({
    id: Date.now(),
    title: "",
    number: "",
  });
};

const zoom = ref(13);
const center = ref(latLng(-29.813218, 30.940247));
const hasLocation = ref(null);

const onMarkerMove = (newValue) => {
  site.value.latLng = JSON.parse(JSON.stringify(newValue));
};

const router = useRouter();
const siteStore = useSiteStore();
const addSite = () => {
  siteStore.addSite(site.value);
  router.back();
};

const printCurrentPosition = async () => {
  try {
    hasLocation.value = null;
    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates);
    if (
      coordinates &&
      coordinates.coords.latitude &&
      coordinates.coords.longitude
    ) {
      hasLocation.value = true;
      const currentLocation = latLng(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      );
      center.value = currentLocation;
      site.value.latLng = currentLocation;
    }
  } catch (E) {
    console.log(E);
    hasLocation.value = false;
  }
};
const watchPosition = () => {
  const wait = Geolocation.watchPosition({}, (coordinates, err) => {
    if (
      coordinates &&
      coordinates.coords.latitude &&
      coordinates.coords.longitude
    ) {
      hasLocation.value = true;
      const currentLocation = latLng(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      );
      center.value = currentLocation;
      site.value.latLng = currentLocation;
    } else {
      hasLocation.value = false;
      console.log(err);
    }
  });
  onBeforeUnmount(() => {
    Geolocation.clearWatch(wait);
  });
};
onMounted(() => {
  printCurrentPosition();
  //watchPosition();
  addNullAccount();
});
</script>
<!-- https://vue2-leaflet.netlify.app/examples/simple.html -->
