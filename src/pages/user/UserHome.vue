<template>
  <q-page class="bg-grey-2">
    <div class="container q-pa-md">
      <!-- Account Header -->
      <BillHeader
        :account-number="account.number"
        :period-start="billPeriod.start"
        :period-end="billPeriod.end"
        :due-date="billPeriod.dueDate"
        :status="billPeriod.status"
      />

      <!-- Quick Actions -->
      <div class="row q-gutter-sm q-mb-md">
        <div class="col">
          <q-card flat class="action-card text-center q-pa-md" @click="goToReadings">
            <q-icon name="speed" size="32px" color="primary" />
            <div class="text-body2 q-mt-sm">Enter Readings</div>
          </q-card>
        </div>
        <div class="col">
          <q-card flat class="action-card text-center q-pa-md" @click="goToBills">
            <q-icon name="receipt" size="32px" color="primary" />
            <div class="text-body2 q-mt-sm">View Bills</div>
          </q-card>
        </div>
        <div class="col">
          <q-card flat class="action-card text-center q-pa-md" @click="goToHistory">
            <q-icon name="history" size="32px" color="primary" />
            <div class="text-body2 q-mt-sm">History</div>
          </q-card>
        </div>
      </div>

      <!-- Meters Summary -->
      <div class="text-h6 q-mb-sm">Your Meters</div>
      
      <MeterUsageCard
        v-for="meter in meters"
        :key="meter.id"
        :meter-type="meter.type"
        :daily-usage="meter.dailyUsage"
        :total-usage="meter.totalUsage"
        :daily-cost="meter.dailyCost"
        :projected-charges="meter.projectedCharges"
        :last-reading-date="meter.lastReadingDate"
        mode="user"
        class="q-mb-md"
        @enter-reading="goToMeterReading(meter)"
      />

      <!-- Projected Bill Summary -->
      <BillCard
        :water-charges="projectedBill.waterCharges"
        :electricity-charges="projectedBill.electricityCharges"
        :fixed-charges="projectedBill.fixedCharges"
        :vat="projectedBill.vat"
        :total="projectedBill.total"
        :is-projected="true"
        mode="user"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BillHeader from 'src/components/ui/BillHeader.vue';
import MeterUsageCard from 'src/components/ui/MeterUsageCard.vue';
import BillCard from 'src/components/ui/BillCard.vue';

const router = useRouter();

// Mock data - will be replaced with API calls
const account = ref({
  number: 'ACC-2024-001',
  name: 'John Doe',
});

const billPeriod = ref({
  start: '2024-11-01',
  end: '2024-11-30',
  dueDate: '2024-12-15',
  status: 'current',
});

const meters = ref([
  {
    id: 1,
    type: 'water',
    number: 'WM-12345678',
    dailyUsage: 450,
    totalUsage: 13500,
    dailyCost: 22.50,
    projectedCharges: 675.00,
    lastReadingDate: '2024-11-25',
  },
  {
    id: 2,
    type: 'electricity',
    number: 'EM-654321',
    dailyUsage: 28,
    totalUsage: 840,
    dailyCost: 56.00,
    projectedCharges: 1680.00,
    lastReadingDate: '2024-11-25',
  },
]);

const projectedBill = ref({
  waterCharges: 675.00,
  electricityCharges: 1680.00,
  fixedCharges: 150.00,
  vat: 375.75,
  total: 2880.75,
});

const goToReadings = () => router.push({ name: 'user-readings' });
const goToBills = () => router.push({ name: 'user-bills' });
const goToHistory = () => router.push({ name: 'user-history' });
const goToMeterReading = (meter) => router.push({ name: 'user-meter-reading', params: { meterId: meter.id } });
</script>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
}

.action-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 12px;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>


