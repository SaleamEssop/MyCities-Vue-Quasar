<template>
  <q-page class="settings-page" data-test="settings-page">
    <q-scroll-area class="page-scroll-area">
      <div class="page-content">
        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Settings</h1>
        </div>

        <!-- Settings Sections -->
        <q-list class="settings-list" separator>
          <!-- Account Management -->
          <q-item-label header class="section-header">Account</q-item-label>
          
          <q-item clickable @click="goToAccounts" data-test="settings-accounts">
            <q-item-section avatar>
              <q-icon name="people" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Manage Accounts</q-item-label>
              <q-item-label caption>View, edit, or add accounts</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-5" />
            </q-item-section>
          </q-item>

          <q-item clickable @click="goToProfile" data-test="settings-profile">
            <q-item-section avatar>
              <q-icon name="person" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Profile</q-item-label>
              <q-item-label caption>View your profile details</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-5" />
            </q-item-section>
          </q-item>

          <!-- Data Management -->
          <q-item-label header class="section-header">Data Management</q-item-label>
          
          <q-item clickable @click="clearAllData" data-test="settings-clear-readings">
            <q-item-section avatar>
              <q-icon name="delete_sweep" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Clear All Readings</q-item-label>
              <q-item-label caption>Delete all stored meter readings</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-5" />
            </q-item-section>
          </q-item>

          <q-item clickable @click="resetAllData" data-test="settings-reset-data">
            <q-item-section avatar>
              <q-icon name="refresh" color="warning" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Reset to Demo Data</q-item-label>
              <q-item-label caption>Reset all data to default seed values</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-5" />
            </q-item-section>
          </q-item>

          <!-- App Info -->
          <q-item-label header class="section-header">App Information</q-item-label>
          
          <q-item>
            <q-item-section avatar>
              <q-icon name="info" color="grey" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Version</q-item-label>
              <q-item-label caption>1.0.0</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="goToAbout" data-test="settings-about">
            <q-item-section avatar>
              <q-icon name="help" color="grey" />
            </q-item-section>
            <q-item-section>
              <q-item-label>About</q-item-label>
              <q-item-label caption>Learn more about MyCities</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-5" />
            </q-item-section>
          </q-item>

          <!-- Session -->
          <q-item-label header class="section-header">Session</q-item-label>
          
          <q-item clickable @click="handleLogout" data-test="settings-logout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-negative">Logout</q-item-label>
              <q-item-label caption>Sign out of your account</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-scroll-area>

    <!-- Clear Data Confirmation Dialog -->
    <q-dialog v-model="showClearDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Clear All Readings?</div>
        </q-card-section>

        <q-card-section>
          <p>This will permanently delete all stored meter readings. This action cannot be undone.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Clear All" color="negative" @click="confirmClearAll" data-test="confirm-clear" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { clearAllReadings, getReadingsCount } from 'src/services/readingsStorage';
import { logout } from 'src/services/authStorage';
import seedData from 'src/services/seedData';

const router = useRouter();
const $q = useQuasar();

const showClearDialog = ref(false);
const showResetDialog = ref(false);

const goToAccounts = () => {
  router.push({ name: 'accounts-list' });
};

const goToProfile = () => {
  router.push({ name: 'user-profile' });
};

const clearAllData = () => {
  const count = getReadingsCount();
  if (count === 0) {
    $q.notify({
      type: 'info',
      message: 'No readings to clear',
      position: 'top',
    });
    return;
  }
  showClearDialog.value = true;
};

const confirmClearAll = () => {
  clearAllReadings();
  $q.notify({
    type: 'positive',
    message: 'All readings cleared',
    position: 'top',
  });
  showClearDialog.value = false;
};

const goToAbout = () => {
  router.push({ name: 'about' });
};

const resetAllData = () => {
  seedData.resetSeedData();
  $q.notify({
    type: 'positive',
    message: 'All data reset to demo values. Refresh the page.',
    position: 'top',
  });
  // Refresh the page to reload data
  window.location.reload();
};

const handleLogout = () => {
  logout();
  $q.notify({
    type: 'info',
    message: 'You have been logged out',
    position: 'top',
  });
  router.push({ name: 'login' });
};
</script>

<style scoped>
.settings-page {
  background: #f5f5f5;
}

.page-scroll-area {
  height: 100%;
}

.page-content {
  max-width: 480px;
  margin: 0 auto;
}

.page-header {
  padding: 16px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #3294B8;
  margin: 0;
}

.settings-list {
  background: white;
  border-radius: 8px;
  margin: 16px;
  overflow: hidden;
}

.section-header {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
  padding: 16px 16px 8px;
}
</style>
