<template>
  <q-card class="no-shadow" dense>
    <q-card-section class="text-center q-py-none">
      <div class="flex justify-between items-center">
        <span class="text-bold text-h6 text-black"
          >{{ meter?.type.title }} Meter :- {{ meter?.number }}</span
        >

        <!-- <span class="round-cheap">Meter {{ meter?.number }}</span> -->
      </div>

      <div class="flex justify-between items-center">
        <span
          >Last reading,
          <b>{{
            new Date(lastReading.time).toLocaleDateString("en-GB")
          }}</b></span
        >
        <!-- {{ date.formatDate(new Date(lastReading.time), "DD/MM/YYYY") }} -->
        <!-- <span class="round-cheap">Meter {{ meter?.number }}</span> -->
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none text-center">
      <!-- <div class="q-mt-md">
        <div class="flex justify-between items-center wrap">
          Submitted Reading
          <b> {{ new Date(firstReading.time).toLocaleString("en-GB") }}</b>
        </div>
        <MeterComponent
          :text="firstReading.value"
          :meterStyle="meter?.type?.id"
          readingType="submitted-reading"
        />
      </div> -->
      <div class="q-mt-md">
        <div class="flex justify-between items-center wrap">
          <!-- <span>Last saved reading</span>
          <b>{{ new Date(lastReading.time).toLocaleString("en-GB") }}</b> -->
        </div>
        <MeterComponent
          :text="lastReading.valueInString"
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
      <div class="flex justify-between items-center">
        <!-- <span class="round-cheap" clickable v-ripple
          @click="modelForReadingSet_NewReading = true;
          modelForReadingSet = true;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ">Enter
          Reading</span> -->

        <p class="q-mx-md"></p>
        <div>
          <q-btn
            size="0.7rem"
            rounded
            color="primary"
            @click="
              modelForReadingSet_NewReading = true;
              modelForReadingSet = true;
            "
            >Enter Reading</q-btn
          >
          &nbsp;
          <router-link v-if="!property || !property.property_name"
            class="link"
            :to="{ name: 'MeterCost', params: { id: meter.id } }"
          >
            <q-btn size="0.7rem" rounded color="primary">Calculate Cost</q-btn>
          </router-link>
          <router-link  v-if="property && property.property_name"
            class="link"
                :to="{ name: 'MeterCostProperty', params: { id: meter.id } }"
          >
            <q-btn size="0.7rem" rounded color="primary">Calculate Cost</q-btn>
          </router-link>
        </div>
        <!-- <span class="round-cheap" clickable v-ripple @click=" getMeterCost(meter) ">Cost</span> -->
        <q-btn flat size="lg" icon="more_horiz" text-color="primary">
          <q-menu anchor="center middle" self="center middle">
            <q-list style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                v-ripple
                @click="
                  modelForReadingSet_NewReading = true;
                  modelForReadingSet = true;
                "
              >
                <q-item-section>Enter New Reading</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                v-ripple
                @click="
                  modelForReadingSet_NewReading = false;
                  modelForReadingSet = true;
                "
              >
                <q-item-section>Edit last reading</q-item-section>
              </q-item>
              <!-- <q-item clickable v-close-popup>
                <q-item-section>Submit to Municipality</q-item-section>
              </q-item> -->
              <router-link
                class="link"
                :to="{ name: 'MeterCost', params: { id: meter.id } }"
              >
                <q-item v-if="!property || !property.property_name"
                 clickable v-ripple>
                  <q-item-section>Calculate Cost</q-item-section>
                </q-item>
              </router-link>
              <router-link
                v-if="property && property.property_name"
                class="link"
                :to="{ name: 'AccountSummary', params: { id: meter.id } }"
              >
                <q-item clickable v-ripple>
                  <q-item-section>Account Summary</q-item-section>
                </q-item>
              </router-link>
              <router-link
                v-if="property && property.property_name"
                class="link"
                :to="{ name: 'MeterCostProperty', params: { id: meter.id } }"
              >
                <q-item clickable v-ripple>
                  <q-item-section>Calculate Cost</q-item-section>
                </q-item>
              </router-link>

              <!-- :disable="meterLength === 2 ? true : false" -->
              <q-item
                v-if="!property || !property.property_name"
                @click="modelMeterForNewEdit = true"
                clickable
                v-close-popup
              >
                <q-item-section>Add a new meter</q-item-section>
              </q-item>

              <q-item v-if="!property || !property.property_name"
               clickable v-close-popup @click="deleteMeter(meter)">
                <q-item-section>Delete Meter</q-item-section>
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
              <b>Monthly Projected cost</b>
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
        >Set Reading
      </q-btn>
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
      :isNew="modelForReadingSet_NewReading"
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

  <q-dialog
    v-model="modelCostForMeter"
    @hide="modelCostForMeter = false"
    :full-width="true"
    persistent
  >
    <MeterCost
      :meter="meter"
      :meterCostData="meterCostData"
      @close="modelCostForMeter = false"
      @save="modelCostForMeter = false"
      :isNew="true"
    />
  </q-dialog>
