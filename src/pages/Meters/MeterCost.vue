<template>
  <q-header elevated class="containerWidth new-meter-heading breadcrumbs">
    <q-toolbar>
      <q-btn
        @click="$router.back()"
        flat
        dense
        round
        icon="arrow_back"
        text-color="white"
      />
      <q-toolbar-title class="text-white">
        {{ route.meta.title }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-card flat class="bg-grey-4 q-ma-sm q-pa-sm">
    <div
      style="flex-direction: column"
      class="flex column items-center"
      aria-label="heading"
    >
      <span class="medium-text"
        >Projected Cost: Meter#
        {{ costDetails?.meter_details?.meter_number }}</span
      >
      <div class="large-text" style="display: flex">
        <q-icon
          v-if="costDetails?.has_history"
          @click="previous"
          name="arrow_left"
          class="icon-styling"
        />
        <q-icon disabled v-else name="arrow_left" class="icon-styling" />
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          "
        >
          <span class="large-text">{{ costDetails?.cycle }}</span>
          <span class="medium-text"
            >Current Date: {{ costDetails.current_date }}</span
          >
        </div>
        <!--        <span>-->
        <!--          Projected bill for {{ costDetails?.month }}-->
        <!--        </span>-->
        <q-icon
          v-if="currentMonth > 1"
          @click="next"
          name="arrow_right"
          class="icon-styling"
        />
        <q-icon v-else disabled name="arrow_right" class="icon-styling" />
      </div>
      <span style="font-size: 3rem; font-weight: bold"
        >R
        {{
          numberFormat.numberFormat(costDetails?.data?.predictive || 0)
        }}</span
      >
    </div>
  </q-card>
  <template v-if="hasError">
    <div
      class="q-ma-sm q-pa-sm"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
      "
    >
      <q-banner dense inline-actions class="bg-grey-4">
        <p v-if="costDetails.status_code === 422" style="text-align: justify">
          Dear User.
          <br>
          <br>
          You have either entered your first reading for this meter or, no usable previous readings exist.
          <br>
          <br>

          No problem. Just enter an additional reading in the next fews days to enable us to calculate your usage.
          <br>
          <br>
          We need at least two readings in the same billing cycle to calculate usage and cost.
        </p>
        <p v-else>
          {{ costDetails.message }}
        </p>
      </q-banner>
    </div>
  </template>
  <template v-else>
    <q-card
      v-if="costDetails?.meter_details?.meter_type_id === WATER_METER"
      flat
      class="q-ma-sm q-pa-sm"
    >
      <div class="row flex justify-between items-center">
        <div class="column col-3">
          <b class="text-center bold-text">Daily Usage</b>
          <div class="text-center large-text bold-text">
            {{ unitFormat.klToLitters(costDetails?.usage?.average_usage || 0) }}
          </div>
        </div>
        <q-separator vertical />
        <div class="column col-3">
          <b class="text-center bold-text">Monthly Usage</b>
          <div class="text-center large-text bold-text">
            {{
              unitFormat.unitFormat(
                costDetails?.usage?.predictive_monthly_usage || 0,
                costDetails?.meter_details?.meter_type_id
              )
            }}
          </div>
        </div>
        <q-separator vertical />
        <div class="column col-3">
          <b class="text-center bold-text">Daily Cost</b>
          <div class="text-center large-text bold-text">
            R
            {{
              numberFormat.numberFormat(
                costDetails?.data?.daily_predictive_cost || 0
              )
            }}
          </div>
        </div>
      </div>
      <q-separator class="q-mt-lg" />
    </q-card>
    <q-card
      v-else-if="
        costDetails?.meter_details?.meter_type_id === ELECTRICITY_METER
      "
      flat
      class="q-ma-sm q-pa-sm"
    >
      <div class="row flex justify-between items-center">
        <div class="column col-3">
          <b class="text-center">Daily Usage</b>
          <div class="text-center basic-text">
            {{
              unitFormat.unitFormat(
                costDetails?.usage?.average_usage || 0,
                costDetails?.meter_details?.meter_type_id
              )
            }}
          </div>
        </div>
        <q-separator vertical />
        <div class="column col-3">
          <b class="text-center">Monthly Usage</b>
          <div class="text-center basic-text">
            {{
              unitFormat.unitFormat(
                costDetails?.usage?.predictive_monthly_usage || 0,
                costDetails?.meter_details?.meter_type_id
              )
            }}
          </div>
        </div>
        <q-separator vertical />
        <div class="column col-3">
          <b class="text-center">Daily Cost</b>
          <div class="basic-text text-center">
            R
            {{
              numberFormat.numberFormat(
                costDetails?.data?.daily_predictive_cost || 0
              )
            }}
          </div>
        </div>
      </div>
      <q-separator class="q-mt-lg" />
    </q-card>
    <q-card
      v-if="costDetails?.meter_details?.meter_type_id === WATER_METER"
      flat
      class="q-ma-sm q-pa-sm"
    >
      <q-list bordered separator>
        <q-item class="item-style">
          <q-item-section class="item-styling">Water in</q-item-section>
          <q-item-section side class="item-styling"
            >R
            {{
              numberFormat.numberFormat(
                costDetails?.data?.water_in?.predictive.total || 0
              )
            }}
          </q-item-section>
        </q-item>
        <q-item class="item-style">
          <q-item-section class="item-styling">Water out</q-item-section>
          <q-item-section side class="item-styling"
            >R
            {{
              numberFormat.numberFormat(
                costDetails?.data?.water_out?.predictive.total || 0
              )
            }}
          </q-item-section>
        </q-item>
        <q-item
          class="item-style"
          v-for="(waterInAdditionalCost, i1) in costDetails?.data?.water_in
            ?.predictive?.additional_costs || []"
          :key="i1"
        >
          <q-item-section class="item-styling">{{
            waterInAdditionalCost.title
          }}</q-item-section>
          <q-item-section side class="item-styling"
            >R {{ numberFormat.numberFormat(waterInAdditionalCost?.cost || 0) }}
          </q-item-section>
        </q-item>
        <q-item
          class="item-style"
          v-for="(waterInAdditionalCost, i2) in costDetails?.data?.water_out
            ?.predictive?.additional_costs || []"
          :key="i2"
        >
          <q-item-section class="item-styling">{{
            waterInAdditionalCost.title
          }}</q-item-section>
          <q-item-section side class="item-styling"
            >R {{ numberFormat.numberFormat(waterInAdditionalCost?.cost || 0) }}
          </q-item-section>
        </q-item>
        <q-item class="item-style">
          <q-item-section class="item-styling">VAT</q-item-section>
          <q-item-section side class="item-styling"
            >R
            {{
              numberFormat.numberFormat(costDetails?.data?.vat_predictive || 0)
            }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-card
      v-else-if="
        costDetails?.meter_details?.meter_type_id === ELECTRICITY_METER
      "
      flat
      class="q-ma-sm q-pa-sm"
    >
      <q-list bordered separator>
        <q-item
          class="item-style"
          v-for="(electricityAdditionalCost, i2) in costDetails?.data
            ?.electricity?.predictive?.additional_costs || []"
          :key="i2"
        >
          <q-item-section class="item-styling">{{
            electricityAdditionalCost.title
          }}</q-item-section>
          <q-item-section side class="item-styling"
            >R
            {{
              numberFormat.numberFormat(electricityAdditionalCost?.cost || 0)
            }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-card flat class="bg-grey-4 q-ma-sm q-pa-sm">
      <div
        style="flex-direction: column"
        class="flex column items-center"
        aria-label="heading"
      >
        <span class="large-text">Monthly Projected Cost</span>
        <span class="large-text"
          >R
          {{
            numberFormat.numberFormat(costDetails?.data?.predictive || 0)
          }}</span
        >
      </div>
    </q-card>
    <q-card flat class="q-ma-sm q-pa-sm">
      <!--      <div style="flex-direction: column" class="flex column items-center" aria-label="heading">-->
      <!--        <span class="large-text">Dated: {{ costDetails?.current_date }}</span>-->
      <!--        <span class="large-text">Reading: {{ costDetails?.usage?.reading }}</span>-->
      <!--      </div>-->
      <div class="flex column items-center q-pt-lg" aria-label="heading">
        <q-btn
          color="primary"
          style="width: 100%"
          @click="email.mailCost(costDetails)"
          >Email Details</q-btn
        >
      </div>
    </q-card>
  </template>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watchEffect } from "vue";
import { getCost } from "src/api/meters";
import { useNumberFormat } from "src/composable/useNumberFormat";
import { useUnitFormat } from "src/composable/useUnitFormat";
import { ELECTRICITY_METER, WATER_METER } from "src/config/meter";
import { useEmail } from "src/composable/useEmailer";
const route = useRoute();
const router = useRouter();
const numberFormat = useNumberFormat();
const unitFormat = useUnitFormat();
const costDetails = ref({});
const hasError = ref(false);
const email = useEmail();
const currentMonth = ref(1);

async function previous() {
  if (costDetails.value?.has_history) {
    currentMonth.value++;
    await getCostDetails();
  }
}

async function next() {
  currentMonth.value--;
  await getCostDetails();
}

async function getCostDetails() {
  try {
    costDetails.value = await getCost(route.params.id, currentMonth.value);
    hasError.value = false;
  } catch (e) {
    hasError.value = true;
    costDetails.value = e.response.data;
  }
}

onMounted(() => {
  getCostDetails().then();
});
</script>
<style lang="scss" scoped>
.item-style {
  padding: 6px 12px;
  min-height: 20px;
}

.basic-text {
  font-size: 1rem;
}

.medium-text {
  font-size: 1rem;
  font-weight: 400;
}

.large-text {
  font-size: 1.2rem;
  font-weight: 500;
}
.bold-text {
  font-weight: bold;
}

.icon-styling {
  cursor: pointer;
  font-size: 4rem;
  font-weight: 700;
}
</style>
