<template>
  <q-page v-if="allSites.length > 0">
    <q-list bordered separator header-class="acc-list" v-show="showAccount">
      <!-- <div class="account_header">
        <i class="home-icon" @click="$router.back()"><img alt="Home-Icon" src="~assets/home-icons.svg" /></i>
      </div> -->
      <!-- Site -->
      <q-expansion-item
        dense
        expand-separator
        default-opened
        header-class="bg-primary accounts-list"
        v-for="(site, index) in allSites"
        :key="index"
        class="q-mt-sm"
        text-color="white"
      >
        <template v-slot:header>
          <q-item-section class="font-size larger text-white">
            {{ site.address || "Select A Location" }}
          </q-item-section>
        </template>
        <template v-for="account in getAccounts(site.id)" :key="account.id">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6"
                >Account : {{ account.number }}</q-item-label
              >
              <q-item-label>Name : {{ account.title }}</q-item-label>
              <!-- <q-item-label>{{ account.option }}</q-item-label> -->
            </q-item-section>

            <q-item-section center side>
              <!-- <div v-if="account?.fixedCosts?.length && account.fixedCosts.length > 0
                "> -->
              <q-btn
                rounded
                color="primary"
                text-color="white"
                @click="
                  selectAccount(account);
                  Loading();
                "
                v-if="account == accountStore.selectedAccount"
                icon="check"
                >Select
              </q-btn>
              <q-btn
                rounded
                color="primary"
                text-color="white"
                v-else
                @click="selectAccount(account), Loading()"
                >Select
              </q-btn>
              <!-- </div> -->
              <!-- <div v-else> -->
              <!-- <q-btn @click="accountStore.selectedAccount = account;
                modelAccountForNewEdit = true;
                                                                                                                  " rounded
                  color="negative" text-color="white">Setup</q-btn> -->
              <!-- </div> -->
              <q-btn flat size="lg" icon="more_horiz" text-color="primary">
                <q-menu anchor="center middle" self="center middle">
                  <q-list style="min-width: 100px">
                    <!--                    <q-item clickable v-close-popup @click="accountStore.selectedAccount = account;-->
                    <!--                    modelAccountForFullBill = true;-->
                    <!--                                                            ">-->
                    <!--                      <q-item-section>View Bill</q-item-section>-->
                    <!--                    </q-item>-->
                    <router-link
                      class="link"
                      :to="{ name: 'FullBill', params: { id: account.id } }"
                    >
                      <q-item clickable v-ripple>
                        <q-item-section>View Bill</q-item-section>
                      </q-item>
                    </router-link>
                    <q-item
                      clickable
                      v-close-popup
                      @click="
                        accountStore.selectedAccount = account;
                        modelAccountForHistory = true;
                      "
                    >
                      <q-item-section>View History</q-item-section>
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
        <!-- clickable v-ripple -->
        <!-- <q-item v-for="site in allSites" :key="site.id">
          <q-item-section>
            <q-item-label>{{ site.address }}</q-item-label>
          </q-item-section>
        </q-item> -->
      </q-expansion-item>

      <!-- Site -->

      <!-- Account -->
      <!-- <q-expansion-item dense group="accordion" expand-separator v-if=" siteStore.selectedSite " :default-opened=" true "
        v-model=" isExpandAccount " header-class="bg-primary" class="q-mt-sm">
        <template v-slot:header>
          <q-item-section class="font-size larger text-white">Accounts -
            {{
            accountStore.selectedAccount?.number || "Select An Account"
            }}</q-item-section>
        </template>

        <template v-for="       account        in            getAccounts(siteStore.selectedSite.id)           "
          :key="account.id">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">{{ account.number }}</q-item-label>
              <q-item-label>{{ account.title }}</q-item-label>
              <q-item-label>{{ account.option }}</q-item-label>
            </q-item-section>

            <q-item-section center side>
              <div v-if="
                account?.fixedCosts?.length && account.fixedCosts.length > 0
              ">
                <q-btn rounded color="primary" text-color="white" @click=" selectAccount(account), Loading() "
                  v-if=" account == accountStore.selectedAccount " icon="check">Select</q-btn>
                <q-btn rounded color="primary" text-color="white" v-else
                  @click=" selectAccount(account), Loading() ">Select</q-btn>
              </div>
              <div v-else>
                <q-btn @click="
                  accountStore.selectedAccount = account;
                  modelAccountForNewEdit = true;
                " rounded color="negative" text-color="white">Setup</q-btn>
              </div>
              <q-btn flat size="lg" icon="more_horiz" text-color="primary">
                <q-menu anchor="center middle" self="center middle">
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup @click="
                      accountStore.selectedAccount = account;
                      modelAccountForFullBill = true;
                    ">
                      <q-item-section>Full Bill</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="
                      accountStore.selectedAccount = account;
                      modelAccountForHistory = true;
                    ">
                      <q-item-section>History</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="
                      accountStore.selectedAccount = account;
                      modelAccountForNewEdit = true;
                    ">
                      <q-item-section>Edit Account</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click=" deleteAccount(account) ">
                      <q-item-section>Delete Account</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="
                      accountStore.selectedAccount = null;
                      modelAccountForNewEdit = true;
                    ">
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

        <q-item class="justify-center" v-if=" getAccounts(siteStore.selectedSite.id).length == 0 ">
          <q-btn color="primary" rounded outline text-color="black" icon="add" @click=" modelAccountForNewEdit = true ">
            Add New Account
          </q-btn>
        </q-item>
      </q-expansion-item> -->
      <!-- Account -->
    </q-list>
    <q-list bordered separator header-class="meter-list" v-show="showMeter">
      <!-- Meter -->
      <!-- <q-btn icon-right="arrow_backward" no-caps color="primary" rounded class="text-white fit-content" label="Home"
        @click=" send_reading " /> -->
      <q-header elevated class="containerWidth new-meter-heading breadcrumbs">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="arrow_back"
            text-color="white"
            @click="
              showMeter = false;
              showAccount = true;
            "
          />
          <q-toolbar-title class="text-white">
            Manage > Account > {{ accountStore?.selectedAccount?.title }} ({{
              accountStore?.selectedAccount?.number
            }})
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <div class="account_header">
        <i class="home-icon" @click="$router.back()"
          ><img alt="Home-Icon" src="~assets/home-icons.svg"
        /></i>
        {{ accountStore?.selectedAccount?.number }},
        {{ accountStore?.selectedAccount?.title }}
      </div>
      <!-- <q-expansion-item dense group="accordion" expand-separator v-if=" accountStore.selectedAccount "
        :default-opened=" true " v-model=" isExpandMeter " header-class="meters-list" class="q-mt-sm" text-color="white">

        <template v-slot:header>
          <q-item-section class="font-size larger text-white">
            {{
            accountStore.selectedAccount.number
            }} {{ accountStore.selectedAccount.title }}</q-item-section>
        </template> -->

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
      <!-- </q-expansion-item> -->
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
import {
  fetchAndSaveMeterOnAccount,
  deleteMainAccount,
  deleteMainSiteAccount,
} from "src/boot/axios";
import { updateAllData } from "boot/firebase";

