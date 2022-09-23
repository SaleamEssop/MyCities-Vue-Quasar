<template>
  <q-card>
    <q-card-section class="bg-primary"> Estimated Cost </q-card-section>
    <q-card-section>
      <div>
        <div class="row flex justify-between items-center">
          <div class="column col-5">
            <b class="text-center">Daily Usage</b>
            <div
              class="medium-rcorners text-h6 text-center"
              color="negative"
              text-color="white"
            >
              {{ usesPerDay?.toFixed(2) }} {{ unit }}
            </div>
          </div>
          <div class="column col-5">
            <b class="text-center">Daily Cost</b>
            <div
              class="medium-rcorners text-h6 text-center"
              color="negative"
              text-color="white"
            >
              R{{ (0.840625 * usesPerDay).toFixed(2) }}
            </div>
          </div>
        </div>
        <div class="column flex justify-between items-center no-wrap q-mt-md">
          <b>Monthly Projected water usage</b>
          <div
            class="big-rcorners text-h4 text-center"
            color="negative"
            text-color="white"
          >
            R{{ (0.840625 * usesPerDay * 30).toFixed(2) }}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn color="primary" text-color="black" @click="$emit('close')"
        >Close</q-btn
      >
    </q-card-actions>
  </q-card>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { useReadingStore } from "/src/stores/reading";

export default defineComponent({
  name: "MeterCost",
  props: {
    meter: Object,
    isNew: Boolean,
  },
  setup(props) {
    const readingStore = useReadingStore();

    const usesPerDay = ref(0);
    const firstReading = ref({}); //Submitted
    const lastReading = ref({}); //Recorded

    const getSubmitedAndLastReading = () => {
      const data = (readings || []).sort((a, b) => b.time - a.time);
      lastReading.value = data[0] || {};
      firstReading.value =
        data.find(({ isSubmit }) => isSubmit) || data[data.length - 1] || {};
    };

    var readings = readingStore.getReadingsByMeterId(props?.meter?.id);
    getSubmitedAndLastReading();

    const calculateUnitForMonth = () => {
      const consumeUnits = lastReading.value.value - firstReading.value.value;
      const consumeTime = lastReading.value.time - firstReading.value.time;
      usesPerDay.value =
        (consumeUnits / consumeTime || 0) * 1000 * 60 * 60 * 24;
    };
    calculateUnitForMonth();

    const unit = computed(() => (props?.meter?.type?.id == 2 ? "U" : "L"));
    return {
      usesPerDay,
      unit,
      calculateUnitForMonth,
      firstReading,
      lastReading,
    };
  },
});
</script>
