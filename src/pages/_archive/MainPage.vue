<template>
  <q-page v-if="allSites.length > 0">
    <!-- Billing Toggle (Admin/Testing) -->
    <BillingToggle class="q-mt-md" />
    
    <!-- Backend Billing Test Panel -->
    <q-card class="q-ma-md bg-grey-1">
      <q-card-section class="row items-center justify-between">
        <div class="text-subtitle2">Backend Billing Test</div>
        <div class="text-caption text-grey-7">
          Account: {{ accountStore.selectedAccount?.number || "Select an account" }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-auto">
            <ButtonPrimary
              label="Fetch Estimate"
              :disable="!accountStore.selectedAccount || testLoading"
              :loading="testLoading"
              @click="fetchBackendBill('estimate')"
            />
          </div>
          <div class="col-auto">
            <ButtonPrimary
              label="Finalize (persist)"
              color="secondary"
              text-color="black"
              :disable="!accountStore.selectedAccount || testLoading"
              :loading="testLoading"
              @click="fetchBackendBill('finalize')"
            />
          </div>
          <div class="col q-gutter-sm">
            <q-badge v-if="testResult?.status" color="blue">{{ testResult.status }}</q-badge>
            <span v-if="testError" class="text-negative">{{ testError }}</span>
          </div>
        </div>
        <div v-if="testResult" class="q-mt-md">
          <div class="text-caption">Result (totals):</div>
          <pre class="q-pa-sm bg-white q-mt-xs" style="max-height:200px; overflow:auto;">
{{ {
  subtotal: testResult?.totals?.subtotal,
  vat: testResult?.totals?.vat,
  total: testResult?.totals?.total,
  per_meter: (testResult?.per_meter || []).map(p => ({
    meter_id: p.meter_id,
    title: p.title,
    value: p.value,
    closing_type: p.closing_type,
    provisional: p.provisional
  }))
} }}
          </pre>
        </div>
      </q-card-section>
    </q-card>

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
            {{
              siteStore.selectedSite?.address || "Select A Location"
            }}</q-item-section
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
              v-if="site == siteStore.selectedSite"
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
        v-if="siteStore.selectedSite"
        :default-opened="true"
        v-model="isExpandAccount"
        header-class="bg-primary"
        class="q-mt-sm"
      >
        <template v-slot:header>
          <q-item-section class="font-size larger"
            >Accounts -
            {{
              accountStore.selectedAccount?.number || "Select An Account"
            }}</q-item-section
          >
        </template>

        <template
          v-for="account in getAccounts(siteStore.selectedSite.id)"
          :key="account.id"
        >
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">{{ account.number }}</q-item-label>
              <q-item-label>{{ account.title }}</q-item-label>
              <q-item-label>{{ account.option }}</q-item-label>
            </q-item-section>

            <q-item-section center side>
              <q-btn
                rounded
                color="primary"
                text-color="black"
                @click="selectAccount(account), Loading()"
                v-if="account == accountStore.selectedAccount"
                icon="check"
                >Select</q-btn
              >
              <q-btn
                rounded
                color="primary"
                text-color="black"
                v-else
                @click="selectAccount(account), Loading()"
                >Select</q-btn
              >
              <q-btn flat size="lg" icon="more_horiz" text-color="primary">
                <q-menu anchor="center middle" self="center middle">
                  <q-list style="min-width: 100px">
                    <q-item
                      clickable
                      v-close-popup
                      @click="
                        accountStore.selectedAccount = account;
                        modelAccountForFullBill = true;
                      "
                    >
                      <q-item-section>Full Bill</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="
                        accountStore.selectedAccount = account;
                        modelAccountForHistory = true;
                      "
                    >
                      <q-item-section>History</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      @click="
                        accountStore.selectedAccount = account;
                        modelAccountForNewEdit = true;
                      "
                    >
                      <q-item-section>Edit Account</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="deleteAccount(account)"
                    >
                      <q-item-section>Delete Account</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="
                        accountStore.selectedAccount = null;
                        modelAccountForNewEdit = true;
                      "
                    >
                      <q-item-section>Add Account</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
          <q-separator />
        </template>

        <q-separator />

        <q-item
          class="justify-center"
          v-if="getAccounts(siteStore.selectedSite.id).length == 0"
        >
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
        </q-item>
      </q-expansion-item>
      <!-- Account -->

      <!-- Meter -->
      <q-expansion-item
        dense
        group="accordion"
        expand-separator
        v-if="accountStore.selectedAccount"
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
          v-for="meter in getMeters(accountStore.selectedAccount?.id)"
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
          v-if="getMeters(accountStore.selectedAccount?.id).length == 0"
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
      <!-- <span class="q-mt-md round-cheap" clickable v-ripple>Help</?span> -->
    </div>
  </q-page>

  <q-dialog
    v-model="modelAccountForHistory"
    @hide="modelAccountForHistory = false"
    :full-width="true"
    :full-height="false"
  >
    <AccountHistory
      :account="accountStore.selectedAccount"
      @close="modelAccountForHistory = false"
      @save="modelAccountForHistory = false"
    />
  </q-dialog>

  <q-dialog
    v-model="modelAccountForFullBill"
    @hide="modelAccountForFullBill = false"
    :full-width="true"
    :full-height="false"
  >
    <AccountCost
      :account="accountStore.selectedAccount"
      @close="modelAccountForFullBill = false"
      @save="modelAccountForFullBill = false"
    />
  </q-dialog>

  <q-dialog
    v-model="modelAccountForNewEdit"
    @hide="modelAccountForNewEdit = false"
    :full-width="true"
    :full-height="true"
    persistent
  >
    <AccountComponent
      :account="accountStore.selectedAccount"
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
      :propsAccount="accountStore.selectedAccount"
      @close="modelMeterForNewEdit = false"
      @save="modelMeterForNewEdit = false"
    />
  </q-dialog>
</template>
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
} from "vue";
import { useRouter } from "vue-router";

