<template>
  <q-card class="no-shadow" dense>
    <q-card-section class="text-center q-py-none">
      <div class="flex justify-between items-center">
        <span class="text-bold text-h6 text-black">{{
          meter?.type.title
        }}</span>
        <span class="round-cheap">Meter {{ meter?.number }}</span>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none text-center">
      <div class="q-mt-md">
        <div class="flex justify-between items-center wrap">
          Submitted Reading
          <b> {{ new Date(firstReading.time).toLocaleString("en-GB") }}</b>
        </div>
        <MeterComponent
          :text="firstReading.value"
          :meterStyle="meter?.type?.id"
          readingType="submitted-reading"
        />
      </div>
      <div class="q-mt-md">
        <div class="flex justify-between items-center wrap">
          Last saved reading
          <b>{{ new Date(lastReading.time).toLocaleString("en-GB") }}</b>
        </div>
        <MeterComponent
          :text="lastReading.value"
          :meterStyle="meter?.type?.id"
          :readingType="
            meter.type.id == 2
              ? 'electricity-recorded-reading'
              : 'water-recorded-reading'
          "
        />
      </div>
    </q-card-section>

    <q-card-section class="text-center">
      <div class="flex justify-center items-center">
        <span
          class="round-cheap"
          clickable
          v-ripple
          @click="modelForReadingSet = true"
          >Enter Latest Reading</span
        >
        <p class="q-mx-md"></p>
        <span class="round-cheap">Cost</span>
        <q-btn flat icon="more_horiz" text-color="primary">
          <q-menu anchor="center middle" self="center middle">
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Submit to Municipality</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Edit this meter</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Delete this meter</q-item-section>
              </q-item>
              <q-item
                clickable
                @click="modelMeterForNewEdit = true"
                v-close-popup
              >
                <q-item-section>Add a new meter</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <!-- <q-btn
        rounded
        class="q-mt-lg"
        color="primary"
        text-color="black"
        label="Submit to Municipality"
      /> -->
    </q-card-section>

    <q-slide-transition v-if="false">
      <div v-show="isExpand">
        <q-separator />
        <q-card-section>
          <div>
            <div class="row flex justify-between items-center">
              <div class="column col-5">
                <b class="text-center">Daily Usage</b>
                <div
                  class="medium-rcorners text-h6"
                  color="negative"
                  text-color="white"
                >
                  {{ usesPerDay.toFixed(2) }} L
                </div>
              </div>
              <div class="column col-5">
                <b class="text-center">Daily Cost</b>
                <div
                  class="medium-rcorners text-h6"
                  color="negative"
                  text-color="white"
                >
                  R{{ (0.840625 * usesPerDay).toFixed(2) }}
                </div>
              </div>
            </div>
            <div
              class="column flex justify-between items-center no-wrap q-mt-md"
            >
              <b>Monthly Projected water usage</b>
              <div
                class="big-rcorners text-h4"
                color="negative"
                text-color="white"
              >
                R{{ (0.840625 * usesPerDay * 30).toFixed(2) }}
              </div>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>

    <q-card-actions v-if="false">
      <q-btn
        class="full-width"
        color="primary"
        text-color="black"
        @click="moveTo('setReading', meter?.id)"
        >Set Reading</q-btn
      >
    </q-card-actions>

    <q-card-section
      v-if="false"
      class="text-center q-py-none bg-primary q-mt-md"
    >
      <q-item
        class="flex justify-center"
        clickable
        :class="!isExpand ? 'bubble-bottom' : 'bubble-top'"
        @click="isExpand = !isExpand"
      >
        <q-btn
          round
          flat
          dense
          :icon="isExpand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        />
      </q-item>
    </q-card-section>
  </q-card>
  <q-dialog
    v-model="modelForReadingSet"
    @hide="modelForReadingSet = false"
    persistent
    :full-width="true"
  >
    <MeterComponentWithInput
      :meter="meter"
      @close="modelForReadingSet = false"
      @save="modelForReadingSet = false"
      :isNew="true"
    />
  </q-dialog>

  <q-dialog
    v-model="modelMeterForNewEdit"
    @hide="modelMeterForNewEdit = false"
    :full-width="true"
    persistent
  >
    <AddMeter
      :propsMeter="null"
      :propsAccount="selectedAccount"
      @close="modelMeterForNewEdit = false"
      @save="modelMeterForNewEdit = false"
    />
  </q-dialog>
