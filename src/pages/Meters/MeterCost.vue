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
      <span style="font-size: 1.2rem;font-weight: 500">Meter# 14232</span>
      <div style="font-size: 1rem;font-weight: 400">
        <q-icon name="arrow_left" style="font-size: 2.5rem;font-weight: 700"/>
        <span>
          Projected bill for Aug 2023
        </span>
        <q-icon name="arrow_right" style="font-size: 2.5rem;font-weight: 700"/>
      </div>
      <span style="font-size: 1rem;font-weight: 400">15 July to 15 August</span>
      <span style="font-size: 1rem;font-weight: 400">Today is 20th Jul '23</span>
    </div>
  </q-card>
  <q-card flat class="q-ma-sm q-pa-sm">
    <div class="row flex justify-between items-center">
      <div class="column col-3">
        <b class="text-center">Daily Usage</b>
        <div style="font-size: 1rem" class="text-center">
          {{ unitFormat.unitFormat(3) }}
        </div>
        <div style="font-size: 1rem" class="text-center">
          {{ unitFormat.klToLitters(3) }}
        </div>
      </div>
      <q-separator vertical/>
      <div class="column col-3">
        <b class="text-center">Monthly Usage</b>
        <div style="font-size: 1rem" class="text-center">
          {{ unitFormat.unitFormat(30) }}
        </div>
        <div style="font-size: 1rem" class="text-center">
          {{ unitFormat.klToLitters(30) }}
        </div>
      </div>
      <q-separator vertical/>
      <div class="column col-3">
        <b class="text-center">Daily Cost</b>
        <div style="font-size: 1rem;margin-bottom: 22px" class="text-center">
         R {{ numberFormat.numberFormat(232) }}
        </div>
      </div>
    </div>
    <q-separator class="q-mt-lg"/>
  </q-card>
  <q-card flat class="q-ma-sm q-pa-sm">
    <q-list bordered separator>
      <q-item style="padding: 6px 12px;min-height: 20px">
        <q-item-section>Water in </q-item-section>
        <q-item-section side>R {{ numberFormat.numberFormat(606.84) }}</q-item-section>
      </q-item>
      <q-item style="padding: 6px 12px;min-height: 20px">
        <q-item-section>Water out </q-item-section>
        <q-item-section side>R {{ numberFormat.numberFormat(103.79) }}</q-item-section>
      </q-item>
      <q-item style="padding: 6px 12px;min-height: 20px">
        <q-item-section>Infrastructure Levy</q-item-section>
        <q-item-section side>R {{ numberFormat.numberFormat(29.60) }}</q-item-section>
      </q-item>
      <q-item style="padding: 6px 12px;min-height: 20px">
        <q-item-section>Sewerage </q-item-section>
        <q-item-section side>R {{ numberFormat.numberFormat(29.60) }}</q-item-section>
      </q-item>
      <q-item style="padding: 6px 12px;min-height: 20px">
        <q-item-section>Water loss levy</q-item-section>
        <q-item-section side>R {{ numberFormat.numberFormat(14.76) }}</q-item-section>
      </q-item>
      <q-item style="padding: 6px 12px;min-height: 20px">
        <q-item-section>VAT</q-item-section>
        <q-item-section side>R {{ numberFormat.numberFormat(117.69) }}</q-item-section>
      </q-item>
    </q-list>
  </q-card>
  <q-card flat class="bg-grey-4 q-ma-sm q-pa-sm">
    <div style="flex-direction: column" class="flex column items-center" aria-label="heading">
      <span style="font-size: 1.2rem;font-weight: 500">Monthly Projected Cost</span>
      <span style="font-size: 1.2rem;font-weight: 500">R {{ numberFormat.numberFormat(1902.28) }}</span>
    </div>
  </q-card>
  <q-card flat class="q-ma-sm q-pa-sm">
    <div style="flex-direction: column" class="flex column items-center" aria-label="heading">
      <span style="font-size: 1.2rem;font-weight: 500">Dated: 20th July 2023</span>
      <span style="font-size: 1.2rem;font-weight: 500">Reading: 0050</span>
    </div>
    <div class="flex column items-center q-pt-lg" aria-label="heading">
      <q-btn color="primary" style="width: 100%">Email Details</q-btn>
    </div>
  </q-card>
</template>

<script setup>
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import {getCost} from "src/api/meters";
import {useNumberFormat} from "src/composable/useNumberFormat";
import {useUnitFormat} from "src/composable/useUnitFormat";

const route = useRoute();
const numberFormat = useNumberFormat();
const unitFormat = useUnitFormat();
onMounted(() => {
  getCost(route.query.id)
})
</script>
