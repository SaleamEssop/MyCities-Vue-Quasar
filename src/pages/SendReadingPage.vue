<template>
  <q-page class="">
    <!-- <q-banner text-color="black" class="bg-primary text-center">
      Enter your water and electicity reading for the last month and curent.
    </q-banner> -->
    <div class="">
      <q-select
        filled
        v-model="accountStore.account"
        :options="accounts"
        emit-value
        map-options
        option-value="id"
        option-label="title"
        label-color="black"
        color="black"
        label="Account"
        behavior="menu"
      />
      <q-list
        bordered
        class="rounded-borders"
        v-for="(groupMeter, index) in filterAndGroupMeters"
        :key="index"
      >
        <q-expansion-item
          expand-separator
          :default-opened="true"
          header-class="bg-primary"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar>
                <img :src="groupMeter.type.thumbnail" />
              </q-avatar>
            </q-item-section>
            <q-item-section> {{ groupMeter.type.title }} </q-item-section>
          </template>

          <div class="row flex-center">
            <MeterReadingSet
              v-for="meter in groupMeter.data"
              :key="meter.id"
              :meter="{ ...meter, account: accountStore.account }"
              class="q-mx-md q-my-md"
            />
          </div>
        </q-expansion-item>
      </q-list>
    </div>
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        label="Add"
        text-color="black"
        @click="moveTo('addMeterPage')"
      />
    </q-page-sticky> -->
  </q-page>
</template>

<script>
export default {
  name: "SendReadingPage",
  inheritAttrs: false,
  customOptions: {},
};
</script>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAccountStore } from "/src/stores/account";
import { useMeterStore } from "/src/stores/meter";
import MeterReadingSet from "src/components/MeterReadingSet.vue";

const router = useRouter();
const meterStore = useMeterStore();
const accountStore = useAccountStore();

const accounts = accountStore.accounts;

const filterAndGroupMeters = computed(() => {
  return Object.values(
    meterStore.allMeters
      .filter((_meter) => {
        return _meter?.account?.id == accountStore.account;
      })
      .reduce((a, o) => {
        const typeId = o?.type?.id;
        (a[typeId] ??= {
          data: [],
          typeId: typeId,
          type: o?.type,
        }).data.push({ ...o });
        return a;
      }, {})
  );
});

function moveTo(path) {
  router.push({ path: path });
}
onMounted(() => {});
</script>