</template>
<script>
import { defineComponent, computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { date } from "quasar";

import { useQuasar } from "quasar";
import MeterComponent from "./MeterComponent.vue";

import { useMeterStore } from "/src/stores/meter";
import { useReadingStore } from "/src/stores/reading";
import { useAccountStore } from "/src/stores/account";

import MeterComponentWithInput from "./MeterComponentWithInput.vue";
import AddMeter from "./AddMeter.vue";

const meterStore = useMeterStore();
const readingStore = useReadingStore();
const accountStore = useAccountStore();

export default defineComponent({
  name: "MeterReadingSet",
  props: {
    meter: Object,
  },
  setup(props) {
    const $q = useQuasar();
    const router = useRouter();

    var readings = [];

    const modelForReadingSet = ref(false);
    const modelMeterForNewEdit = ref(false);

    const selectedAccount = ref(
      accountStore.getAccountById(props.meter.account.id)
    );

    const groupReading = computed(() => {
      let index = 0;
      const data = (readings || [])
        .sort((b, a) => b.time - a.time)
        .reduce((a, o) => {
          const dateObj = new Date(o.time);
          var month = dateObj.getUTCMonth() + 1; //months from 1-12
          var year = dateObj.getUTCFullYear();
          const key = `${year}-${month}`;
          (a[key] ??= {
            group: [],
            month: month,
            year: year,
            index: index++,
          }).group.push({
            ...o,
          });
          return a;
        }, {});
      return data;
    });
    const currentReading = ref();
    const firstReading = ref({}); //Submitted
    const lastReading = ref({}); //Recorded
    const usesPerDay = ref();
    const isExpand = ref(false);

    const saveReading = (isSubmit = false) => {
      if (
        !currentReading.value ||
        currentReading.value <= lastReading.value.value
      ) {
        showAlert("Current Reading must be more then last reading");
        return;
      }
      useReadingStore.addReading(props.meter.id, {
        value: currentReading.value,
        time: Date.now(),
        isSubmit: isSubmit,
      });
      currentReading.value = null;
      // lastReadingOfMonthOrPreviousMonth();
      getSubmitedAndLastReading();
    };
    const getSubmitedAndLastReading = () => {
      const data = (readings || []).sort((a, b) => b.time - a.time);
      lastReading.value = data[0] || {};
      firstReading.value =
        data.find(({ isSubmit }) => isSubmit) || data[data.length - 1] || {};
    };
    const lastReadingOfMonthOrPreviousMonth = () => {
      const _data = groupReading.value;
      const keys = Object.keys(_data);
      if (keys.length > 1) {
        const currentMonthKey = keys[0]; //Current Month Group
        const lastMonthKey = keys[1]; //Last Month Group
        const firstData = _data[lastMonthKey].group[0];
        const lastData = _data[currentMonthKey].group[0];
        firstReading.value = firstData;
        lastReading.value = lastData;
        console.log("Reading2");
      } else if (keys.length == 1) {
        const key = keys[0];
        const group = _data[key].group;
        const firstData = group[group.length - 1];
        const lastData = group[0];
        firstReading.value = firstData;
        lastReading.value = lastData;
        console.log("Reading1");
      }
      return;
    };

    watch(
      () => readingStore.getReadingsByMeterId(props?.meter?.id),
      (newValue) => {
        readings = newValue;
        // lastReadingOfMonthOrPreviousMonth();
        getSubmitedAndLastReading();
      },
      { deep: true }
    );

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
    function moveTo(path, meterId) {
      router.push({ path: `${path}/${meterId}` });
    }
    function calculateUnitForMonth() {
      const consumeUnits = lastReading.value.value - firstReading.value.value;
      const consumeTime = lastReading.value.time - firstReading.value.time;
      usesPerDay.value = (consumeUnits / consumeTime) * 1000 * 60 * 60 * 24;
    }
    // const readingWatcher = watch(
    //   [lastReading, firstReading],
    //   (
    //     [lastReadingNew, firstReadingNew],
    //     [lastReadingOld, firstReadingOld]
    //   ) => {
    //     const consumeUnits = lastReadingNew.value - firstReadingNew.value;
    //     const consumeTime = lastReadingNew.time - firstReadingNew.time;
    //     usesPerDay.value = (consumeUnits / consumeTime) * 1000 * 60 * 60 * 24;
    //   }
    // );
    calculateUnitForMonth();
    return {
      modelForReadingSet,
      firstReading,
      lastReading,
      currentReading,
      saveReading,
      showAlert,
      moveTo,
      usesPerDay,
      isExpand,
      modelMeterForNewEdit,
      selectedAccount,
    };
  },
  components: { MeterComponent, MeterComponentWithInput, AddMeter },
});
</script>
<style lang="scss" scoped>
@media (max-width: $breakpoint-xs-max) {
  .mobile-full-width {
    width: 100%;
  }
}

.big-rcorners {
  border-radius: 25px;
  border: 2px solid $myred;
  background: $myred;
  padding: 10px;
  width: 100%;
  color: white;
  text-align: center;
}

.medium-rcorners {
  border-radius: 10px;
  border: 2px solid $myred;
  background: $myred;
  padding: 10px;
  width: 100%;
  color: white;
  text-align: center;
}
// https://sharkcoder.com/visual/shapes
.bubble {
  position: relative;
  background: $primary;
  border-radius: 10px;
}
.bubble-top {
  @extend .bubble;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 13px solid transparent;
    border-bottom-color: $primary;
    border-top: 0;
    margin-left: -13px;
    margin-top: -13px;
  }
}

.bubble-bottom {
  @extend .bubble;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 13px solid transparent;
    border-top-color: $primary;
    border-bottom: 0;
    margin-left: -13px;
    margin-bottom: -13px;
  }
}
</style>
