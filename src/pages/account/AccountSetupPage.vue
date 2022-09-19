<template>
  <q-page padding class="flex-xs flex-center">
    <div>
      <q-btn
        fab
        flat
        icon="add"
        color="primary"
        label="Add new site"
        text-color="black"
        @click="moveTo('add_site')"
      />
      <q-list
        bordered
        class="rounded-borders"
        v-for="(site, index) in allSites"
        :key="index"
      >
        <q-expansion-item
          dense
          expand-separator
          :default-opened="true"
          header-class="bg-primary"
        >
          <template v-slot:header>
            <q-item-section>Site : {{ site.title }}</q-item-section>
          </template>
          <q-btn
            color="primary"
            flat
            text-color="black"
            icon="add"
            @click="
              selectedAccount = null;
              selectedSite = site;
              startFixedCost = true;
            "
            :offset="[18, 18]"
          >
            Add a new account to the site
          </q-btn>
          <q-separator inset />
          <div class="row flex-center">
            <q-card
              dense
              flat
              class="mobile-full-width"
              v-for="account in getAccountsById(site.id)"
              :key="account.id"
            >
              <q-card-section>
                <div class="flex justify-between items-center">
                  Account Name
                  <span class="text-h6 q-px-sm">{{ account.title }}</span>
                </div>
                <div class="flex justify-between items-center">
                  Account Number
                  <span class="text-h6 q-px-sm">{{ account.number }}</span>
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  flat
                  color="primary"
                  text-color="black"
                  icon="add"
                  @click="
                    router.push({
                      name: 'addMeterPage',
                      query: { siteId: site.id, accountId: account.id },
                    })
                  "
                  >Add new meter</q-btn
                >
                <q-btn
                  flat
                  color="primary"
                  text-color="black"
                  icon="edit"
                  @click="
                    selectedAccount = account;
                    startFixedCost = true;
                  "
                  >Edit Account</q-btn
                >
              </q-card-actions>
              <q-separator />
            </q-card>
          </div>
        </q-expansion-item>
      </q-list>
    </div>

    <!-- <q-page-sticky position="top-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        label="Add new site"
        text-color="black"
        @click="moveTo('add_site')"
      />
    </q-page-sticky> -->

    <q-dialog
      v-model="startFixedCost"
      @hide="startFixedCost = false"
      :full-width="true"
      :full-height="true"
      persistent
    >
      <!-- <q-page>
        <q-page-container> -->

      <AccountComponent
        :account="selectedAccount"
        @close="startFixedCost = false"
        @save="startFixedCost = false"
        @update:account="
          if (selectedAccount) {
            Object.assign(selectedAccount, $event);
          } else {
            accountStore.addAccount($event);
            //            selectedSite.accounts.push($event);
          }
        "
      />

      <!-- </q-page-container> -->
      <!-- </q-page> -->
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";

import { useSiteStore } from "/src/stores/site";
import { useAccountStore } from "/src/stores/account";
import { useMeterStore } from "/src/stores/meter";

import AccountComponent from "src/components/AccountComponent.vue";

const startFixedCost = ref(false);
const selectedAccount = ref();
const selectedSite = ref();

const router = useRouter();
const siteStore = useSiteStore();
const accountStore = useAccountStore();
const meterStore = useMeterStore();

const allSites = siteStore.allSites;

const getAccountsById = (siteId) => {
  return accountStore.getAccountsById(siteId);
};

function moveTo(name) {
  router.push({ name: name });
}
</script>
