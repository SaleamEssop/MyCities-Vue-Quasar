<template>
  <q-card>
    <q-card-section class="bg-primary">
      Estimated Cost {{ meter.number ? `(${meter.number})` : "" }}
    </q-card-section>
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
              R{{ (projectionCost["total"] / 30.0).toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="q-my-lg">
          <div
            class="row no-wrap"
            v-for="(cost, index) in projectionCost['projection']"
            :key="index"
          >
            <div class="col">
              {{ cost.title }}
            </div>
            <div class="col-auto">R {{ cost.value.toFixed(2) }}</div>
          </div>
        </div>

        <div class="column flex justify-between items-center no-wrap q-mt-md">
          <b>Monthly Projected cost</b>
          <div
            class="big-rcorners text-h4 text-center"
            color="negative"
            text-color="white"
          >
            R {{ projectionCost["total"].toFixed(2) }}
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
import waterDurban from "/src/services/waterDurban.js";

export default defineComponent({
  name: "MeterCost",
  props: {
    meter: Object,
    isNew: Boolean,
  },
  setup(props) {
    const readingStore = useReadingStore();

    const durbanReading = new waterDurban();
    const getCost = durbanReading.getCost;

    const usesPerDay = ref(0);

    var readings = readingStore.getReadingsByMeterId(props?.meter?.id);
    usesPerDay.value = durbanReading.calculateUnitForMonth(
      durbanReading.getSubmitedAndLastReading(readings)
    );

    const unit = computed(() => (props?.meter?.type?.id == 2 ? "kWh" : "L"));

    const projectionCost = getCost(usesPerDay.value, props?.meter);

    return {
      getCost,
      usesPerDay,
      unit,
      projectionCost,
    };
  },
});
</script>
