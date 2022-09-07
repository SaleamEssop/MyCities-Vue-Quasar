<template>
  <q-page class="column" padding>
    <div class="text-h6">{{ meter?.title }} ({{ meter?.number }})</div>
    <div class="row flex-center">
      <q-card class="no-shadow">
        <q-card-section :horizontal="false">
          <q-card-section class="q-pt-none">
            <div class="relative">
              <div class="absolute" style="opacity: 0">
                <q-input
                  type="number"
                  color="black"
                  :min="lastReading.value + 1"
                  outlined
                  v-model.number="currentReading"
                  label="Current Reading"
                />
              </div>
              <div>
                <MeterComponent
                  :text="currentReading"
                  :meterStyle="meter.type.id"
                  readingType="recorded-reading"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn color="primary" text-color="black" @click="saveReading(true)"
              >Submit</q-btn
            >
            <q-btn
              color="primary"
              text-color="black"
              @click="saveReading(false)"
            >
              Save
            </q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-xs">
      <q-table
        :dense="$q.screen.xs"
        class="my-sticky-header-table"
        title="History"
        :rows="meter.readings.data"
        :columns="columns"
        row-key="name"
        flat
        bordered
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="time" :props="props">
              {{ new Date(props.row.time).toLocaleString() }}
            </q-td>
            <q-td key="value" :props="props">
              {{ props.row.value }}
            </q-td>
            <q-td key="time" :props="props">
              <div v-if="props.rowIndex == 0 && allowToDelete">
                <q-btn
                  color="primary"
                  text-color="black"
                  @click="deleteLast"
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
import { useMeterStore } from "/src/stores/meter";
import { useQuasar } from "quasar";
import MeterComponent from "/src/components/MeterComponent.vue";

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

const allowToDelete = computed(() => {
  const data = meter?.readings?.data || [];
  return data.length > 0 && !data[0].isSubmit;
});

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
