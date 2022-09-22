<template>
  <q-card>
    <q-card-section class="bg-primary">
      <div class="text-subtitle2">{{ meter.title }}</div>
      <div class="text-subtitle2">{{ meter.number }}</div>
      <div class="text-subtitle2">{{ lastReadingItem.value }}</div>
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
            :text="currentReading"
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

    const inputFocus = ref(false);
    const currentReading = ref();
    const lastReadingItem = ref(
      readingStore.getReadingsByMeterId(props.meter.id)[0]
    );
    const saveReading = (isSubmit = false) => {
      if (
        !currentReading.value ||
        currentReading.value <= lastReadingItem.value.value
      ) {
        showAlert("Current Reading must be more then last reading");
        return;
      }
      readingStore.addReading({
        value: currentReading.value,
        time: Date.now(),
        isSubmit: isSubmit,
        meter: { id: props.meter.id },
      });

      emit("save");
    };

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
