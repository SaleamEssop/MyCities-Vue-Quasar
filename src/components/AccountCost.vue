<template>
  <q-card>
    <q-card-section class="bg-primary">
      Estimated Full Bill Cost {{ account.number ? `(${account.number})` : "" }}
    </q-card-section>
    <q-card-section>
      <q-card-section class="bg-primary">
        <div class="text-subtitle2">Meters</div>
      </q-card-section>
      <div class="q-my-lg">
        <div
          class="row no-wrap"
          v-for="(cost, index) in calculationsForMeters"
          :key="index"
        >
          <div class="col">
            {{ cost.title }}
          </div>

          <div class="col-auto">R {{ cost.value.toFixed(2) }}</div>
        </div>
      </div>

      <q-card-section class="bg-primary">
        <div class="text-subtitle2">Fixed Cost</div>
      </q-card-section>

      <div class="q-my-lg">
        <div
          class="row no-wrap"
          v-for="(cost, index) in calculationsForAccount"
          :key="index"
        >
          <div class="col">
            {{ cost.title }}
          </div>

          <div class="col-auto">R {{ cost.value.toFixed(2) }}</div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="bg-primary">
      <div class="text-subtitle2">
        <div class="row no-wrap">
          <div class="col">Total</div>

          <div class="col-auto">R {{ totalFullBill.toFixed(2) }}</div>
        </div>
      </div>
    </q-card-section>

    <!-- <q-card-actions align="right">
      <q-btn color="primary" text-color="black" @click="$emit('close')"
        >Close</q-btn
      >
    </q-card-actions> -->
  </q-card>
</template>
<script>
import { defineComponent, ref, computed } from "vue";

import { useMeterStore } from "/src/stores/meter";
import { useReadingStore } from "/src/stores/reading";
import waterDurban from "/src/services/waterDurban.js";
import { LogLevel } from "@firebase/logger";

export default defineComponent({
  name: "AccountCost",
  props: {
    account: Object,
  },
  setup(props) {
    const readingStore = useReadingStore();
    const meterStore = useMeterStore();

    const meters = meterStore.getByAccuntId(props.account.id);

    const calculationsForMeters = new Array();
    const durbanReading = new waterDurban();
    meters.forEach((meter) => {
      var readings = readingStore.getReadingsByMeterId(meter.id);
      const usesPerDay = durbanReading.calculateUnitForMonth(
        durbanReading.getSubmitedAndLastReading(readings)
      );
      const projectionCost = durbanReading.getCost(usesPerDay, meter);
      calculationsForMeters.push({
        title: `${meter.title} - ${meter.number}`,
        value: projectionCost.total,
      });
    });

    const calculationsForAccount = new Array();

    props.account.fixedCosts.forEach((fixedCost) => {
      if (fixedCost.isApplicable) {
        calculationsForAccount.push({
          title: fixedCost.title,
          value: fixedCost.value || 0,
        });
      }
    });

    const totalFullBill = ref(0);
    calculationsForMeters.forEach(({ value }) => {
      totalFullBill.value = totalFullBill.value + value;
    });
    calculationsForAccount.forEach(({ value }) => {
      totalFullBill.value = totalFullBill.value + value;
    });

    // const usesPerDay = ref(0);

    // var readings = readingStore.getReadingsByMeterId(props?.meter?.id);
    // usesPerDay.value = durbanReading.calculateUnitForMonth(
    //   durbanReading.getSubmitedAndLastReading(readings)
    // );

    // const unit = computed(() => (props?.meter?.type?.id == 2 ? "kWh" : "L"));

    // const projectionCost = getCost(usesPerDay.value, props?.meter);

    return { calculationsForMeters, calculationsForAccount, totalFullBill };
  },
});
</script>
