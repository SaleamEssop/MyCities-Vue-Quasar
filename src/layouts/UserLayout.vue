<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar class="container-width">
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          color="white"
          @click="handleBack"
        />
        <q-toolbar-title class="text-white text-weight-medium">
          {{ route.meta.title || 'MyCities' }}
        </q-toolbar-title>
        <q-btn flat dense round icon="notifications" color="white" />
        <q-btn flat dense round icon="person" color="white" @click="goToProfile" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Bottom Navigation -->
    <q-footer class="bg-white" bordered>
      <q-tabs
        v-model="activeTab"
        class="text-grey-7"
        active-color="primary"
        indicator-color="transparent"
        narrow-indicator
      >
        <q-tab name="home" icon="home" label="Home" @click="goToHome" />
        <q-tab name="readings" icon="speed" label="Readings" @click="goToReadings" />
        <q-tab name="bills" icon="receipt" label="Bills" @click="goToBills" />
        <q-tab name="history" icon="history" label="History" @click="goToHistory" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const activeTab = ref('readings');

const handleBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'user-home' });
  }
};

const goToHome = () => router.push({ name: 'user-home' });
const goToReadings = () => router.push({ name: 'user-readings' });
const goToBills = () => router.push({ name: 'user-bills' });
const goToHistory = () => router.push({ name: 'user-history' });
const goToProfile = () => router.push({ name: 'user-profile' });
</script>

<style scoped>
.container-width {
  max-width: 480px;
  margin: 0 auto;
}

@media (min-width: 480px) {
  .q-header :deep(.q-toolbar) {
    max-width: 480px;
    margin: 0 auto;
  }
}
</style>




