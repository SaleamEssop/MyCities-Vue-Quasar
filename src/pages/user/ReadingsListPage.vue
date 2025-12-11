<template>
  <q-page class="readings-list-page">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Reading History</h1>
        <p class="page-subtitle">{{ currentPeriod?.startDate }} to {{ currentPeriod?.endDate }}</p>
      </div>

      <!-- Period Selector -->
      <div class="period-selector">
        <q-btn 
          flat 
          dense 
          icon="chevron_left" 
          @click="previousPeriod"
          :disable="currentPeriodIndex >= periods.length - 1"
        />
        <span class="period-label">{{ formatPeriodLabel(currentPeriod) }}</span>
        <q-btn 
          flat 
          dense 
          icon="chevron_right" 
          @click="nextPeriod"
          :disable="currentPeriodIndex <= 0"
        />
      </div>

      <!-- Water Readings Section -->
      <div class="section-header">
        <q-icon name="water_drop" color="primary" size="24px" />
        <span>Water Meter</span>
        <span class="meter-number">#{{ meters?.water?.number }}</span>
      </div>
      
      <div class="readings-card">
        <!-- All Water Readings for Period -->
        <div 
          v-for="(reading, index) in waterReadingsForPeriod" 
          :key="reading.id"
          class="reading-row"
          :class="{ 'first-reading': index === 0, 'last-reading': index === waterReadingsForPeriod.length - 1 }"
        >
          <div class="reading-info">
            <div class="reading-label">
              <q-badge 
                :color="getReadingBadgeColor(reading.type)" 
                :label="getReadingBadgeLabel(reading.type)" 
                class="reading-badge" 
              />
              <span class="reading-date">{{ formatDate(reading.date) }}</span>
            </div>
            <div class="reading-value">
              <span class="red-digits">{{ reading.redValue || '0' }}</span>
              <span class="black-digits">.{{ reading.blackValue || '0000' }}</span>
              <span class="unit">kl</span>
            </div>
          </div>
          <div class="reading-source" v-if="reading.isEstimated">
            <q-badge color="orange" label="Estimated" />
          </div>
        </div>

        <!-- No Readings Yet -->
        <div class="reading-row pending" v-if="waterReadingsForPeriod.length === 0">
          <div class="reading-info">
            <div class="reading-label">
              <q-badge color="amber" label="NO DATA" class="reading-badge" />
              <span class="reading-date">No readings entered yet</span>
            </div>
          </div>
          <q-btn 
            flat 
            dense 
            color="primary" 
            label="Enter Reading" 
            @click="goToWaterReading"
          />
        </div>

        <!-- Add Reading Button (for current period) -->
        <div class="add-reading-row" v-if="currentPeriod?.status === 'current' && waterReadingsForPeriod.length > 0">
          <q-btn 
            flat 
            dense 
            color="primary" 
            icon="add"
            label="Add Reading" 
            @click="goToWaterReading"
          />
        </div>

        <!-- Usage Summary -->
        <div class="usage-summary" v-if="waterReadingsForPeriod.length > 0">
          <div class="usage-row">
            <span class="usage-label">Usage this period:</span>
            <span class="usage-value">{{ waterUsage }} kl</span>
          </div>
          <div class="usage-row" v-if="waterReadingsForPeriod.length > 1">
            <span class="usage-label">Readings count:</span>
            <span class="usage-value">{{ waterReadingsForPeriod.length }}</span>
          </div>
        </div>
      </div>

      <!-- Electricity Readings Section -->
      <div class="section-header">
        <q-icon name="bolt" color="orange" size="24px" />
        <span>Electricity Meter</span>
        <span class="meter-number">#{{ meters?.electricity?.number }}</span>
      </div>
      
      <div class="readings-card">
        <!-- All Electricity Readings for Period -->
        <div 
          v-for="(reading, index) in electricityReadingsForPeriod" 
          :key="reading.id"
          class="reading-row"
          :class="{ 'first-reading': index === 0, 'last-reading': index === electricityReadingsForPeriod.length - 1 }"
        >
          <div class="reading-info">
            <div class="reading-label">
              <q-badge 
                :color="getReadingBadgeColor(reading.type)" 
                :label="getReadingBadgeLabel(reading.type)" 
                class="reading-badge" 
              />
              <span class="reading-date">{{ formatDate(reading.date) }}</span>
            </div>
            <div class="reading-value electricity">
              <span class="digits">{{ reading.value || reading.kwh || '0' }}</span>
              <span class="unit">kWh</span>
            </div>
          </div>
          <div class="reading-source" v-if="reading.isEstimated">
            <q-badge color="orange" label="Estimated" />
          </div>
        </div>

        <!-- No Readings Yet -->
        <div class="reading-row pending" v-if="electricityReadingsForPeriod.length === 0">
          <div class="reading-info">
            <div class="reading-label">
              <q-badge color="amber" label="NO DATA" class="reading-badge" />
              <span class="reading-date">No readings entered yet</span>
            </div>
          </div>
          <q-btn 
            flat 
            dense 
            color="primary" 
            label="Enter Reading" 
            @click="goToElectricityReading"
          />
        </div>

        <!-- Add Reading Button (for current period) -->
        <div class="add-reading-row" v-if="currentPeriod?.status === 'current' && electricityReadingsForPeriod.length > 0">
          <q-btn 
            flat 
            dense 
            color="primary" 
            icon="add"
            label="Add Reading" 
            @click="goToElectricityReading"
          />
        </div>

        <!-- Usage Summary -->
        <div class="usage-summary" v-if="electricityReadingsForPeriod.length > 0">
          <div class="usage-row">
            <span class="usage-label">Usage this period:</span>
            <span class="usage-value">{{ electricityUsage }} kWh</span>
          </div>
          <div class="usage-row" v-if="electricityReadingsForPeriod.length > 1">
            <span class="usage-label">Readings count:</span>
            <span class="usage-value">{{ electricityReadingsForPeriod.length }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <q-btn 
          unelevated 
          color="primary" 
          icon="water_drop" 
          label="Add Water Reading" 
          @click="goToWaterReading"
          class="action-btn"
        />
        <q-btn 
          unelevated 
          color="orange" 
          icon="bolt" 
          label="Add Electricity Reading" 
          @click="goToElectricityReading"
          class="action-btn"
        />
      </div>

      <!-- Back Button -->
      <div class="back-section">
        <q-btn 
          flat 
          color="primary" 
          label="Back to Dashboard" 
          icon="arrow_back" 
          @click="goBack"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
/**
 * ReadingsListPage - Displays reading history by billing period
 * 
 * Shows START and END readings for each billing period.
 * The END reading of one period becomes the START of the next.
 * Maximum 1 reading per day per meter.
 */

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import seedData from 'src/services/seedData';

const router = useRouter();

// Data
const periods = ref([]);
const currentPeriodIndex = ref(0);
const meters = ref(null);
const waterReadings = ref([]);
const electricityReadings = ref([]);

// Computed
const currentPeriod = computed(() => periods.value[currentPeriodIndex.value] || null);

// Get ALL water readings for the current period (sorted by date)
const waterReadingsForPeriod = computed(() => {
  if (!currentPeriod.value) return [];
  return waterReadings.value
    .filter(r => r.periodId === currentPeriod.value.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

// Get ALL electricity readings for the current period (sorted by date)
const electricityReadingsForPeriod = computed(() => {
  if (!currentPeriod.value) return [];
  return electricityReadings.value
    .filter(r => r.periodId === currentPeriod.value.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

const waterStartReading = computed(() => {
  if (!currentPeriod.value) return null;
  return waterReadings.value.find(r => r.periodId === currentPeriod.value.id && r.type === 'start');
});

const waterEndReading = computed(() => {
  if (!currentPeriod.value) return null;
  return waterReadings.value.find(r => r.periodId === currentPeriod.value.id && r.type === 'end');
});

const electricityStartReading = computed(() => {
  if (!currentPeriod.value) return null;
  return electricityReadings.value.find(r => r.periodId === currentPeriod.value.id && r.type === 'start');
});

const electricityEndReading = computed(() => {
  if (!currentPeriod.value) return null;
  return electricityReadings.value.find(r => r.periodId === currentPeriod.value.id && r.type === 'end');
});

const waterUsage = computed(() => {
  const readings = waterReadingsForPeriod.value;
  if (readings.length < 1) return '0.00';
  const start = readings[0]?.kiloliters || 0;
  const end = readings[readings.length - 1]?.kiloliters || start;
  return (end - start).toFixed(2);
});

const electricityUsage = computed(() => {
  const readings = electricityReadingsForPeriod.value;
  if (readings.length < 1) return '0';
  const start = readings[0]?.kwh || 0;
  const end = readings[readings.length - 1]?.kwh || start;
  return (end - start).toLocaleString();
});

// Methods
const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatPeriodLabel = (period) => {
  if (!period) return '';
  const start = new Date(period.startDate);
  const end = new Date(period.endDate);
  const startMonth = start.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  const endMonth = end.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  return `${startMonth} - ${endMonth}`;
};

const previousPeriod = () => {
  if (currentPeriodIndex.value < periods.value.length - 1) {
    currentPeriodIndex.value++;
  }
};

const nextPeriod = () => {
  if (currentPeriodIndex.value > 0) {
    currentPeriodIndex.value--;
  }
};

const goToWaterReading = () => {
  router.push({ name: 'water-reading' });
};

const goToElectricityReading = () => {
  router.push({ name: 'electricity-reading' });
};

// Helper functions for reading badges
const getReadingBadgeColor = (type) => {
  switch (type) {
    case 'start': return 'grey';
    case 'end': return 'green';
    case 'reading': return 'primary';
    default: return 'grey';
  }
};

const getReadingBadgeLabel = (type) => {
  switch (type) {
    case 'start': return 'START';
    case 'end': return 'END';
    case 'reading': return 'READING';
    default: return type?.toUpperCase() || 'READING';
  }
};

const goBack = () => {
  router.push({ name: 'home' });
};

const loadData = () => {
  seedData.initializeSeedData();
  periods.value = seedData.getBillingPeriods();
  meters.value = seedData.getMeters();
  waterReadings.value = seedData.getWaterReadings();
  electricityReadings.value = seedData.getElectricityReadings();
  
  // Find current period index
  const currentIdx = periods.value.findIndex(p => p.status === 'current');
  currentPeriodIndex.value = currentIdx >= 0 ? currentIdx : 0;
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.readings-list-page {
  background: #f5f5f5 !important;
  min-height: 100%;
  padding: 0;
}

.page-content {
  padding: 16px;
  max-width: 100%;
  margin: 0 auto;
  padding-bottom: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #3294B8;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Period Selector */
.period-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
}

.period-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 150px;
  text-align: center;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 8px 0;
}

.meter-number {
  font-size: 12px;
  color: #888;
  font-weight: 400;
  margin-left: auto;
}

/* Readings Card */
.readings-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.reading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.reading-row:last-child {
  border-bottom: none;
}

.reading-row.pending {
  background: #fffbf0;
  margin: -12px;
  padding: 12px;
  border-radius: 0 0 12px 12px;
  border-bottom: none;
}

.reading-info {
  flex: 1;
}

.reading-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.reading-badge {
  font-size: 10px;
  padding: 2px 6px;
}

.reading-date {
  font-size: 12px;
  color: #666;
}

.reading-value {
  font-size: 20px;
  font-weight: 700;
}

.reading-value .red-digits {
  color: #D32F2F;
}

.reading-value .black-digits {
  color: #333;
}

.reading-value.electricity .digits {
  color: #333;
}

.reading-value .unit {
  font-size: 12px;
  font-weight: 400;
  color: #888;
  margin-left: 4px;
}

/* Add Reading Row */
.add-reading-row {
  display: flex;
  justify-content: center;
  padding: 8px 0;
  border-top: 1px dashed #e0e0e0;
  margin-top: 4px;
}

/* First/Last reading styling */
.reading-row.first-reading {
  background: rgba(158, 158, 158, 0.05);
  margin: -12px -12px 0 -12px;
  padding: 12px;
  border-radius: 12px 12px 0 0;
}

.reading-row.last-reading:not(.first-reading) {
  background: rgba(76, 175, 80, 0.05);
}

/* Usage Summary */
.usage-summary {
  padding-top: 12px;
  border-top: 1px dashed #e0e0e0;
  margin-top: 8px;
}

.usage-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.usage-label {
  font-size: 14px;
  color: #666;
}

.usage-value {
  font-size: 16px;
  font-weight: 600;
  color: #3294B8;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.action-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
}

/* Back Section */
.back-section {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}
</style>
