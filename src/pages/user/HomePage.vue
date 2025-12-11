<template>
  <q-page class="home-page" data-test="home-page">
    <q-scroll-area class="page-scroll-area">
      <div class="page-content">
        <!-- Welcome Header -->
        <div class="welcome-header">
          <div class="welcome-text">
            <p class="greeting">Welcome back,</p>
            <h1 class="user-name">{{ userName }}</h1>
          </div>
          <q-avatar color="primary" text-color="white" size="48px">
            {{ userInitials }}
          </q-avatar>
        </div>

        <!-- Quick Stats -->
        <q-card class="stats-card" v-if="readingsCount > 0" data-test="stats-card">
          <q-card-section>
            <div class="stat-item">
              <div class="stat-value">{{ readingsCount }}</div>
              <div class="stat-label">Total Readings</div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Main Actions -->
        <div class="actions-grid">
          <q-card 
            class="action-card" 
            clickable 
            @click="goToMeterInput"
            data-test="action-enter-reading"
          >
            <q-card-section class="action-content">
              <q-icon name="add_circle" size="48px" color="primary" />
              <h2 class="action-title">Enter Reading</h2>
              <p class="action-description">Add a new meter reading</p>
            </q-card-section>
          </q-card>

          <q-card 
            class="action-card" 
            clickable 
            @click="goToReadingsList"
            data-test="action-view-readings"
          >
            <q-card-section class="action-content">
              <q-icon name="list" size="48px" color="primary" />
              <h2 class="action-title">View Readings</h2>
              <p class="action-description">See all your readings</p>
            </q-card-section>
          </q-card>
        </div>

        <!-- Recent Reading -->
        <q-card 
          v-if="latestReading" 
          class="recent-card" 
          clickable 
          @click="viewLatestReading"
          data-test="recent-reading"
        >
          <q-card-section>
            <div class="recent-header">
              <q-icon name="history" color="primary" size="24px" />
              <span class="recent-label">Latest Reading</span>
            </div>
            <div class="recent-value" data-test="recent-reading-value">
              {{ formatReading(latestReading) }}
            </div>
            <div class="recent-date">
              {{ formatDate(latestReading.timestamp) }}
            </div>
          </q-card-section>
        </q-card>

        <!-- Quick Links -->
        <div class="quick-links">
          <q-btn
            flat
            icon="settings"
            label="Settings"
            color="grey-7"
            @click="goToSettings"
            data-test="link-settings"
          />
          <q-btn
            flat
            icon="logout"
            label="Logout"
            color="grey-7"
            @click="handleLogout"
            data-test="link-logout"
          />
        </div>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getAllReadings } from 'src/services/readingsStorage';
import { getSession, logout, getCurrentAccount } from 'src/services/authStorage';

const router = useRouter();
const $q = useQuasar();

const readings = ref([]);
const currentAccount = ref(null);

const readingsCount = computed(() => readings.value.length);
const latestReading = computed(() => readings.value[0] || null);

const userName = computed(() => {
  if (currentAccount.value) {
    return currentAccount.value.fullName || 'User';
  }
  const session = getSession();
  return session?.fullName || 'User';
});

const userInitials = computed(() => {
  const name = userName.value;
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const loadData = () => {
  readings.value = getAllReadings();
  currentAccount.value = getCurrentAccount();
};

const formatReading = (reading) => {
  const kl = reading.kiloliters || '0';
  const l = reading.liters || '0';
  return `${kl} - ${l}`;
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
    });
  }
};

const goToMeterInput = () => {
  router.push({ name: 'meter-input' });
};

const goToReadingsList = () => {
  router.push({ name: 'readings-list' });
};

const viewLatestReading = () => {
  if (latestReading.value) {
    router.push({ name: 'reading-preview', params: { id: latestReading.value.id } });
  }
};

const goToSettings = () => {
  router.push({ name: 'settings' });
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

onMounted(() => {
  loadData();
  
  // Reload when returning to this page
  const unwatch = router.afterEach((to) => {
    if (to.name === 'home') {
      loadData();
    }
  });
  
  return () => {
    if (unwatch) unwatch();
  };
});
</script>

<style scoped>
.home-page {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8f4f8 100%);
}

.page-scroll-area {
  height: 100%;
}

.page-content {
  padding: 24px 16px;
  max-width: 480px;
  margin: 0 auto;
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.welcome-text {
  flex: 1;
}

.greeting {
  font-size: 14px;
  color: #666;
  margin: 0 0 4px;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.stats-card {
  margin-bottom: 24px;
  text-align: center;
}

.stat-item {
  padding: 16px;
}

.stat-value {
  font-size: 48px;
  font-weight: 700;
  color: #3294B8;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.action-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:active {
  transform: scale(0.98);
}

.action-content {
  text-align: center;
  padding: 32px 16px;
}

.action-title {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin: 16px 0 8px;
}

.action-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.recent-card {
  margin-bottom: 24px;
}

.recent-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.recent-label {
  font-size: 12px;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.5px;
}

.recent-value {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  color: #000;
  margin-bottom: 8px;
}

.recent-date {
  font-size: 14px;
  color: #666;
}

.quick-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}
</style>
