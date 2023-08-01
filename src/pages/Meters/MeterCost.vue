<template>
  <q-header elevated class="containerWidth new-meter-heading breadcrumbs">
    <q-toolbar>
      <q-btn @click="$router.back()" flat dense round icon="arrow_back" text-color="white"/>
      <q-toolbar-title class="text-white">
        {{ route.meta.title }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-card flat class="bg-grey-4 q-ma-sm q-pa-sm">
    <div style="flex-direction: column" class="flex column items-center" aria-label="heading">
      <span class="large-text">Meter# {{ costDetails?.meter_details?.meter_number }}</span>
      <div class="medium-text">
        <q-icon v-if="costDetails?.has_history" @click="previous" name="arrow_left" class="icon-styling"/>
        <q-icon disabled v-else name="arrow_left" class="icon-styling"/>
        <span>
          Projected bill for {{ costDetails?.month }}
        </span>
        <q-icon v-if="currentMonth > 1" @click="next" name="arrow_right" class="icon-styling"/>
        <q-icon v-else disabled name="arrow_right" class="icon-styling"/>
      </div>
      <span class="medium-text">{{ costDetails?.cycle }}</span>
      <span class="medium-text">Today is {{ costDetails.current_date }}</span>
    </div>
  </q-card>
  <template v-if="hasError">
    <div class="q-ma-sm q-pa-sm" style="display: flex;justify-content: center;align-items: center;min-height: 300px">
      <q-banner dense inline-actions class="text-white bg-red">
        {{costDetails.message}}
      </q-banner>
    </div>
  </template>
  <template v-else>
    <q-card v-if="costDetails?.meter_details?.meter_type_id === WATER_METER" flat class="q-ma-sm q-pa-sm">
      <div class="row flex justify-between items-center">
        <div class="column col-3">
          <b class="text-center">Daily Usage</b>
          <div class="text-center basic-text">
            {{ unitFormat.klToLitters(costDetails?.usage?.average_usage || 0) }}
          </div>
        </div>
        <q-separator vertical/>
        <div class="column col-3">
          <b class="text-center">Monthly Usage</b>
          <div class="text-center basic-text">
            {{unitFormat.unitFormat(costDetails?.usage?.predictive_monthly_usage || 0, costDetails?.meter_details?.meter_type_id) }}
          </div>
        </div>
        <q-separator vertical/>
        <div class="column col-3">
          <b class="text-center">Daily Cost</b>
          <div class="basic-text text-center">
            R {{ numberFormat.numberFormat(costDetails?.data?.daily_predictive_cost || 0) }}
          </div>
        </div>
      </div>
      <q-separator class="q-mt-lg"/>
    </q-card>
    <q-card v-else-if="costDetails?.meter_details?.meter_type_id === ELECTRICITY_METER" flat class="q-ma-sm q-pa-sm">
      <div class="row flex justify-between items-center">
        <div class="column col-3">
          <b class="text-center">Daily Usage</b>
          <div class="text-center basic-text">
            {{unitFormat.unitFormat(costDetails?.usage?.average_usage || 0, costDetails?.meter_details?.meter_type_id) }}
          </div>
        </div>
        <q-separator vertical/>
        <div class="column col-3">
          <b class="text-center">Monthly Usage</b>
          <div class="text-center basic-text">
            {{unitFormat.unitFormat(costDetails?.usage?.predictive_monthly_usage || 0, costDetails?.meter_details?.meter_type_id) }}
          </div>
        </div>
        <q-separator vertical/>
        <div class="column col-3">
          <b class="text-center">Daily Cost</b>
          <div class="basic-text text-center">
            R {{ numberFormat.numberFormat(costDetails?.data?.daily_predictive_cost || 0) }}
          </div>
        </div>
      </div>
      <q-separator class="q-mt-lg"/>
    </q-card>
    <q-card v-if="costDetails?.meter_details?.meter_type_id === WATER_METER" flat class="q-ma-sm q-pa-sm">
      <q-list bordered separator>
        <q-item class="item-style">
          <q-item-section>Water in</q-item-section>
          <q-item-section side>R {{
              numberFormat.numberFormat(costDetails?.data?.water_in?.predictive.total || 0)
            }}
          </q-item-section>
        </q-item>
        <q-item class="item-style">
          <q-item-section>Water out</q-item-section>
          <q-item-section side>R {{
              numberFormat.numberFormat(costDetails?.data?.water_out?.predictive.total || 0)
            }}
          </q-item-section>
        </q-item>
        <q-item class="item-style"
                v-for="(waterInAdditionalCost,i1) in costDetails?.data?.water_in?.predictive?.additional_costs || []"
                :key="i1">
          <q-item-section>{{ waterInAdditionalCost.title }}</q-item-section>
          <q-item-section side>R {{ numberFormat.numberFormat(waterInAdditionalCost?.cost || 0) }}</q-item-section>
        </q-item>
        <q-item class="item-style"
                v-for="(waterInAdditionalCost,i2) in costDetails?.data?.water_out?.predictive?.additional_costs || []"
                :key="i2">
          <q-item-section>{{ waterInAdditionalCost.title }}</q-item-section>
          <q-item-section side>R {{ numberFormat.numberFormat(waterInAdditionalCost?.cost || 0) }}</q-item-section>
        </q-item>
        <q-item class="item-style">
          <q-item-section>VAT</q-item-section>
          <q-item-section side>R {{ numberFormat.numberFormat( costDetails?.data?.vat_predictive || 0) }}</q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-card v-else-if="costDetails?.meter_details?.meter_type_id === ELECTRICITY_METER" flat class="q-ma-sm q-pa-sm">
      <q-list bordered separator>
        <q-item class="item-style"
                v-for="(waterInAdditionalCost,i2) in costDetails?.data?.electricity?.predictive?.additional_costs || []"
                :key="i2">
          <q-item-section>{{ waterInAdditionalCost.title }}</q-item-section>
          <q-item-section side>R {{ numberFormat.numberFormat(waterInAdditionalCost?.cost || 0) }}</q-item-section>
        </q-item>
<!--        <q-item class="item-style">-->
<!--          <q-item-section>VAT</q-item-section>-->
<!--          <q-item-section side>R {{ numberFormat.numberFormat( costDetails?.data?.vat_predictive || 0) }}</q-item-section>-->
<!--        </q-item>-->
      </q-list>
    </q-card>
    <q-card flat class="bg-grey-4 q-ma-sm q-pa-sm">
      <div style="flex-direction: column" class="flex column items-center" aria-label="heading">
        <span class="large-text">Monthly Projected Cost</span>
        <span class="large-text">R {{ numberFormat.numberFormat(costDetails?.data?.predictive || 0) }}</span>
      </div>
    </q-card>
    <q-card flat class="q-ma-sm q-pa-sm">
<!--      <div style="flex-direction: column" class="flex column items-center" aria-label="heading">-->
<!--        <span class="large-text">Dated: {{ costDetails?.current_date }}</span>-->
<!--        <span class="large-text">Reading: {{ costDetails?.usage?.reading }}</span>-->
<!--      </div>-->
      <div class="flex column items-center q-pt-lg" aria-label="heading">
        <q-btn color="primary" style="width: 100%">Email Details</q-btn>
      </div>
    </q-card>
  </template>

</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, watchEffect} from "vue";
import {getCost} from "src/api/meters";
import {useNumberFormat} from "src/composable/useNumberFormat";
import {useUnitFormat} from "src/composable/useUnitFormat";
import {ELECTRICITY_METER, WATER_METER} from "src/config/meter";

