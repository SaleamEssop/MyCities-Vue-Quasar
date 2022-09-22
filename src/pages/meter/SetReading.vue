<template>
  <q-page class="column" padding>
    <div class="flex justify-between items-center">
      <span class="text-bold">{{ meter?.type.title }}</span>
      <span class="round-cheap">Meter {{ meter?.number }}</span>
    </div>
    <div class="row flex-center">
      <q-card class="no-shadow">
        <q-card-section :horizontal="false">
          <q-card-section class="q-pt-none">
            <div
              class="relative"
              :class="inputFocus ? 'stroke-focus' : 'stroke-simple'"
            >
              <div class="absolute" style="opacity: 0">
                <q-input
                  type="number"
                  color="black"
                  :min="lastReading.value + 1"
                  outlined
                  @focus="inputFocus = true"
                  @blur="inputFocus = false"
                  v-model.number="currentReading"
                />
              </div>
              <div class="text-center">
                <MeterComponent
                  :text="currentReading"
                  :meterStyle="meter.type.id"
                  :readingType="
                    meter.type.id == 2
                      ? 'electricity-recorded-reading'
                      : 'water-recorded-reading'
                  "
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              rounded
              color="primary"
              text-color="black"
              @click="saveReading(false)"
            >
              Save
            </q-btn>
            <q-btn
              rounded
              color="primary"
              text-color="black"
              class="btn stroke-primary"
              @click="saveReading(true)"
              >Cost</q-btn
            >
          </q-card-actions>
          <q-card-actions align="center">
            <q-btn
              rounded
              color="primary"
              text-color="black"
              @click="saveReading(true)"
              >Submit to Municipality</q-btn
            >
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-xs">
      <q-table
        :dense="$q.screen.xs"
        class="my-sticky-header-table"
        title="History"
        :rows="readings"
        :columns="columns"
        row-key="name"
        flat
        bordered
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="time" :props="props">
              {{ new Date(props.row.time).toLocaleString("en-GB") }}
            </q-td>
            <q-td key="value" :props="props">
              {{ props.row.value }}
            </q-td>
            <q-td key="time" :props="props">
              <div
                v-if="
                  !lastReading.isSubmit && lastReading.time == props.row.time
                "
              >
                <q-btn
                  color="primary"
                  text-color="black"
                  @click="deleteLast(lastReading.time)"
                  round
                  icon="delete"
                ></q-btn>
              </div>
              <div v-else>
                {{ props.row.isSubmit ? "Yes" : "-" }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { defineComponent, computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { date } from "quasar";
import { useQuasar } from "quasar";
import MeterComponent from "/src/components/MeterComponent.vue";

import { useMeterStore } from "/src/stores/meter";
import { useReadingStore } from "/src/stores/reading";

const meterStore = useMeterStore();
const readingStore = useReadingStore();

const currentReading = ref();
const firstReading = ref({});
const lastReading = ref({});
const route = useRoute();
const $q = useQuasar();
const inputFocus = ref(false);

const meterId = route.params.meterId;
const meter = meterStore?.getMeterById(meterId);

const readings = computed(() => readingStore.getReadingsByMeterId(meterId));

const getSubmitedAndLastReading = () => {
  const data = (readings.value || []).sort((a, b) => b.time - a.time);
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
  readingStore.addReading({
    value: currentReading.value,
    time: Date.now(),
    isSubmit: isSubmit,
    meter: { id: meter.id },
  });
  currentReading.value = null;
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

const allowToDelete = computed(() => {
  const data = readings.value || [];
  return data.length > 0 && !data[0].isSubmit;
});

const deleteLast = (timeToDelete) => {
  readingStore?.delete(timeToDelete, meter.id);
  // const data = readings.value || [];
  // if (data.length > 0 && !data[data.length - 1].isSubmit) {

  // } else {
  //   showAlert("You cant' delete Submitted data");
  // }
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
    field: (row) => new Date(row.time).toLocaleString("en-GB"),
    sortable: true,
  },
  { name: "value", label: "Reading", align: "center", field: "value" },
  {
    name: "isSubmitted",
    label: "isSubmitted",
    align: "center",
    field: (row, index) => {
      if (row.isSubmit) {
        return "Yes";
      } else {
        return "No";
      }
    },
  },
];
</script>
<style scoped>
.stroke-focus {
  border: 2px solid blue;
  border-radius: 15px;
  padding: 5px;
}
.stroke-simple {
  border: 2px solid grey;
  border-radius: 15px;
  padding: 5px;
}
</style>
