<template>
  <q-card>
    <q-card-section class="bg-primary">
      <div class="text-subtitle2">Necessary Details</div>
    </q-card-section>
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
    <q-card-section>
      <q-input
        color="black"
        type="text"
        min="0"
        v-model.trim="meter.title"
        label="Meter Title"
      />
      <q-input
        color="black"
        type="text"
        min="0"
        v-model.trim="meter.number"
        label="Meter Number"
      />

      <q-input filled v-model="readingDate" mask="date" :rules="['date']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
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
        label="Last bill reading"
      >
        <template v-slot:append>
          <q-avatar>
            <q-icon name="help" />
          </q-avatar>
        </template>
      </q-input>
    </q-card-section>
    <q-space />
    <q-card-actions align="center">
      <q-btn
        color="red"
        text-color="white"
        class="q-my-none q-mx-none"
        label="Cancel"
        glossy
        @click="$emit('close')"
      />

      <q-btn
        color="primary"
        text-color="black"
        class="q-my-none q-mx-noe"
        label="Save"
        glossy
        @click="addMeter"
      />
    </q-card-actions>
  </q-card>
</template>
<script>
import { ref, computed, defineComponent } from "vue";
import { date } from "quasar";
import { useAccountStore } from "/src/stores/account";
import { useMeterStore } from "/src/stores/meter";
import { useReadingStore } from "/src/stores/reading";

const nullReading = {
  isSubmit: true,
  time: Date.now(),
  value: null,
  meter: { id: null },
};

const nullMeter = {
  id: null,
  title: null,
  number: null,
  type: { id: 1 },
  account: { id: null },
};

export default defineComponent({
  name: "AccountComponent",
  props: {
    propsMeter: { type: Object, default: nullMeter },
    autoUpdate: { type: Boolean, default: false },
    propsAccount: { type: Object },
  },
  setup(props, { emit }) {
    const readingDate = computed({
      get() {
        return date.formatDate(new Date(firstReading.value.time), "YYYY/MM/DD");
      },
      set(newValue) {
        firstReading.value.time = new Date(
          date.formatDate(newValue, "YYYY/MM/DD")
        ).getTime();
      },
    });

    const meterStore = useMeterStore();
    const readingStore = useReadingStore();

    const meter = ref(
      props.propsMeter || JSON.parse(JSON.stringify(nullMeter))
    );
    const firstReading = ref(JSON.parse(JSON.stringify(nullReading)));
    const addMeter = () => {
      if (meter.value.id == null) {
        meter.value.id = Date.now();
        meter.value.account.id = props.propsAccount.id;
      }
      firstReading.value.meter.id = meter.value.id;
      readingStore.addReading(firstReading.value);
      meterStore.addMeter(meter.value);
      emit("save");
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
