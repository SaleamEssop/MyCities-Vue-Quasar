<template>
  <q-card flat bordered class="bill-card">
    <q-card-section>
      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle1 text-weight-bold">
          {{ isProjected ? 'Projected Bill' : 'Bill Summary' }}
        </div>
        <q-badge 
          :color="isProjected ? 'warning' : 'positive'" 
          text-color="white"
        >
          {{ isProjected ? 'Projected' : 'Final' }}
        </q-badge>
      </div>

      <!-- Period (if provided) -->
      <div v-if="periodStart && periodEnd" class="text-body2 text-grey-7 q-mb-md">
        Period: {{ formatDate(periodStart) }} - {{ formatDate(periodEnd) }}
      </div>

      <!-- Charges Breakdown -->
      <div class="charges-list">
        <!-- Water -->
        <div class="row items-center justify-between q-py-sm">
          <div class="row items-center">
            <q-avatar size="28px" color="cyan" text-color="white" class="q-mr-sm">
              <q-icon name="water_drop" size="16px" />
            </q-avatar>
            <span class="text-body2">Water</span>
          </div>
          <span class="text-body2 text-weight-medium">R {{ formatAmount(waterCharges) }}</span>
        </div>

        <!-- Electricity -->
        <div class="row items-center justify-between q-py-sm">
          <div class="row items-center">
            <q-avatar size="28px" color="amber-8" text-color="white" class="q-mr-sm">
              <q-icon name="bolt" size="16px" />
            </q-avatar>
            <span class="text-body2">Electricity</span>
          </div>
          <span class="text-body2 text-weight-medium">R {{ formatAmount(electricityCharges) }}</span>
        </div>

        <!-- Fixed Charges -->
        <div class="row items-center justify-between q-py-sm">
          <div class="row items-center">
            <q-avatar size="28px" color="grey-6" text-color="white" class="q-mr-sm">
              <q-icon name="receipt_long" size="16px" />
            </q-avatar>
            <span class="text-body2">Fixed Charges</span>
          </div>
          <span class="text-body2 text-weight-medium">R {{ formatAmount(fixedCharges) }}</span>
        </div>

        <q-separator class="q-my-sm" />

        <!-- Subtotal -->
        <div class="row items-center justify-between q-py-xs">
          <span class="text-body2 text-grey-7">Subtotal</span>
          <span class="text-body2">R {{ formatAmount(subtotal) }}</span>
        </div>

        <!-- VAT -->
        <div class="row items-center justify-between q-py-xs">
          <span class="text-body2 text-grey-7">VAT (15%)</span>
          <span class="text-body2">R {{ formatAmount(vat) }}</span>
        </div>

        <q-separator class="q-my-sm" />

        <!-- Total -->
        <div class="row items-center justify-between q-py-sm">
          <span class="text-subtitle1 text-weight-bold">Total</span>
          <span class="text-h5 text-primary text-weight-bold">R {{ formatAmount(total) }}</span>
        </div>
      </div>

      <!-- Due Date (if provided) -->
      <div v-if="dueDate" class="text-center q-mt-md">
        <div class="text-caption text-grey-7">Due Date</div>
        <div class="text-body1 text-weight-medium">{{ formatDate(dueDate) }}</div>
      </div>

      <!-- Admin Actions -->
      <div v-if="mode === 'admin'" class="q-mt-md">
        <q-separator class="q-mb-md" />
        <div class="row q-gutter-sm">
          <q-btn 
            flat 
            dense 
            color="primary" 
            icon="calculate" 
            label="Recompute"
            @click="$emit('recompute')"
          />
          <q-btn 
            flat 
            dense 
            color="primary" 
            icon="code" 
            label="View JSON"
            @click="$emit('view-json')"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  waterCharges: { type: Number, default: 0 },
  electricityCharges: { type: Number, default: 0 },
  fixedCharges: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  periodStart: { type: String, default: "" },
  periodEnd: { type: String, default: "" },
  dueDate: { type: String, default: "" },
  isProjected: { type: Boolean, default: true },
  mode: { type: String, default: "user" }, // "user" | "admin"
});

defineEmits(["recompute", "view-json"]);

const subtotal = computed(() => {
  return props.waterCharges + props.electricityCharges + props.fixedCharges;
});

const formatAmount = (amount) => {
  return Number(amount).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<style scoped>
.bill-card {
  border-radius: 12px;
}

.charges-list {
  background: #fafafa;
  border-radius: 8px;
  padding: 8px 12px;
}
</style>
