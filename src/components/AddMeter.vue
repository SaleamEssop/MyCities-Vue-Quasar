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

      <q-separator color="primary" spaced="lg" size="4px" />
      <div class="text-center">
        <div>
          Enter date on which your bill was last read by the municipality
        </div>
        <q-separator spaced="lg" />
        <q-btn icon="event" color="primary" size="lg" text-color="black">
          <q-popup-proxy
            @before-show="updateProxy"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date v-model="readingDate" mask="DD/MM/YYYY">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn
                  label="OK"
                  color="primary"
                  flat
                  @click="save"
                  v-close-popup
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <q-btn
          class="absolute"
          icon="help"
          @click="
            alert({
              title: 'Important note',
              message: `Enter the last reading from your bill. This will be the actual reading by the municipality which is reflected on your bill. Not the estimated reading.
You may have to go back a few months on your bill. After entering it, you can enter the current reading to get an average.
If you do have have this reading available, enter the current meter reading, with the current date. Wait a week and update the reading to get an average.`,
            })
          "
          round
          flat
          color="primary"
        />
        <div>Calendar</div>
      </div>

      <!-- <q-input filled v-model="readingDate" mask="date" :rules="['date']">
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
      </q-input> -->
      <q-badge class="q-mt-lg" color="primary" text-color="black">
        <span class="text-body1">Reading date: {{ readingDate }}</span>
      </q-badge>
      <div class="text-center">
        <q-card-section>
          <div
            class="relative"
            :class="inputFocus ? 'stroke-focus' : 'stroke-simple'"
          >
            <div class="absolute" style="opacity: 0">
              <q-input
                type="number"
                color="black"
                :min="0"
                outlined
                @focus="inputFocus = true"
                @blur="inputFocus = false"
                autofocus
                v-model="firstReading.valueInString"
              />
            </div>
            <div class="text-center">
              <MeterComponent
                ref="meterComopnentReadValue"
                :text="firstReading.valueInString"
                :meterStyle="meter.type.id"
                :readingType="
                  meter.type.id == 2
                    ? 'electricity-recorded-reading'
                    : 'water-recorded-reading'
                "
                :isInput="true"
              />
            </div>
          </div>
        </q-card-section>
      </div>
      <!-- <q-input
        color="black"
        type="number"
        min="0"
        v-model.number="firstReading.value"
        label="Enter the reading"
      /> -->
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
        class="q-my-none q-mx-none"
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
import { useQuasar } from "quasar";
import MeterComponent from "/src/components/MeterComponent.vue";
import MeterComponentWithInput from "./MeterComponentWithInput.vue";

const nullReading = {
  isSubmit: true,
  time: Date.now(),
  value: null,
  valueInString: "",
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
    const $q = useQuasar();

    const readingDate = computed({
      get() {
        return date.formatDate(new Date(firstReading.value.time), "DD/MM/YYYY");
      },
      set(newValue) {
        if (newValue !== null) {
          firstReading.value.time = new Date(
            date.extractDate(newValue, "DD/MM/YYYY")
          ).getTime();
        }
      },
    });

    const meterStore = useMeterStore();
    const readingStore = useReadingStore();

    const meter = ref(
      props.propsMeter || JSON.parse(JSON.stringify(nullMeter))
    );

    const meterComopnentReadValue = ref();

    const firstReading = ref(JSON.parse(JSON.stringify(nullReading)));
    const addMeter = () => {
      if (meter.value.id == null) {
        meter.value.id = Date.now();
        meter.value.account.id = props.propsAccount.id;
      }
      firstReading.value.meter.id = meter.value.id;

      if (
        firstReading.value.valueInString == null ||
        meter.value.title == null ||
        meter.value.number == null
      ) {
        $q.notify({
          message: "Fill all details before saving",
        });
        return;
      }

      firstReading.value.valueInString =
        meterComopnentReadValue.value.getValueInString();
      firstReading.value.value = firstReading.value.valueInString / 10.0;
      readingStore.addReading(firstReading.value);
      meterStore.addMeter(meter.value);
      emit("save");
    };

    function alert({ title, message }) {
      $q.dialog({
        dark: false,
        title: title,
        message: message,
      })
        .onOk((data) => {
          // console.log('>>>> OK, received', data)
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    const inputFocus = ref(false);
    return {
      readingDate,
      firstReading,
      meter,
      alert,
      addMeter,
      inputFocus,
      meterComopnentReadValue,
    };
  },
  components: { MeterComponent },
});
</script>
