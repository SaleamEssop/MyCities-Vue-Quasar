<template>
  <q-page class="bg-grey-2">
    <div class="container q-pa-md">
      <!-- Current Bill -->
      <div class="text-h6 q-mb-sm">Current Bill</div>
      
      <BillCard
        :water-charges="currentBill.waterCharges"
        :electricity-charges="currentBill.electricityCharges"
        :fixed-charges="currentBill.fixedCharges"
        :vat="currentBill.vat"
        :total="currentBill.total"
        :period-start="currentBill.periodStart"
        :period-end="currentBill.periodEnd"
        :due-date="currentBill.dueDate"
        :is-projected="!currentBill.finalized"
        mode="user"
        class="q-mb-lg"
      />

      <!-- Bill History -->
      <div class="text-h6 q-mb-sm">Previous Bills</div>
      
      <q-list class="bg-white rounded-borders">
        <q-item
          v-for="bill in billHistory"
          :key="bill.id"
          clickable
          @click="viewBillDetails(bill)"
        >
          <q-item-section avatar>
            <q-icon 
              :name="bill.paid ? 'check_circle' : 'schedule'" 
              :color="bill.paid ? 'positive' : 'warning'"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ bill.periodLabel }}</q-item-label>
            <q-item-label caption>Due: {{ formatDate(bill.dueDate) }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="text-weight-bold">R {{ bill.total.toFixed(2) }}</q-item-label>
            <q-badge 
              :color="bill.paid ? 'positive' : 'warning'" 
              :label="bill.paid ? 'Paid' : 'Pending'"
            />
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BillCard from 'src/components/ui/BillCard.vue';

const router = useRouter();

// Mock data - will be replaced with API calls
const currentBill = ref({
  waterCharges: 675.00,
  electricityCharges: 1680.00,
  fixedCharges: 150.00,
  vat: 375.75,
  total: 2880.75,
  periodStart: '2024-11-01',
  periodEnd: '2024-11-30',
  dueDate: '2024-12-15',
  finalized: false,
});

const billHistory = ref([
  { 
    id: 1, 
    periodLabel: 'October 2024', 
    dueDate: '2024-11-15', 
    total: 2650.50, 
    paid: true 
  },
  { 
    id: 2, 
    periodLabel: 'September 2024', 
    dueDate: '2024-10-15', 
    total: 2480.00, 
    paid: true 
  },
  { 
    id: 3, 
    periodLabel: 'August 2024', 
    dueDate: '2024-09-15', 
    total: 2920.25, 
    paid: true 
  },
  { 
    id: 4, 
    periodLabel: 'July 2024', 
    dueDate: '2024-08-15', 
    total: 2150.00, 
    paid: true 
  },
]);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const viewBillDetails = (bill) => {
  router.push({ name: 'user-bill-details', params: { billId: bill.id } });
};
</script>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
}
</style>


