<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-deep-purple-9">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="white"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title class="text-white">
          <span class="text-weight-bold">MyCities</span>
          <q-badge color="warning" text-color="black" class="q-ml-sm">Admin</q-badge>
        </q-toolbar-title>
        
        <q-btn flat round icon="person" color="white">
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>{{ userName }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="switchToUserView">
                <q-item-section avatar>
                  <q-icon name="swap_horiz" />
                </q-item-section>
                <q-item-section>Switch to User View</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Admin Navigation
        </q-item-label>

        <q-item 
          clickable 
          v-ripple 
          :to="{ name: 'admin-dashboard' }"
          active-class="bg-deep-purple-1 text-deep-purple"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item 
          clickable 
          v-ripple 
          :to="{ name: 'admin-readings' }"
          active-class="bg-deep-purple-1 text-deep-purple"
        >
          <q-item-section avatar>
            <q-icon name="speed" />
          </q-item-section>
          <q-item-section>Readings</q-item-section>
        </q-item>

        <q-item 
          clickable 
          v-ripple 
          :to="{ name: 'admin-billing' }"
          active-class="bg-deep-purple-1 text-deep-purple"
        >
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section>Billing</q-item-section>
        </q-item>

        <q-item 
          clickable 
          v-ripple 
          :to="{ name: 'admin-tariffs' }"
          active-class="bg-deep-purple-1 text-deep-purple"
        >
          <q-item-section avatar>
            <q-icon name="price_change" />
          </q-item-section>
          <q-item-section>Tariffs</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header class="text-grey-8">
          Account Management
        </q-item-label>

        <q-item 
          clickable 
          v-ripple 
          :to="{ name: 'admin-accounts' }"
          active-class="bg-deep-purple-1 text-deep-purple"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>User Accounts</q-item-section>
        </q-item>

        <q-item 
          clickable 
          v-ripple 
          :to="{ name: 'admin-audit' }"
          active-class="bg-deep-purple-1 text-deep-purple"
        >
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>Audit Log</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";

const router = useRouter();
const userStore = useUserStore();

const leftDrawerOpen = ref(false);

const userName = computed(() => {
  return userStore.user?.name || userStore.user?.email || "Admin";
});

const switchToUserView = () => {
  router.push({ name: "send_reading" });
};

const logout = () => {
  userStore.signOut();
  router.push({ path: "/auth/login" });
};
</script>

<style scoped>
.q-item--active {
  font-weight: 500;
}
</style>



