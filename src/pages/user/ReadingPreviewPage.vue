<template>
  <q-page class="reading-preview-page">
    <q-scroll-area class="page-scroll-area">
      <div class="page-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <q-spinner color="primary" size="48px" />
          <p>Loading reading...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <q-icon name="error_outline" size="64px" color="negative" />
          <p>{{ error }}</p>
          <q-btn
            color="primary"
            label="Back to List"
            @click="goToReadingsList"
          />
        </div>

        <!-- Reading Details -->
        <div v-else-if="reading" class="reading-details">
          <!-- Header -->
          <div class="page-header">
            <h1 class="page-title">Reading Details</h1>
            <p class="page-subtitle">{{ formatDate(reading.timestamp) }}</p>
          </div>

          <!-- Reading Value -->
          <div class="reading-display">
            <div class="reading-value-large">
              {{ formatReading(reading) }}
            </div>
            <div class="reading-breakdown">
              <div class="breakdown-item">
                <span class="label">Kiloliters</span>
                <span class="value kiloliters">{{ reading.kiloliters || '0' }}</span>
              </div>
              <div class="breakdown-separator">-</div>
              <div class="breakdown-item">
                <span class="label">Liters</span>
                <span class="value liters">{{ reading.liters || '0' }}</span>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <q-card class="metadata-card">
            <q-card-section>
              <div class="metadata-row">
                <span class="metadata-label">Type</span>
                <span class="metadata-value">{{ reading.type || 'Manual' }}</span>
              </div>
              <div class="metadata-row">
                <span class="metadata-label">Date</span>
                <span class="metadata-value">{{ formatFullDate(reading.timestamp) }}</span>
              </div>
              <div class="metadata-row" v-if="reading.id">
                <span class="metadata-label">ID</span>
                <span class="metadata-value metadata-id">{{ reading.id }}</span>
              </div>
            </q-card-section>
          </q-card>

          <!-- Actions -->
          <div class="actions">
            <q-btn
              color="primary"
              label="Edit Reading"
              icon="edit"
              @click="editReading"
            />
            <q-btn
              color="negative"
              outline
              label="Delete"
              icon="delete"
              @click="confirmDelete"
            />
          </div>
        </div>
      </div>
    </q-scroll-area>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Delete Reading?</div>
        </q-card-section>

        <q-card-section>
          <p>Are you sure you want to delete this reading? This action cannot be undone.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteReading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getReadingById, deleteReading as deleteReadingStorage } from 'src/services/readingsStorage';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const reading = ref(null);
const loading = ref(true);
const error = ref(null);
const showDeleteDialog = ref(false);

const loadReading = () => {
  const id = route.params.id;
  
  if (!id) {
    error.value = 'No reading ID provided';
    loading.value = false;
    return;
  }
  
  const found = getReadingById(id);
  
  if (!found) {
    error.value = 'Reading not found';
    loading.value = false;
    return;
  }
  
  reading.value = found;
  loading.value = false;
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

const formatFullDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const editReading = () => {
  // Navigate to meter input with reading data
  // For now, just go to meter input (could pre-fill if needed)
  router.push({ name: 'meter-input' });
};

const confirmDelete = () => {
  showDeleteDialog.value = true;
};

const deleteReading = () => {
  if (!reading.value) return;
  
  const deleted = deleteReadingStorage(reading.value.id);
  
  if (deleted) {
    $q.notify({
      type: 'positive',
      message: 'Reading deleted',
      position: 'top',
    });
    
    // Navigate back to list
    router.push({ name: 'readings-list' });
  } else {
    $q.notify({
      type: 'negative',
      message: 'Failed to delete reading',
      position: 'top',
    });
  }
  
  showDeleteDialog.value = false;
};

const goToReadingsList = () => {
  router.push({ name: 'readings-list' });
};

onMounted(() => {
  loadReading();
});
</script>

<style scoped>
.reading-preview-page {
  background: #f5f5f5;
}

.page-scroll-area {
  height: 100%;
}

.page-content {
  padding: 16px;
  max-width: 480px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 64px 24px;
  color: #666;
}

.error-state p {
  margin: 16px 0 24px;
  font-size: 16px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
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

.reading-display {
  background: white;
  border-radius: 8px;
  padding: 32px;
  margin-bottom: 24px;
  text-align: center;
}

.reading-value-large {
  font-size: 48px;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  color: #000;
  margin-bottom: 24px;
}

.reading-breakdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breakdown-item .label {
  font-size: 12px;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.5px;
}

.breakdown-item .value {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
}

.breakdown-item .value.kiloliters {
  color: #cc0000;
}

.breakdown-item .value.liters {
  color: #000;
}

.breakdown-separator {
  font-size: 32px;
  font-weight: 700;
  color: #000;
}

.metadata-card {
  margin-bottom: 24px;
}

.metadata-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.metadata-row:last-child {
  border-bottom: none;
}

.metadata-label {
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metadata-value {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.metadata-id {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions .q-btn {
  flex: 1;
}
</style>



