<template>
  <q-page padding class="flex-xs flex-center">
    <div class="row q-col-gutter-md">
      <q-video
        src="~assets/animation_electricity_meter.mp4"
        referrerpolicy="unsafe-url"
      />
      <QMediaPlayer />
      <IconButton
        class="col-xs-6 col-sm-6"
        title="Send Reading"
        icon="email"
        @click="moveTo('send_reading')"
      />
      <IconButton
        class="col-xs-6 col-sm-6"
        title="History"
        icon="manage_history"
        @click="moveTo('history')"
      />
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
</template>

<script setup>
import { ref } from "vue";
import IconButton from "components/IconButton.vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();
const playVideo = import(`assets/animation_electricity_meter.mp4`);
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
