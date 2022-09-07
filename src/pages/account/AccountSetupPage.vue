<template>
  <q-page padding class="flex-xs flex-center">
    <div>
      <q-list
        bordered
        class="rounded-borders"
        v-for="(site, index) in siteStore.allSites"
        :key="index"
      >
        <q-expansion-item
          expand-separator
          :default-opened="true"
          header-class="bg-primary"
        >
          <template v-slot:header>
            <q-item-section>Site : {{ site.title }}</q-item-section>
          </template>
          <div class="row flex-center">
            <q-card
              class="q-mx-md q-my-md mobile-full-width"
              v-for="account in site.accounts"
              :key="account.id"
            >
              <q-card-section>
                <div class="text-h6">{{ account.title }}</div>
                <div class="text">{{ account.number }}</div>
              </q-card-section>
              <q-card-actions>
                <q-btn
                  class="full-width"
                  color="primary"
                  text-color="black"
                  @click="
                    router.push({
                      name: 'addMeterPage',
                      query: { siteId: site.id, accountId: account.id },
                    })
                  "
                  >Add meter</q-btn
                >
              </q-card-actions>
            </q-card>
          </div>
        </q-expansion-item>
      </q-list>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        label="Add"
        text-color="black"
        @click="moveTo('add_site')"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAccountStore } from "/src/stores/account";
import { useSiteStore } from "/src/stores/site";

const router = useRouter();
const accountStore = useAccountStore();
const siteStore = useSiteStore();

function moveTo(name) {
  router.push({ name: name });
}
</script>
