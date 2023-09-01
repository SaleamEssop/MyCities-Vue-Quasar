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
      <div class="medium-text" style="display: flex">
        <q-icon
          v-if="billDetails?.has_history"
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
          <span class="large-text">{{ billDetails?.cycle }}</span>
          <span class="medium-text"
            >Current Date: {{ billDetails.current_date }}</span
          >
        </div>
        <q-icon
          v-if="billDetails?.has_future"
          @click="next"
          name="arrow_right"
          class="icon-styling"
        />
        <q-icon v-else disabled name="arrow_right" class="icon-styling" />
      </div>
      <span class="large-text" style="font-weight: bold; font-size: 3rem"
        >R
        {{
          numberFormat.numberFormat(billDetails?.total_including_vat || 0)
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
        <p v-if="billDetails.status_code === 422" style="text-align: justify">
          Dear User.
          <br>
          <br>
          Some of your meters readings need to be updated. Go to the individual meters and follow the instructions.
        </p>
        <p v-else>
          {{ billDetails.message }}
        </p>
      </q-banner>
    </div>
  </template>
  <template v-else>
    <!--    Water Meters Start -->
    <q-card flat class="q-ma-sm q-pa-sm water-meter-background">
      <div
        style="flex-direction: column"
        class="flex column items-center"
        aria-label="heading"
      >
        <span class="large-text">Water Meters</span>
      </div>
    </q-card>
    <div v-if="billDetails?.meters?.water_meters.length">
      <div
        style="border: 1px dotted; margin: 20px"
        v-for="waterMeter in billDetails?.meters?.water_meters || []"
        :key="waterMeter.meter_details.id"
      >
        <q-card flat class="q-ma-sm q-pa-sm">
          <div
            style="justify-content: space-between; align-items: center"
            class="flex"
            aria-label="heading"
          >
            <span class="large-text"
              >Meter# {{ waterMeter.meter_details.meter_number }}</span
            >
            <q-btn
              @click="email.mailCost(waterMeter)"
              class="q-mt-sm"
              style="margin-top: 0"
              color="blue-2"
              rounded
              unelevated
              text-color="black"
              size="sm"
              >Email Now</q-btn
            >
          </div>
        </q-card>
        <q-card flat class="q-ma-sm q-pa-sm">
          <q-list bordered separator>
            <q-item class="item-style">
              <q-item-section class="item-styling">Water in</q-item-section>
              <q-item-section class="text-blue-9 medium-text"
                >{{
                  unitFormat.unitFormat(
                    waterMeter.usage.predictive_monthly_usage,
                    waterMeter?.meter_details?.meter_type_id
                  )
                }}
              </q-item-section>
              <q-item-section side class="item-styling"
                >R
                {{
                  numberFormat.numberFormat(
                    waterMeter.data.water_in.predictive.total
                  )
                }}
              </q-item-section>
            </q-item>
            <q-item class="item-style">
              <q-item-section class="item-styling">Water Out</q-item-section>
              <q-item-section side class="item-styling"
                >R
                {{
                  numberFormat.numberFormat(
                    waterMeter.data.water_out.predictive.total
                  )
                }}
              </q-item-section>
            </q-item>
            <q-item
              class="item-style"
              v-for="(waterInAdditionalCost, i1) in waterMeter?.data?.water_in
                ?.predictive?.additional_costs || []"
              :key="i1"
            >
              <q-item-section class="item-styling">{{
                waterInAdditionalCost.title
              }}</q-item-section>
              <q-item-section side class="item-styling"
                >R
                {{
                  numberFormat.numberFormat(waterInAdditionalCost?.cost || 0)
                }}</q-item-section
              >
            </q-item>
            <q-item
              class="item-style"
              v-for="(waterInAdditionalCost, i2) in waterMeter?.data?.water_out
                ?.predictive?.additional_costs || []"
              :key="i2"
            >
              <q-item-section class="item-styling">{{
                waterInAdditionalCost.title
              }}</q-item-section>
              <q-item-section side class="item-styling"
                >R
                {{
                  numberFormat.numberFormat(waterInAdditionalCost?.cost || 0)
                }}</q-item-section
              >
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
    <template v-else>
      <q-card flat class="q-ma-sm q-pa-sm text-center">
        There is no data for water meters
      </q-card>
    </template>
    <!--    Water Meters End -->

    <!--    Electricity Meters Start -->
    <q-card flat class="q-ma-sm q-pa-sm electricity-meter-background">
      <div
        style="flex-direction: column"
        class="flex column items-center"
        aria-label="heading"
      >
        <span class="large-text">Electricity Meters</span>
      </div>
    </q-card>
    <div v-if="billDetails?.meters?.electricity_meters.length">
      <div
        style="border: 1px dotted; margin: 20px"
        v-for="electricityMeter in billDetails?.meters?.electricity_meters ||
        []"
        :key="electricityMeter.meter_details.id"
      >
        <q-card flat class="q-ma-sm q-pa-sm">
          <div
            style="justify-content: space-between"
            class="flex"
            aria-label="heading"
          >
            <span class="large-text"
              >Meter# {{ electricityMeter.meter_details.meter_number }}</span
            >
            <q-btn
              @click="email.mailCost(electricityMeter)"
              class="q-mt-sm"
              style="margin-top: 0"
              color="blue-2"
              rounded
              unelevated
              text-color="black"
              size="sm"
              >Email Now</q-btn
            >
          </div>
        </q-card>
        <q-card flat class="q-ma-sm q-pa-sm">
          <q-list bordered separator>
            <q-item class="item-style">
              <q-item-section class="item-styling">Electricity</q-item-section>
              <q-item-section class="text-blue-9 medium-text"
                >{{
                  unitFormat.unitFormat(
                    electricityMeter.usage.predictive_monthly_usage,
                    electricityMeter?.meter_details?.meter_type_id
                  )
                }}
              </q-item-section>
              <q-item-section side class="item-styling"
                >R
                {{
                  numberFormat.numberFormat(
                    electricityMeter?.data?.predictive || 0
                  )
                }}
              </q-item-section>
            </q-item>
            <q-item
              class="item-style"
              v-for="(electricityAdditionalCost, i2) in electricityMeter?.data
                ?.electricity?.predictive?.additional_costs || []"
              :key="i2"
            >
              <q-item-section class="item-styling">{{
                electricityAdditionalCost.title
              }}</q-item-section>
              <q-item-section side class="item-styling"
                >R
                {{
                  numberFormat.numberFormat(
                    electricityAdditionalCost?.cost || 0
                  )
                }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
    <template v-else>
      <q-card flat class="q-ma-sm q-pa-sm text-center">
        There is no data for electricity meters
      </q-card>
    </template>
    <!--    Electricity Meters End -->

    <!--    Additional Costs Start -->
    <q-card flat class="q-ma-sm q-pa-sm additional-costs-background">
      <div
        style="flex-direction: column"
        class="flex column items-center"
        aria-label="heading"
      >
        <span class="large-text">Additional Costs</span>
      </div>
    </q-card>
    <q-card flat class="q-ma-sm q-pa-sm">
      <q-list bordered separator>
        <template
          v-for="(additionalCost, i3) in billDetails?.additional_costs || []"
          :key="i3"
        >
          <q-item class="item-style" v-if="additionalCost.exempt_vat === 'no'">
            <q-item-section class="item-styling">{{
              additionalCost.name
            }}</q-item-section>
            <q-item-section side class="item-styling"
              >R {{ numberFormat.numberFormat(+additionalCost?.cost || 0) }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-card>
    <q-card flat class="q-ma-sm q-pa-sm">
      <q-list>
        <q-item class="item-style">
          <q-item-section class="item-styling">Subtotal</q-item-section>
          <q-item-section side class="item-styling"
            >R
            {{
              numberFormat.numberFormat(
                +billDetails?.vat_exempted_subtotal || 0
              )
            }}
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
    </q-card>
    <q-card flat class="q-ma-sm q-pa-sm">
      <q-list bordered>
        <q-item class="item-style">
          <q-item-section class="item-styling">VAT</q-item-section>
          <q-item-section side class="item-styling"
            >R
            {{
              numberFormat.numberFormat(+billDetails?.vat || 0)
            }}</q-item-section
          >
        </q-item>
        <template
          v-for="(additionalCost, i3) in billDetails?.additional_costs || []"
          :key="i3"
        >
          <q-item class="item-style" v-if="additionalCost.exempt_vat === 'yes'">
            <q-item-section class="item-styling">{{
              additionalCost.name
            }}</q-item-section>
            <q-item-section side class="item-styling"
              >R {{ numberFormat.numberFormat(+additionalCost?.cost || 0) }}
            </q-item-section>
          </q-item>
        </template>
        <q-item class="item-style">
          <q-item-section class="item-styling"
            >Total Including VAT</q-item-section
          >
          <q-item-section side class="item-styling"
            >R
            {{
              numberFormat.numberFormat(+billDetails?.total_including_vat || 0)
            }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <!--    Additional Costs End -->
    <q-card flat class="bg-grey-4 q-ma-sm q-pa-sm">
      <div
        style="flex-direction: column"
        class="flex column items-center"
        aria-label="heading"
      >
        <span class="large-text">Total</span>
        <span class="large-text"
          >R
          {{
            numberFormat.numberFormat(billDetails?.total_including_vat || 0)
          }}</span
        >
      </div>
    </q-card>

    <!--    Just for bottom space -->
    <q-card flat class="bg-white q-ma-sm q-pa-sm" style="padding-bottom: 40px">
      <q-banner dense inline-actions class="text-white bg-red">
        Note: The amount is calculated based on your inputs and may differ
        slightly from your actual municipal bill.
      </q-banner>
    </q-card>
  </template>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watchEffect } from "vue";
import { getFullBill } from "src/api/meters";
import { useNumberFormat } from "src/composable/useNumberFormat";
import { useUnitFormat } from "src/composable/useUnitFormat";
import { useEmail } from "src/composable/useEmailer";
import {useQuasar} from "quasar";

const email = useEmail();
const route = useRoute();
const router = useRouter();
const numberFormat = useNumberFormat();
const unitFormat = useUnitFormat();
const billDetails = ref({});
const hasError = ref(false);
const currentMonth = ref( 1);
const $q = useQuasar();


async function previous() {
  if (billDetails.value?.has_history) {
    currentMonth.value += billDetails.value?.add_previous_months || 1;
    await getCostDetails();
  }
}

async function next() {
  if (billDetails.value?.has_future) {
    currentMonth.value--;
    await getCostDetails();
  }
}

async function getCostDetails() {
  $q.loading.show();
  try {
    billDetails.value = await getFullBill(route.params.id, currentMonth.value);
    hasError.value = false;
  } catch (e) {
    hasError.value = true;
    billDetails.value = e.response.data;
  }
  $q.loading.hide();
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
  font-size: 1.1rem;
  font-weight: 500;
}

.icon-styling {
  cursor: pointer;
  font-size: 4rem;
  font-weight: 700;
}

.water-meter-background {
  /* For white font */
  color: #ffffff;
  background: #61a402;
}

.electricity-meter-background {
  color: #ffffff;
  background: #61a402;
}

.additional-costs-background {
  color: #ffffff;
  background: #61a402;
}
</style>
