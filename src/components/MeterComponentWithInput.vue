<template>
  <q-card>
    <q-card-section class="bg-primary">
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
            autofocus
            v-model.number="currentReading"
          />
        </div>
        <div class="text-center">
          <MeterComponent
            :text="currentReading ? currentReading / 10.0 : ''"
            :meterStyle="meter.type.id"
            :readingType="
              meter.type.id == 2
                ? 'electricity-recorded-reading'
                : 'water-recorded-reading'
            "
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
import { defineComponent, ref } from "vue";
import MeterComponent from "./MeterComponent.vue";
import { useReadingStore } from "/src/stores/reading";
import { date } from "quasar";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MeterComponentWithInput",
  props: {
    meter: Object,
    isNew: Boolean,
  },
  setup(props, { emit }) {
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

    const currentReading = ref();
    let lastReadingItem = ref(readingItems[0]);
    if (!props.isNew) {
      if (lastReadingItem.value.isSubmit) {
        showAlert("Submitted reading can not update");
      } else {
        lastReadingItem = ref(readingItems[1]);
        currentReading.value = readingItems[0].value;
      }
    }

    const saveReading = (isSubmit = false) => {
      // if (lastReadingItem.value.time + 24 * 60 * 60 * 1000 > Date.now()) {
      //   showAlert("You already took sample before 24 hours");
      //   return;
      // }
      const currentReadingValue = currentReading.value / 10.0;
      if (
        !currentReadingValue ||
        currentReadingValue <= lastReadingItem.value.value
      ) {
        showAlert("Current reading must be greater than the last reading");
        return;
      }

      if (props.isNew) {
        readingStore.addReading({
          value: currentReadingValue,
          time: Date.now(),
          isSubmit: isSubmit,
          meter: { id: props.meter.id },
        });
      } else {
        readingStore.updateReading({
          value: currentReadingValue,
          time: readingItems[0].time,
          isSubmit: isSubmit,
          meter: { id: props.meter.id },
        });
      }

      emit("save");
    };

    return {
      inputFocus,
      currentReading,
      lastReadingItem,
      saveReading,
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