const route = useRoute();
const router = useRouter();
const numberFormat = useNumberFormat();
const unitFormat = useUnitFormat();
const costDetails = ref({});
const hasError = ref(false);
let month = route.query.month;
if (month < 0){
  router.replace({...route, query: {...route.query, month: 1}})
}
const currentMonth = ref(route.query.month || 1);

watchEffect(async () => {
  currentMonth.value = route.query.month || 1;
  await getCostDetails();
});


function previous() {
  if (costDetails.value?.has_history) {
    currentMonth.value++;
    router.push({...route, query: {...route.query, month: currentMonth.value}})
  }
}

function next() {
  currentMonth.value--;
  router.push({...route, query: {...route.query, month: currentMonth.value}})
}

async function getCostDetails() {
  try {
    costDetails.value = await getCost(route.params.id, currentMonth.value);
    hasError.value = false;
  }catch (e){

    hasError.value = true;
    costDetails.value = e.response.data
  }


}

onMounted(() => {
  getCostDetails().then()
})
</script>
<style lang="scss" scoped>

.item-style {
  padding: 6px 12px;
  min-height: 20px
}

.basic-text {
  font-size: 1rem;
}

.medium-text {
  font-size: 1rem;
  font-weight: 400
}

.large-text {
  font-size: 1.2rem;
  font-weight: 500
}

.icon-styling {
  cursor: pointer;
  font-size: 2.5rem;
  font-weight: 700
}
</style>