import { useSiteStore } from "/src/stores/site";
import { useAccountStore } from "/src/stores/account";
import { useMeterStore } from "/src/stores/meter";
import { useUserStore } from "/src/stores/user";

import MeterReadingSet from "src/components/MeterReadingSet.vue";
import AccountComponent from "src/components/AccountComponent.vue";
import AddMeter from "src/components/AddMeter.vue";
import AccountCost from "src/components/AccountCost.vue";
import AccountHistory from "src/components/AccountHistory.vue";
import BillingToggle from "src/components/BillingToggle.vue";
import { fetchAndSaveMeterOnAccount, deleteMainAccount } from "src/boot/axios";
import billingApi from "src/services/billingApi";

import { date, Dialog, useQuasar } from "quasar";

const siteStore = useSiteStore();
const accountStore = useAccountStore();
const meterStore = useMeterStore();
const userStore = useUserStore();
const $q = useQuasar();

const allSites = siteStore.allSites;
//const allAccounts = accountStore.allAccounts;
const allMeters = meterStore.allMeters;

const getAccounts = (siteId) => {
  return accountStore.getAccountsById(siteId);
};

// Backend billing test state
const testLoading = ref(false);
const testError = ref(null);
const testResult = ref(null);

const fetchBackendBill = async (mode = "estimate") => {
  if (!accountStore.selectedAccount) {
    testError.value = "Select an account first.";
    return;
  }
  testLoading.value = true;
  testError.value = null;
  testResult.value = null;
  try {
    const res =
      mode === "finalize"
        ? await billingApi.finalizeBill(accountStore.selectedAccount.id)
        : await billingApi.getBill(accountStore.selectedAccount.id, {
            mode,
          });
    if (res.status) {
      testResult.value = res.data || res;
    } else {
      testError.value = res.error || "Backend billing failed";
      $q.notify({ message: testError.value, color: "negative" });
    }
  } catch (e) {
    testError.value = e.message || "Error calling backend billing";
    $q.notify({ message: testError.value, color: "negative" });
  } finally {
    testLoading.value = false;
  }
};

const getMeters = (accountId) => {
  return meterStore.getByAccuntId(accountId);
};

const Loading = () => {
  if (getMeters(accountStore.selectedAccount?.id).length > 0) {
    $q.loading.hide();
  } else {
    $q.loading.show();
    setTimeout(() => {
      $q.loading.hide();
    }, 1000);
  }
};

const isExpandSite = ref(true);
const isExpandAccount = ref(true);
const isExpandMeter = ref(true);

const modelAccountForNewEdit = ref(false);
const modelMeterForNewEdit = ref(false);
const modelAccountForFullBill = ref(false);
const modelAccountForHistory = ref(false);

const selectSite = (_site) => {
  siteStore.selectedSite = _site;
  accountStore.selectedAccount = null;
  meterStore.selectedMeter = null;
  isExpandAccount.value = true;
};
const selectAccount = (_account) => {
  accountStore.selectedAccount = _account;
  meterStore.selectedMeter = null;
  isExpandMeter.value = true;
  fetchAndSaveMeterOnAccount(_account.id);
};
// console.log("Select Account", accountStore.selectedAccount);

const deleteAccount = (account) => {
  let meters = meterStore.getByAccuntId(account.id);
  if (meters.length || [] > 0) {
    $q.notify({
      message:
        "You can only delete an account after you delete all meters associated with the account.",
      color: "error",
    });
    return;
  }
  $q.dialog({
    title: "Confirm",
    message:
      "Are you sure you want to delete this account? All data will be permanently lost.",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteMainAccount({ account_id: account.id }).then((status) => {
      if (status.code == 200) {
        accountStore.deleteAccount(account);
      }
    });
  });

  // .onOk(() => {
  //   // console.log('>>>> OK')
  //   accountStore.deleteAccount(account);
  // })
  // .onOk(() => {
  //   // console.log('>>>> second OK catcher')
  //   accountStore.deleteAccount(account);
  // });
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
