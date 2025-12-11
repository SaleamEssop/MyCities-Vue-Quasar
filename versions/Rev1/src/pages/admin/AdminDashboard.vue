<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Admin Dashboard</div>
    
    <div class="row q-col-gutter-md">
      <!-- Quick Stats -->
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Total Accounts</div>
            <div class="text-h4 text-primary">{{ stats.totalAccounts }}</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Readings Today</div>
            <div class="text-h4 text-positive">{{ stats.readingsToday }}</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Pending Bills</div>
            <div class="text-h4 text-warning">{{ stats.pendingBills }}</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Admin Actions</div>
            <div class="text-h4 text-deep-purple">{{ stats.adminActions }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="q-mt-lg">
      <div class="text-subtitle1 q-mb-sm">Quick Actions</div>
      <div class="row q-gutter-md">
        <q-btn 
          color="primary" 
          icon="speed" 
          label="Manage Readings"
          :to="{ name: 'admin-readings' }"
        />
        <q-btn 
          color="secondary" 
          icon="receipt_long" 
          label="View Billing"
          :to="{ name: 'admin-billing' }"
        />
        <q-btn 
          outline 
          color="primary" 
          icon="price_change" 
          label="Tariff Settings"
          :to="{ name: 'admin-tariffs' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const stats = ref({
  totalAccounts: 156,
  readingsToday: 23,
  pendingBills: 12,
  adminActions: 8,
});
</script>