</template>
<script>
import { defineComponent, computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { date, Dialog, useQuasar } from "quasar";

import MeterComponent from "./MeterComponent.vue";

import { useMeterStore } from "/src/stores/meter";
import { useReadingStore } from "/src/stores/reading";
import { useAccountStore } from "/src/stores/account";

import MeterComponentWithInput from "./MeterComponentWithInput.vue";
import AddMeter from "./AddMeter.vue";
import MeterCost from "./MeterCost.vue";
import { deleteMainMeter } from "src/boot/axios";
import { getParticularMeterCost } from "boot/axios";
import { updateAllData } from "src/boot/firebase";
import { useSiteStore } from "/src/stores/site";

const { formatDate } = date;
const meterStore = useMeterStore();
const readingStore = useReadingStore();
const accountStore = useAccountStore();
const siteStore = useSiteStore();

const property = computed(() => siteStore.property);

// store = property;

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
    const modelForReadingSet_NewReading = ref(true);

    const modelMeterForNewEdit = ref(false);
    const modelCostForMeter = ref(false);
    const meterLength = computed(() => meterStore.meters.length);

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
    const meterCostData = ref({});
    const isExpand = ref(false);

    const getMeterCost = (meter) => {
      modelCostForMeter.value = true;
    };

    const getSubmitedAndLastReading = () => {
      const data = (readings || []).sort((a, b) => b.time - a.time);
      lastReading.value = data[0] || {};
      firstReading.value =
        data.find(({ isSubmit }) => isSubmit) || data[data.length - 1] || {};
    };

    const updateReadings = () => {
      readings = readingStore.getReadingsByMeterId(props?.meter?.id);
      getSubmitedAndLastReading();
    };

    watch(
      () => readingStore.getReadingsByMeterId(props?.meter?.id),
      (newValue) => {
        readings = newValue;
        getSubmitedAndLastReading();
      },
      { deep: true }
    );
    updateReadings();
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
    const deleteMeter = (meter) => {
      $q.dialog({
        title: "Confirm",
        message:
          "“Are you sure you want to delete this meter? All data will be permanently lost.",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        deleteMainMeter({ meter_id: meter.id }).then((status) => {
          if (status.code == 200) {
            meterStore.deleteMeter(meter);
          }
        });
      });

      // .onOk(() => {
      //   // console.log('>>>> OK')
      //   meterStore.deleteMeter(meter);
      // })
      // .onOk(() => {
      //   // console.log('>>>> second OK catcher')
      //   meterStore.deleteMeter(meter);
      // });
    };

    return {
      modelForReadingSet,
      modelCostForMeter,
      firstReading,
      lastReading,
      currentReading,
      showAlert,
      moveTo,
      usesPerDay,
      isExpand,
      modelMeterForNewEdit,
      selectedAccount,
      deleteMeter,
      meterLength,
      getMeterCost,
      getParticularMeterCost,
      meterCostData,
      property,
    };
  },
  components: { MeterComponent, MeterComponentWithInput, AddMeter, MeterCost },
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