import { date, Dialog, useQuasar } from "quasar";

const siteStore = useSiteStore();
const accountStore = useAccountStore();
const meterStore = useMeterStore();
const userStore = useUserStore();
const $q = useQuasar();

const allSites = siteStore.allSites;
console.log(allSites);
console.log();
//const allAccounts = accountStore.allAccounts;
const allMeters = meterStore.allMeters;
var t = accountStore.selectedAccount?.id;
const getAccountDetails = (t) => {
  return accountStore.getAccountById(t);
};
console.log(getAccountDetails(t));

const getAccounts = (siteId) => {
  return accountStore.getAccountsById(siteId);
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
const showAccount = ref(true);
const showMeter = ref(false);

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
  console.log(_account);
  accountStore.selectedAccount = _account;
  meterStore.selectedMeter = null;
  isExpandMeter.value = true;
  showAccount.value = false;
  showMeter.value = true;
  fetchAndSaveMeterOnAccount(_account.id);
};
// console.log("Select Account", accountStore.selectedAccount);
const deletesite = async (_site) => {
  //await updateAllData();
  //let meters = meterStore.getByAccuntId(account.id);
  $q.dialog({
    title: "Confirm",
    message:
      "Are you sure you want to delete this location? All accounts,meters and history associated with this location will be deleted.",
    cancel: true,
    ok: `Confirm`,
    persistent: true,
  }).onOk(() => {
    deleteMainSiteAccount({ location_id: _site.id }).then((status) => {
      console.log(status);
      if (status.code == 200) {
        window.location.reload();
        updateAllData();
      }
    });
  });
};

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
      if (status.code === 200) {
        accountStore.deleteAccount(account);
        updateAllData();
        setTimeout(()=>{
          window.location.reload();
        },2000)
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
