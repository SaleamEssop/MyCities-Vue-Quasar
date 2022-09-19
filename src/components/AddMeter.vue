<template>
  <q-card class="mobile-full-width no-shadow">
    <!-- <q-card-section class="column q-col-gutter-md" :horizontal="false"> -->
    <q-list>
      <q-item
        tag="label"
        v-for="meterType in $METER_TYPES"
        :key="meterType.id"
        v-ripple
      >
        <q-item-section avatar>
          <q-radio v-model="meter.type.id" :val="meterType.id" />
        </q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <img :src="meterType.thumbnail" />
          </q-avatar>
          <q-item-label>{{ meterType.title }}</q-item-label>
          <!-- {{ meterType }} -->
        </q-item-section>
      </q-item>
    </q-list>

    <q-input
      color="black"
      type="text"
      min="0"
      v-model.trim="meter.title"
      label="Meter Title"
    />
    <q-input
      color="black"
      type="number"
      min="0"
      v-model.number="meter.number"
      label="Meter Number"
    />

    <q-input filled v-model="readingDate" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="readingDate" text-color="black">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-input
      color="black"
      type="number"
      min="0"
      v-model.number="firstReading.value"
      label="First Reading"
    />
  </q-card>
</template>
<script>
import { ref, computed, defineComponent } from "vue";
import { date } from "quasar";
import { useMeterStore } from "/src/stores/meter";

export default defineComponent({
  name: "AccountComponent",
  props: {
    propsMeter: { type: Object, default: null },
    autoUpdate: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const readingDate = computed({
      get() {
        return date.formatDate(new Date(firstReading.value.time), "YYYY/MM/DD");
      },
      set(newValue) {
        console.log(
          new Date(date.formatDate(newValue, "YYYY/MM/DD")).getTime()
        );
        firstReading.value.time = new Date(
          date.formatDate(newValue, "YYYY/MM/DD")
        ).getTime();
      },
    });

    // const firstReading = ref({
    //   isSubmit: true,
    //   time: Date.now(),
    //   value: 0,
    // });

    const meterStore = useMeterStore();
    const meter = ref(props.propsMeter);
    const firstReading = ref(meter.value.readings.data[0]);
    const addMeter = () => {
      meter.value.readings.data.push(firstReading.value);
      meterStore.addMeter(meter.value);
    };

    return {
      readingDate,
      firstReading,
      meter,
      addMeter,
    };
  },
});
</script>
