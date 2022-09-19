<template>
  <q-page>
    <img
      src="~assets/lightsandwaterapp.jpg"
      style="width: 100%; max-height: 300px; object-fit: contain"
    />
    <q-page class="">
      <div class="row q-col-gutter-md">
        <IconButton
          class="col-xs-6 col-sm-6"
          title="Send Reading"
          icon="email"
          @click="moveTo('send_reading')"
        />
        <!-- <IconButton
          class="col-xs-6 col-sm-6"
          title="History"
          icon="manage_history"
          @click="moveTo('history')"
        /> -->
        <IconButton
          class="col-xs-6 col-sm-6"
          title="Estimator"
          icon="calculate"
          @click="moveTo('estimator')"
        />
        <IconButton
          class="col-xs-6 col-sm-6"
          title="Account Setup"
          icon="electric_meter"
          @click="moveTo('account_setup')"
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
