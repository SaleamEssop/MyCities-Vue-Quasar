<template>
  <q-page class="bg-grey-2">
    <div class="container">
      <!-- Bill Period Header -->
      <BillHeader
        :account-number="account.number"
        :period-start="billPeriod.start"
        :period-end="billPeriod.end"
        :due-date="billPeriod.dueDate"
        :status="billPeriod.status"
        class="q-px-md q-pt-md"
      />

      <!-- Meter Selector Tabs -->
      <q-tabs
        v-model="selectedMeterType"
        class="bg-white q-mt-md"
        active-color="primary"
        indicator-color="primary"
        align="center"
      >
        <q-tab name="water" icon="water_drop" label="Water" />
        <q-tab name="electricity" icon="bolt" label="Electricity" />
      </q-tabs>

      <!-- Reading Entry Panel -->
      <ReadingEntryPanel
        :meter-id="selectedMeter.id"
        :meter-number="selectedMeter.number"
        :meter-type="selectedMeterType"
        :readings="selectedMeter.readings"
        :cooldown-seconds-remaining="cooldownSeconds"
        :daily-usage="selectedMeter.dailyUsage"
        :total-usage="selectedMeter.totalUsage"
        :daily-cost="selectedMeter.dailyCost"
        :line-items="selectedMeter.lineItems"
        :projected-charges="selectedMeter.projectedCharges"
        :submitting="isSubmitting"
        mode="user"
        class="q-mt-md"
        @submit-reading="handleSubmitReading"
        @view-history="goToHistory"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BillHeader from 'src/components/ui/BillHeader.vue';
import ReadingEntryPanel from 'src/components/ui/ReadingEntryPanel.vue';

const router = useRouter();

// Mock data - will be replaced with API calls
const account = ref({
  number: 'ACC-2024-001',
});

const billPeriod = ref({
  start: '2024-11-01',
  end: '2024-11-30',
  dueDate: '2024-12-15',
  status: 'current',
});

const selectedMeterType = ref('water');
const isSubmitting = ref(false);
const cooldownSeconds = ref(0);

const meters = ref({
  water: {
    id: 1,
    number: 'WM-12345678',
    readings: [
      { id: 1, label: 'Opening', date: '2024-11-01', value: '00045230', type: 'actual', canEdit: false },
      { id: 2, label: 'Previous', date: '2024-11-15', value: '00046120', type: 'actual', canEdit: false },
      { id: 3, label: 'Current', date: '2024-11-25', value: '00046580', type: 'actual', canEdit: true },
    ],
    dailyUsage: 450,
    totalUsage: 13500,
    dailyCost: 22.50,
    projectedCharges: 675.00,
    lineItems: [
      { label: 'Water consumption (0-6kL)', amount: 120.00 },
      { label: 'Water consumption (6-10kL)', amount: 180.00 },
      { label: 'Water consumption (>10kL)', amount: 275.00 },
      { label: 'Sewerage', amount: 100.00 },
    ],
  },
  electricity: {
    id: 2,
    number: 'EM-654321',
    readings: [
      { id: 10, label: 'Opening', date: '2024-11-01', value: '012340', type: 'actual', canEdit: false },
      { id: 11, label: 'Previous', date: '2024-11-15', value: '012620', type: 'actual', canEdit: false },
      { id: 12, label: 'Current', date: '2024-11-25', value: '012900', type: 'actual', canEdit: true },
    ],
    dailyUsage: 28,
    totalUsage: 840,
    dailyCost: 56.00,
    projectedCharges: 1680.00,
    lineItems: [
      { label: 'Electricity units (840 kWh @ R2.00)', amount: 1680.00 },
    ],
  },
});

const selectedMeter = computed(() => {
  return meters.value[selectedMeterType.value];
});

const handleSubmitReading = async (data) => {
  isSubmitting.value = true;
  try {
    // TODO: Call API to submit reading
    console.log('Submitting reading:', data);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
    
    // After submission, start cooldown
    cooldownSeconds.value = 86400; // 24 hours
  } catch (error) {
    console.error('Failed to submit reading:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const goToHistory = () => {
  router.push({ name: 'user-history' });
};
</script>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: white;
}
</style>


