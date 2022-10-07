<template>
  <q-card>
    <q-card-section class="bg-primary">
      History Account ({{ account.title }})</q-card-section
    >
    <template v-for="meter in meters" :key="meter.id">
      <q-card-section>
        <MeterHistory :meter="meter" />
      </q-card-section>
    </template>
  </q-card>
</template>
<script>
import { defineComponent, ref, computed } from "vue";

import { useMeterStore } from "/src/stores/meter";
import MeterHistory from "./MeterHistory.vue";

export default defineComponent({
  name: "AccountHistory",
  props: {
    account: Object,
  },
  setup(props) {
    const meterStore = useMeterStore();
    const meters = meterStore.getByAccuntId(props.account.id);
    return { meters };
  },
  components: { MeterHistory },
});
</script>
