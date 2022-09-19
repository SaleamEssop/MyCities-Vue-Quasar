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
          label="Site or complex name. Eg: Home, Tenants"
          v-model.trim="site.title"
        />
      </q-card-section>
      <!-- <template v-for="(account, index) in site.accounts" :key="index">
        <q-separator />
        <q-card-section>
          <div class="justify-between items-center text-h6 q-py-sm">
            <div>Account {{ index + 1 }}</div>
          </div>
          <div class="row">
            <div class="col-12 justify-between items-center">
              Enter name - As per bill
              <span class="text-h6 q-px-sm">{{ account.title }}</span>
            </div>
            <div class="col-12 justify-between items-center">
              Enter account number - As per bill
              <span class="text-h6 q-px-sm">{{ account.number }}</span>
            </div>
            <div
              v-for="(fixedCost, index) in account.fixedCosts"
              class="col-12"
              :key="index"
            >
              <span>{{ fixedCost.title }}</span>
              <span class="text-h6 q-px-sm">{{ fixedCost.value }}</span>
            </div>
          </div>
          <q-card-actions align="right">
            <q-btn
              flat
              round
              color="primary"
              text-color="red"
              v-if="site.accounts.length > 1"
              icon="delete"
              @click="deletAccount(account, index)"
            />
            <q-btn
              color="primary"
              text-color="black"
              icon-right="send"
              label="SetUp Details"
              @click="
                selectedAccount = account;
                startFixedCost = true;
              "
            />
          </q-card-actions>
        </q-card-section>
      </template> -->

      <!-- <q-card-actions align="center">
        <q-btn
          color="primary"
          text-color="black"
          class="q-my-none"
          icon="add"
          label="Add Account"
          glossy
          @click="addNullAccount"
        />
      </q-card-actions> -->
      <q-card-section class="column q-col-gutter-md" :horizontal="false">
        <q-input
          color="black"
          type="textarea"
          outlined
          label="Site Address"
          v-model.trim="site.address"
        />
      </q-card-section>
      <q-separator />
      <AccountComponent
        :account="selectedAccount"
        @close="startFixedCost = false"
        @save="startFixedCost = false"
        :autoUpdate="true"
        @update:account="Object.assign(selectedAccount, $event)"
      />
      <q-separator />
      <!-- {{ selectedMeter }} -->
      <AddMeter :propsMeter="selectedMeter" />
      <q-separator />
      <q-card-actions align="center">
        <q-btn color="primary" text-color="black" @click="addSite">Save</q-btn>
      </q-card-actions>
    </q-card>

    <q-dialog
      v-model="startFixedCost"
      @hide="startFixedCost = false"
      :full-width="true"
      :full-height="true"
      persistent
    >
      <!-- <q-page>
        <q-page-container> -->

      <AccountComponent
        :account="selectedAccount"
        @close="startFixedCost = false"
        @save="startFixedCost = false"
        @update:account="Object.assign(selectedAccount, $event)"
      />

      <!-- </q-page-container> -->
      <!-- </q-page> -->
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, watch } from "vue";
import { latLng } from "leaflet";
import { useSiteStore } from "/src/stores/site";
import { useAccountStore } from "/src/stores/account";
import { useMeterStore } from "/src/stores/meter";

import { useRouter } from "vue-router";
//https://capacitorjs.com/docs/apis/geolocation
import { Plugins } from "@capacitor/core";
import AccountComponent from "../../components/AccountComponent.vue";
import AddMeter from "src/components/AddMeter.vue";
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
});

const selectedAccount = ref({
  id: Date.now(),
  title: "",
  number: "",
  site: { id: site.value.id },
  fixedCosts: [
    {
      id: Date.now(),
      title: "Rates",
      value: 0,
      isApplicable: true,
      isFromServer: true,
      isFromUser: false,
    },
    {
      id: Date.now(),
      title: "Water Loss Levy",
      value: 0,
      isApplicable: true,
      isFromServer: true,
      isFromUser: false,
    },
    {
      id: Date.now(),
      title: "Refuse Collection",
      value: 0,
      isApplicable: true,
      isFromServer: true,
      isFromUser: false,
    },
    {
      id: Date.now(),
      title: "Infrastructure Levy",
      value: 0,
      isApplicable: true,
      isFromServer: true,
      isFromUser: false,
    },
  ],
});

const selectedMeter = ref({
  id: Date.now(),
  title: "",
  number: 0,
  type: { id: 1 },
  readings: {
    sort: 1,
    data: [
      {
        isSubmit: true,
        time: Date.now(),
        value: 0,
      },
    ],
  },
  account: { id: selectedAccount.value.id },
});

const zoom = ref(13);
const center = ref(latLng(-29.813218, 30.940247));
const hasLocation = ref(null);

const onMarkerMove = (newValue) => {
  site.value.latLng = JSON.parse(JSON.stringify(newValue));
};

const router = useRouter();
const siteStore = useSiteStore();
const accountStore = useAccountStore();
const meterStore = useMeterStore();

const addSite = () => {
  siteStore.addSite(site.value);
  accountStore.addAccount(selectedAccount.value);
  meterStore.addMeter(selectedMeter.value);
  router.back(-1);
};
const startFixedCost = ref(false);
const deletAccount = (account, index) => {
  site.value.accounts.splice(index, 1);
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
});
</script>
<!-- https://vue2-leaflet.netlify.app/examples/simple.html -->
