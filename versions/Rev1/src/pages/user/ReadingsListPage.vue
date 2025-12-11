<template>
  <q-page class="readings-list-page">
    <q-scroll-area class="page-scroll-area">
      <div class="page-content">
        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Meter Readings</h1>
          <p class="page-subtitle">{{ readingsCount }} reading{{ readingsCount !== 1 ? 's' : '' }}</p>
        </div>

        <!-- Readings List -->
        <div v-if="readings.length === 0" class="empty-state">
          <q-icon name="speed" size="64px" color="grey-5" />
          <p>No readings yet</p>
          <q-btn
            color="primary"
            label="Add First Reading"
            @click="goToMeterInput"
          />
        </div>

        <q-list v-else class="readings-list" separator>
          <q-item
            v-for="reading in readings"
            :key="reading.id"
            clickable
            class="reading-item"
            @click="viewReading(reading.id)"
          >
            <q-item-section avatar>
              <q-icon name="water_drop" color="primary" size="32px" />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="reading-value">
                {{ formatReading(reading) }}
              </q-item-label>
              <q-item-label caption class="reading-date">
                {{ formatDate(reading.timestamp) }}
              </q-item-label>
            </q-item-section>
            
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-5" />
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Add Reading Button -->
        <div class="fab-container">
          <q-btn
            fab
            color="primary"
            icon="add"
            aria-label="Add new reading"
            @click="goToMeterInput"
          />
        </div>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllReadings, getReadingsCount } from 'src/services/readingsStorage';

const router = useRouter();

const readings = ref([]);
const readingsCount = computed(() => readings.value.length);

const loadReadings = () => {
  readings.value = getAllReadings();
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
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

const viewReading = (id) => {
  router.push({ name: 'reading-preview', params: { id } });
};

const goToMeterInput = () => {
  router.push({ name: 'meter-input' });
};

onMounted(() => {
  loadReadings();
  
  // Reload when returning to this page (in case readings were added)
  const unwatch = router.afterEach((to, from) => {
    if (to.name === 'readings-list' && from.name === 'meter-input') {
      loadReadings();
    }
  });
  
  // Cleanup on unmount
  return () => {
    if (unwatch) unwatch();
  };
});
</script>

<style scoped>
.readings-list-page {
  background: #f5f5f5;
}

.page-scroll-area {
  height: 100%;
}

.page-content {
  padding: 16px;
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 100px; /* Space for FAB */
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #3294B8;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: #666;
}

.empty-state p {
  margin: 16px 0 24px;
  font-size: 16px;
}

.readings-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.reading-item {
  padding: 16px;
  min-height: 72px;
}

.reading-value {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  color: #000;
}

.reading-date {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.fab-container {
  position: fixed;
  bottom: 80px;
  right: 16px;
  z-index: 100;
}

@media (min-width: 481px) {
  .fab-container {
    right: calc(50% - 232px); /* Center with max-width */
  }
}

/* Safe area insets for iOS */
@supports (padding: max(0px)) {
  .fab-container {
    bottom: max(80px, calc(80px + env(safe-area-inset-bottom)));
  }
}
</style>


