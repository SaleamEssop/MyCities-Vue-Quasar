<template>
  <q-page class="" padding>
    <div class="text-h6">
      {{ meter?.title }} ({{ lastReading.value - firstReading.value }} Units)
    </div>
    <q-card class="mobile-full-width">
      <q-card-section :horizontal="false">
        <q-card-section class="q-col-gutter-md q-pt-none">
          <q-input
            type="number"
            color="black"
            :min="lastReading.value + 1"
            outlined
            v-model.number="currentReading"
            label="Current Reading"
          />
        </q-card-section>
        <q-btn color="primary" text-color="black" @click="saveReading(false)">
          Save
        </q-btn>
        <q-btn color="primary" text-color="black" @click="saveReading(true)"
          >Save and Submit</q-btn
        >
        <!-- <q-card-actions>
          <q-btn color="primary" text-color="black" @click="saveReading(true)">
            Save & Submit
          </q-btn>
          <q-btn color="primary" text-color="black" @click="saveReading(false)">
            Update Last
          </q-btn>
          <q-btn color="primary" text-color="black" @click="saveReading(false)">
            Save
          </q-btn>
        </q-card-actions> -->
      </q-card-section>
    </q-card>
    <div class="q-pa-md">
      <q-btn color="primary" text-color="black" @click="deleteLast">
        Delete Last
      </q-btn>
      <q-table
        class="my-sticky-header-table"
        :title="meter.title"
        :rows="meter.readings.data"
        :columns="columns"
        row-key="name"
        flat
        bordered
      />
    </div>
    <!-- <q-page class="q-my-2">
      <q-card class="">
        <q-card-section :horizontal="false">
          <q-card-section class="flex flex-center q-py-none"> </q-card-section>
        </q-card-section>
        <q-input
          color="black"
          type="number"
          min="0"
          outlined
          v-model.number="firstReading.value"
          readonly
        />
        <label
          >Last Submitted Reading
          {{ new Date(firstReading.time).toLocaleString() }}</label
        >

        <q-input
          color="black"
          type="number"
          min="0"
          outlined
          v-model.number="lastReading.value"
          readonly
        />
        <label
          >Last Noted Reading
          {{ new Date(lastReading.time).toLocaleString() }}</label
        >
      </q-card>
    </q-page> -->
  </q-page>
</template>
<script setup>
import { defineComponent, computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { date } from "quasar";
import { useMeterStore } from "/src/stores/meter";
import { useQuasar } from "quasar";

const currentReading = ref();
const firstReading = ref({});
const lastReading = ref({});
const route = useRoute();
const $q = useQuasar();
const meterStore = useMeterStore();

const meterId = route.params.meterId;
const meter = meterStore?.allMeters.find(({ id }) => {
  return id == meterId;
});

const getSubmitedAndLastReading = () => {
  const data = (meter?.readings?.data || []).sort((a, b) => b.time - a.time);
  lastReading.value = data[0] || {};
  firstReading.value =
    data.find(({ isSubmit }) => isSubmit) || data[data.length - 1] || {};
};

const saveReading = (isSubmit = false) => {
  if (
    !currentReading.value ||
    currentReading.value <= lastReading.value.value
  ) {
    showAlert("Current Reading must be more then last reading");
    return;
  }
  meterStore.addReading(meter.id, {
    value: currentReading.value,
    time: Date.now(),
    isSubmit: isSubmit,
  });
  currentReading.value = "";
  // lastReadingOfMonthOrPreviousMonth();
  getSubmitedAndLastReading();
};
getSubmitedAndLastReading();

const showAlert = (msg) => {
  $q.notify({
    attrs: {
      // for the notification itself:
      role: "alertdialog",
    },
    message: msg,
    actions: [
      {
        icon: "close",
        // for individual action (button):
        "aria-label": "Dismiss",
      },
    ],
  });
};

const deleteLast = () => {
  const data = meter?.readings?.data || [];
  if (data.length > 0 && !data[0].isSubmit) {
    meterStore?.delete(meter?.id, data[0] || {});
  } else {
    showAlert("You cant' delete Submitted data");
  }
  getSubmitedAndLastReading();
};
// const updateMeter = (meterId) => {
//   meterId;
// };
// watch('route.params.meterId', updateMeter);
// updateMeter(route.params.meterId);

const columns = [
  {
    name: "time",
    label: "Time",
    align: "center",
    field: (row) => new Date(row.time).toLocaleString(),
    sortable: true,
  },
  { name: "value", label: "Reading", align: "center", field: "value" },
  {
    name: "isSubmitted",
    label: "Submitted",
    align: "center",
    field: (row) => {
      if (row.isSubmit) {
        return "Submitted";
      } else {
        return "";
      }
    },
  },
];
</script>
