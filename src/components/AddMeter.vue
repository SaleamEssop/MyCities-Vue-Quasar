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
          Click on the calendar and enter the date, if available,  on which the meter was last read by the municipality.
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
              message: `If available, select from the calendar the last actual date on which the meter was read by the municipality, not estimated.
If not available, simply enter the current date and meter reading and update it after 24 hours.The app will then start to calculate the usage and cost.`,
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
                :step="1"
                autofocus
                v-model="firstReading.valueInString"
                @keypress="
                  (event) => {
                    if (
                      `${firstReading.valueInString || ''}`.length >=
                        (meter.type.id == 2 ? 6 : 8) ||
                      event.keyCode == 46
                    ) {
                      event.preventDefault();
                    } else {
                    }
                  }
                "
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
import { addMeterAndReading } from "src/boot/axios";

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

      if (meter.value.title == null || meter.value.number == null) {
        $q.notify({ message: "Fill all details before saving." });
        return;
      }

      if (
        firstReading.value.valueInString == null ||
        firstReading.value.valueInString.trim() == ""
      ) {
        $q.notify({
          message:
            "You must enter a reading before saving even if it is all zeroes.",
        });
        return;
      }

      firstReading.value.valueInString =
        meterComopnentReadValue.value.getValueInString();
      firstReading.value.value =
        firstReading.value.valueInString /
        (meter.value.type.id == 2 ? 10.0 : 10000.0);

      addMeterAndReading({
        meter_type_id: meter.value.type.id,
        meter_title: meter.value.title,
        meter_number: meter.value.number,
        meter_reading_date: new Date(firstReading.value.time).toISOString(),
        meter_reading: firstReading.value.valueInString,
        account_id: meter.value.account.id,
      }).then(({ status, data }) => {
        if (status) {
          data.readings.forEach((reading) => {
            readingStore.addReading({
              id: reading.id,
              meter: { id: reading.meter_id },
              time: new Date(reading.reading_date).getTime(),
              value: firstReading.value.value,
              valueInString: reading.reading_value,
            });
          });
          meterStore.addMeter({
            account: { id: data.account_id },
            id: data.id,
            number: data.meter_number,
            title: data.meter_title,
            type: {
              id: data.meter_type_id,
            },
          });
          emit("save");
        }
      });
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

    return {
      readingDate,
      firstReading,
      meter,
      alert,
      addMeter,
      inputFocus,
      meterComopnentReadValue,
      showAlert,
    };
  },
  components: { MeterComponent },
});
</script>
