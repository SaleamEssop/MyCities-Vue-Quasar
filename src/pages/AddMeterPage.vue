<template>
  <q-card class="mobile-full-width">
    <q-card-section class="column q-col-gutter-md" :horizontal="false">
      <q-select
        filled
        v-model="meter.account.id"
        :options="accountStore.allAccounts"
        emit-value
        map-options
        option-value="id"
        option-label="title"
        label-color="black"
        color="black"
        behavior="menu"
        label="Account"
      />

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
      <!-- <q-select
        filled
        v-model="meter.type.id"
        :options="$METER_TYPES"
        emit-value
        map-options
        option-value="id"
        option-label="title"
        behavior="menu"
        label-color="black"
        color="black"
        label="Meter Type"
      /> -->
      <q-input
        color="black"
        type="text"
        min="0"
        outlined
        v-model.trim="meter.title"
        label="Meter Title"
      />
      <q-input
        color="black"
        type="number"
        min="0"
        outlined
        v-model.number="meter.number"
        label="Meter Number"
      />

      <q-input filled v-model="readingDate" mask="date" :rules="['date']">
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
      </q-input>

      <q-input
        color="black"
        type="number"
        min="0"
        outlined
        v-model.number="firstReading.value"
        label="First Reading"
      />
      <q-btn
        color="primary"
        text-color="black"
        class="q-mt-md"
        @click="addMeter"
        >Save</q-btn
      >
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { date } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useAccountStore } from "/src/stores/account";
import { useMeterStore } from "/src/stores/meter";
const router = useRouter();
const route = useRoute();

const readingDate = computed({
  get() {
    return date.formatDate(new Date(firstReading.value.time), "YYYY/MM/DD");
  },
  set(newValue) {
    console.log(new Date(date.formatDate(newValue, "YYYY/MM/DD")).getTime());
    firstReading.value.time = new Date(
      date.formatDate(newValue, "YYYY/MM/DD")
    ).getTime();
  },
});

const firstReading = ref({
  isSubmit: true,
  time: Date.now(),
  value: 0,
});

const accountStore = useAccountStore();
const meterStore = useMeterStore();

const meter = ref({
  id: Date.now(),
  title: "",
  number: 0,
  type: { id: 1 },
  readings: { sort: 1, data: [] },
  account: { id: parseInt(route.query.accountId) },
});

const addMeter = () => {
  meter.value.readings.data.push(firstReading.value);
  meterStore.addMeter(meter.value);
  router.back();
};
</script>
