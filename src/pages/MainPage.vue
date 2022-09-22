<template>
  <q-page v-if="allSites.length > 0">
    <q-list bordered separator>
      <!-- Site -->
      <q-expansion-item
        dense
        group="accordion"
        expand-separator
        :default-opened="true"
        header-class="bg-primary"
        v-if="allSites.length > 0"
        class="q-mt-sm"
      >
        <template v-slot:header>
          <q-item-section class="font-size larger"
            >Location -
            {{ selectedSite?.address || "Select An Location" }}</q-item-section
          >
        </template>
        <!-- clickable v-ripple -->
        <q-item v-for="site in allSites" :key="site.id">
          <q-item-section>
            <!-- <q-item-label>{{ site.title }}</q-item-label> -->
            <q-item-label>{{ site.address }}</q-item-label>
          </q-item-section>

          <q-item-section center side>
            <q-btn
              rounded
              color="primary"
              text-color="black"
              v-if="site == selectedSite"
              @click="selectSite(site)"
              icon="check"
              >Select</q-btn
            >
            <q-btn
              rounded
              color="primary"
              text-color="black"
              v-else
              @click="selectSite(site)"
              >Select</q-btn
            >
          </q-item-section>
        </q-item>
      </q-expansion-item>

      <!-- Site -->

      <!-- Account -->
      <q-expansion-item
        dense
        group="accordion"
        expand-separator
        v-if="selectedSite"
        :default-opened="true"
        v-model="isExpandAccount"
        header-class="bg-primary"
        class="q-mt-sm"
      >
        <template v-slot:header>
          <q-item-section class="font-size larger"
            >Accounts -
            {{ selectedAccount?.number || "Select An Account" }}</q-item-section
          >
        </template>
        <template
          v-for="account in getAccounts(selectedSite.id)"
          :key="account.id"
        >
          <q-item>
            <q-item-section>
              <q-item-label>{{ account.number }}</q-item-label>
              <q-item-label caption>{{ account.title }}</q-item-label>
              <q-item-label caption>{{ account.option }}</q-item-label>
            </q-item-section>

            <q-item-section center side>
              <q-btn
                rounded
                color="primary"
                text-color="black"
                @click="selectAccount(account)"
                v-if="account == selectedAccount"
                icon="check"
                >Select</q-btn
              >
              <q-btn
                rounded
                color="primary"
                text-color="black"
                v-else
                @click="selectAccount(account)"
                >Select</q-btn
              >
              <q-btn flat icon="more_horiz" text-color="primary">
                <q-menu anchor="center middle" self="center middle">
                  <q-list style="min-width: 100px">
                    <q-item
                      clickable
                      v-close-popup
                      @click="
                        selectedAccount = account;
                        modelAccountForNewEdit = true;
                      "
                    >
                      <q-item-section>Edit this account</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section>Delete this account</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="
                        selectedAccount = null;
                        modelAccountForNewEdit = true;
                      "
                    >
                      <q-item-section>Add a new account</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
          <q-separator />
        </template>

        <!-- <q-separator /> -->
        <!-- <q-item class="justify-center">
          <q-btn
            color="primary"
            rounded
            outline
            text-color="black"
            icon="add"
            @click="modelAccountForNewEdit = true"
          >
            Add New Account
          </q-btn>
        </q-item> -->
      </q-expansion-item>
      <!-- Account -->

      <!-- Meter -->
      <q-expansion-item
        dense
        group="accordion"
        expand-separator
        v-if="selectedAccount"
        :default-opened="true"
        v-model="isExpandMeter"
        header-class="bg-primary"
        class="q-mt-sm"
      >
        <template v-slot:header>
          <q-item-section class="font-size larger">Meters</q-item-section>
        </template>
        <!-- {{ accountStore.allAccounts }} -->
        <template
          v-for="meter in getMeters(selectedAccount.id)"
          :key="meter.id"
        >
          <q-item clickable v-ripple class="q-px-none">
            <q-item-section>
              <MeterReadingSet :key="meter.id" :meter="{ ...meter }" />
            </q-item-section>
          </q-item>
          <q-separator color="black" />
        </template>

        <q-item
          class="justify-center"
          v-if="getMeters(selectedAccount.id).length == 0"
        >
          <q-btn
            color="primary"
            rounded
            outline
            text-color="black"
            icon="add"
            @click="modelMeterForNewEdit = true"
          >
            Add New Meters
          </q-btn>
        </q-item>
      </q-expansion-item>
      <!-- Meter -->
    </q-list>
  </q-page>
  <q-page class="flex flex-center" v-if="allSites.length == 0">
    <div class="column">
      <q-btn
        color="primary"
        rounded
        text-color="black"
        @click="modelAccountForNewEdit = true"
      >
        Start
      </q-btn>
      <span class="q-mt-md round-cheap" clickable v-ripple>Help</span>
    </div>
  </q-page>

  <q-dialog
    v-model="modelAccountForNewEdit"
    @hide="modelAccountForNewEdit = false"
    :full-width="true"
    :full-height="true"
    persistent
  >
    <AccountComponent
      :account="selectedAccount"
      @close="modelAccountForNewEdit = false"
      @save="modelAccountForNewEdit = false"
    />
  </q-dialog>

  <q-dialog
    v-model="modelMeterForNewEdit"
    @hide="modelMeterForNewEdit = false"
    :full-width="true"
    :full-height="true"
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
<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";

import { useSiteStore } from "/src/stores/site";
import { useAccountStore } from "/src/stores/account";
import { useMeterStore } from "/src/stores/meter";
import MeterReadingSet from "src/components/MeterReadingSet.vue";
import AccountComponent from "src/components/AccountComponent.vue";
import AddMeter from "src/components/AddMeter.vue";

const siteStore = useSiteStore();
const accountStore = useAccountStore();
const meterStore = useMeterStore();

const allSites = siteStore.allSites;
//const allAccounts = accountStore.allAccounts;
const allMeters = meterStore.allMeters;

const getAccounts = (siteId) => {
  return accountStore.getAccountsById(siteId);
};

const getMeters = (accountId) => {
  return meterStore.getByAccuntId(accountId);
};

const selectedSite = ref();
const selectedAccount = ref();
const selectedMeter = ref();

const isExpandSite = ref(true);
const isExpandAccount = ref(true);
const isExpandMeter = ref(true);

const modelAccountForNewEdit = ref(false);
const modelMeterForNewEdit = ref(false);

const selectSite = (_site) => {
  selectedSite.value = _site;
  selectedAccount.value = null;
  selectedMeter.value = null;

  isExpandAccount.value = true;
};

const selectAccount = (_account) => {
  selectedAccount.value = _account;
  selectedMeter.value = null;

  isExpandMeter.value = true;
};
</script>
<style scoped>
table {
  width: -webkit-fill-available;
}
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
