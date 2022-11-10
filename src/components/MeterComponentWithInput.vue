<template>
  <q-card>
    <q-card-section class="bg-primary">
      <div
        class="q-my-sm"
        text-color="negative"
        style="color: red; font-style: italic"
      >
        {{ alertIfLessThen24Hours }}
      </div>

      <div class="text-subtitle2">Title : {{ meter?.title }}</div>
      <div class="text-subtitle2">
        Meter Number : {{ meter ? meter?.number : "" }}
      </div>
      <div class="text-subtitle2">
        Last saved reading : {{ lastReadingItem?.value }}
      </div>
    </q-card-section>

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
            v-model="currentReading"
            @keypress="
              (event) => {
                if (
                  `${currentReading || ''}`.length >=
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
            :text="currentReading"
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
    <q-card-actions align="right">
      <q-btn color="primary" text-color="black" @click="$emit('close')"
        >Cancel</q-btn
      >
      <q-btn color="primary" text-color="black" @click="saveReading(false)"
        >Save</q-btn
      >
    </q-card-actions>
  </q-card>
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import MeterComponent from "./MeterComponent.vue";
import { useReadingStore } from "/src/stores/reading";
import { date } from "quasar";
import { useQuasar } from "quasar";

import waterDurban from "/src/services/waterDurban.js";

export default defineComponent({
  name: "MeterComponentWithInput",
  props: {
    meter: Object,
    isNew: Boolean,
  },
  setup(props, { emit }) {
    const meterComopnentReadValue = ref();
    const readingStore = useReadingStore();
    const $q = useQuasar();
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

    const inputFocus = ref(false);
    const readingItems = readingStore.getReadingsByMeterId(props.meter.id);

    const currentReading = ref("");
    let lastReadingItem = ref(readingItems[0]);
    if (!props.isNew) {
      if (lastReadingItem.value.isSubmit) {
        showAlert("Submitted reading can not update");
      } else {
        lastReadingItem = ref(readingItems[1]);
        currentReading.value = readingItems[0].valueInString || "";
      }
    }

    const alertIfLessThen24Hours = computed(() => {
      if (lastReadingItem.value.time + 24 * 60 * 60 * 1000 > Date.now()) {
        let time = durbanReading.timeDiffCalc(
          lastReadingItem.value.time + 24 * 60 * 60 * 1000,
          Date.now()
        );
        return `Your last entry was less than 24 hours ago. Please wait ${time} before you read again.`;
      } else {
        return "";
      }
    });

    const durbanReading = new waterDurban();

    function confirm(msg, callback) {
      $q.dialog({
        title: "Confirm",
        message: `${msg}`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          // console.log('>>>> OK')
          callback();
        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
          callback();
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    const saveReading = (isSubmit = false) => {
      if (lastReadingItem.value.time + 24 * 60 * 60 * 1000 > Date.now()) {
        let time = durbanReading.timeDiffCalc(
          lastReadingItem.value.time + 24 * 60 * 60 * 1000,
          Date.now()
        );
        showAlert(
          `Your last entry was less than 24 hours ago. Please wait ${time} before you read again.`
        );
        return;
      }
      const valueInString = meterComopnentReadValue.value.getValueInString();
      const currentReadingValue =
        valueInString / (props.meter.type.id == 2 ? 10.0 : 10000.0);
      if (
        !currentReadingValue ||
        currentReadingValue <= lastReadingItem.value.value
      ) {
        const maximum = props.meter.type.id == 2 ? 99999.9 : 9999999.9;
        confirm(
          `This meter will rollover from ${lastReadingItem.value.valueInString} to ${valueInString}. Please confirm.`,
          () => {
            if (props.isNew) {
              readingStore.addReading({
                value: currentReadingValue,
                valueInString: valueInString,
                time: Date.now(),
                isSubmit: isSubmit,
                meter: { id: props.meter.id },
              });
            } else {
              readingStore.updateReading({
                value: currentReadingValue,
                valueInString: valueInString,
                time: readingItems[0].time,
                isSubmit: isSubmit,
                meter: { id: props.meter.id },
              });
            }

            emit("save");
          }
        );
        // showAlert("Current reading must be greater than the last reading");
        return;
      }
    };

    return {
      inputFocus,
      currentReading,
      lastReadingItem,
      saveReading,
      meterComopnentReadValue,
      showAlert,
      alertIfLessThen24Hours,
    };
  },
  components: { MeterComponent },
});
</script>

<style scoped>
.stroke-focus {
  border: 2px solid blue;
  border-radius: 15px;
  padding: 5px;
}
.stroke-simple {
  border: 2px solid grey;
  border-radius: 15px;
  padding: 5px;
}
</style>
