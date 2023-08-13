<template>
  <!-- {{ date.formatDate(new Date(readings[0].time), "MMMM") }} -->
  <q-table
    :dense="$q.screen.xs"
    class="my-sticky-header-table"
    :title="` ${meter.type.title} : ${meter.title} ( ${meter.number} )`"
    :rows="readings"
    :columns="columns"
    row-key="name"
    flat
    bordered
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="time" :props="props">
          {{ date.formatDate(new Date(props.row.time), "DD/MM/YYYY") }}
        </q-td>
        <q-td key="value" :props="props">
          {{ props.row.value }}
        </q-td>
        <q-td key="isSubmit" :props="props">
          {{ props.row.isSubmit ? "Yes" : "-" }}
        </q-td>
        <q-td key="isDelete" :props="props">
          <q-btn icon="delete" flat @click="deleteReading(props.row.id)" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { useReadingStore } from "/src/stores/reading";
import waterDurban from "/src/services/waterDurban.js";
import { date } from "quasar";
import { deleteMeterReadings } from "src/boot/axios";
import { Dialog, useQuasar } from "quasar";

const columns = [
  {
    name: "time",
    label: "Date",
    align: "center",
    sortable: true,
  },
  { name: "value", label: "Reading", align: "center", field: "value" },
  {
    name: "isSubmit",
    label: "Submit",
    align: "center",
  },
  {
    name: "isDelete",
    label: "Delete",
    align: "center",
  },
];

export default defineComponent({
  name: "MeterHistory",
  props: {
    meter: Object,
  },
  setup(props) {
    const readingStore = useReadingStore();
    // var readings = readingStore.getReadingsByMeterId(props.meter.id);
    const readings = computed(() =>
      readingStore.getReadingsByMeterId(props.meter.id)
    );
    const $q = useQuasar();
    const deleteReading = (id) => {
      $q.dialog({
        title: "Confirm",
        message:
          "Are you sure you want to delete this entry? This may change your bills calculation.",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        deleteMeterReadings({ reading_id: id }).then((status) => {
          if (status.code == 200) {
            readingStore.deleteReadings(id);
          }
        });
      });
    };
    return { readings, columns, date, deleteReading };
  },
});
</script>
