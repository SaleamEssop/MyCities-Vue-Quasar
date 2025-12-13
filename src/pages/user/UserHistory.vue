<template>
  <q-page class="bg-grey-2">
    <div class="container q-pa-md">
      <!-- Filter Tabs -->
      <q-tabs
        v-model="selectedMeter"
        class="bg-white rounded-borders q-mb-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="all" label="All" />
        <q-tab name="water" icon="water_drop" label="Water" />
        <q-tab name="electricity" icon="bolt" label="Electricity" />
      </q-tabs>

      <!-- Reading History List -->
      <q-list class="bg-white rounded-borders">
        <template v-for="(group, date) in groupedReadings" :key="date">
          <q-item-label header class="text-grey-7">{{ formatDateHeader(date) }}</q-item-label>
          
          <q-item
            v-for="reading in group"
            :key="reading.id"
          >
            <q-item-section avatar>
              <q-avatar 
                :color="reading.meterType === 'water' ? 'cyan' : 'amber-8'" 
                text-color="white"
                size="40px"
              >
                <q-icon :name="reading.meterType === 'water' ? 'water_drop' : 'bolt'" />
              </q-avatar>
            </q-item-section>
            
            <q-item-section>
              <q-item-label>
                {{ reading.meterType === 'water' ? 'Water Meter' : 'Electricity Meter' }}
              </q-item-label>
              <q-item-label caption>
                {{ reading.meterNumber }}
              </q-item-label>
            </q-item-section>
            
            <q-item-section side>
              <q-item-label class="text-weight-bold text-h6">
                {{ reading.value }}
              </q-item-label>
              <q-item-label caption>
                <q-badge 
                  :color="getReadingTypeColor(reading.type)" 
                  :label="reading.type"
                  outline
                />
              </q-item-label>
            </q-item-section>
          </q-item>
          
          <q-separator />
        </template>
      </q-list>

      <!-- Empty State -->
      <div v-if="filteredReadings.length === 0" class="text-center q-pa-xl">
        <q-icon name="history" size="64px" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">No readings found</div>
        <div class="text-body2 text-grey-5">Your reading history will appear here</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedMeter = ref('all');

// Mock data - will be replaced with API calls
const readings = ref([
  { id: 1, meterType: 'water', meterNumber: 'WM-12345678', value: '00046580', date: '2024-11-25', type: 'actual' },
  { id: 2, meterType: 'electricity', meterNumber: 'EM-654321', value: '012900', date: '2024-11-25', type: 'actual' },
  { id: 3, meterType: 'water', meterNumber: 'WM-12345678', value: '00046120', date: '2024-11-15', type: 'actual' },
  { id: 4, meterType: 'electricity', meterNumber: 'EM-654321', value: '012620', date: '2024-11-15', type: 'actual' },
  { id: 5, meterType: 'water', meterNumber: 'WM-12345678', value: '00045230', date: '2024-11-01', type: 'opening' },
  { id: 6, meterType: 'electricity', meterNumber: 'EM-654321', value: '012340', date: '2024-11-01', type: 'opening' },
  { id: 7, meterType: 'water', meterNumber: 'WM-12345678', value: '00044890', date: '2024-10-15', type: 'actual' },
  { id: 8, meterType: 'electricity', meterNumber: 'EM-654321', value: '012080', date: '2024-10-15', type: 'actual' },
]);

const filteredReadings = computed(() => {
  if (selectedMeter.value === 'all') {
    return readings.value;
  }
  return readings.value.filter(r => r.meterType === selectedMeter.value);
});

const groupedReadings = computed(() => {
  const groups = {};
  filteredReadings.value.forEach(reading => {
    if (!groups[reading.date]) {
      groups[reading.date] = [];
    }
    groups[reading.date].push(reading);
  });
  return groups;
});

const formatDateHeader = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getReadingTypeColor = (type) => {
  switch (type) {
    case 'actual': return 'positive';
    case 'estimated': return 'warning';
    case 'opening': return 'info';
    case 'closing': return 'primary';
    default: return 'grey';
  }
};
</script>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
}
</style>





