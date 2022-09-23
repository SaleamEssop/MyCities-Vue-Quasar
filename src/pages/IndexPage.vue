<template>
  <q-page>
    <img
      class="q-pa-lg"
      src="~assets/lightsandwaterapp.png"
      style="width: 100%; max-height: 300px; object-fit: contain"
    />
    <q-separator color="primary" />
    <q-page padding>
      <div class="text-center">
        <q-btn
          flat
          class="col-xs-6 col-sm-6 q-mt-lg"
          label="Manager"
          icon="square"
          size="lg"
          @click="moveTo('send_reading')"
        />
      </div>
    </q-page>
  </q-page>
</template>
<script setup>
import { ref } from "vue";
import IconButton from "components/IconButton.vue";

import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();

const $q = useQuasar();
const totalItems = ref([
  {
    title: "AppartmentMeter 409",
    icon: "water",
    type: { title: "Water", id: 1 },
  },
  {
    title: "AppartmentMeter 410",
    icon: "water",
    type: { title: "Water", id: 1 },
  },
]);

function log() {
  console.log(msg);
}
function moveTo(name) {
  router.push({ name: name });
}
</script>

<style scoped></style>
