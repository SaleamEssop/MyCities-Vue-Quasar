<template>
  <q-page class="bg-grey-2">
    <!-- Bill Header -->
    <BillHeader
      :current-date="currentDate"
      :deadline-date="deadlineDate"
      :period-start="periodStart"
      :period-end="periodEnd"
      :show-total="false"
      title="ENTER READINGS"
      mode="admin"
      @prev="navigatePeriod('prev')"
      @next="navigatePeriod('next')"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="50px" />
    </div>

    <!-- No Account Selected -->
    <div v-else-if="!selectedAccount" class="q-pa-md">
      <q-card flat bordered class="q-pa-md text-center">
        <q-icon name="account_circle" size="64px" color="grey-5" />
        <div class="text-h6 q-mt-md">Select an Account</div>
        <div class="text-body2 text-grey-7 q-mb-md">
          Choose an account to view and manage readings
        </div>
        
        <!-- Account Selector -->
        <q-select
          v-model="selectedAccountId"
          :options="accountOptions"
          option-value="id"
          option-label="label"
          label="Select Account"
          outlined
          emit-value
          map-options
          class="q-mb-md"
          style="max-width: 400px; margin: 0 auto;"
          @update:model-value="onAccountSelected"
        />
      </q-card>
    </div>

    <!-- Meters List -->
    <div v-else class="q-pa-md">
      <!-- Account Info Card -->
      <q-card flat bordered class="q-mb-md q-pa-sm">
        <div class="row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-weight-medium">{{ selectedAccount.number }}</div>
            <div class="text-caption text-grey-7">{{ selectedAccount.title }}</div>
          </div>
          <q-btn 
            flat 
            dense 
            color="primary" 
            label="Change Account"
            @click="selectedAccountId = null"
          />
        </div>
      </q-card>

      <!-- Meter Reading Panels -->
      <div v-for="meter in meters" :key="meter.id" class="q-mb-lg">
        <q-card flat bordered>
          <q-card-section>
            <ReadingEntryPanel
              :meter-id="meter.id"
              :meter-number="meter.number"
              :meter-type="getMeterType(meter)"
              :readings="getMeterReadings(meter.id)"
              :cooldown-seconds-remaining="getCooldownSeconds(meter.id)"
              :daily-usage="getMeterDailyUsage(meter.id)"
              :total-usage="getMeterTotalUsage(meter.id)"
              :daily-cost="getMeterDailyCost(meter.id)"
              :line-items="getMeterLineItems(meter.id)"
              :projected-charges="getMeterProjectedCharges(meter.id)"
              :submitting="submittingReadingId === meter.id"
              mode="admin"
              @submit-reading="handleSubmitReading"
              @edit-reading="handleEditReading"
              @view-history="handleViewHistory(meter)"
              @admin-add="handleAdminAdd(meter)"
              @admin-edit="handleAdminEdit"
              @admin-delete="handleAdminDelete"
              @admin-recompute="handleAdminRecompute"
              @admin-view-json="handleViewJson(meter)"
              @admin-audit-log="handleAuditLog(meter)"
              @cooldown-override="handleCooldownOverride(meter)"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- No Meters -->
      <div v-if="meters.length === 0" class="text-center q-pa-xl">
        <q-icon name="speed" size="64px" color="grey-5" />
        <div class="text-h6 q-mt-md text-grey-7">No meters found</div>
        <div class="text-body2 text-grey-6">This account has no meters configured</div>
      </div>
    </div>

    <!-- Edit Reading Modal -->
    <q-dialog v-model="showEditModal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Edit Reading</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editingReading.value"
            label="Reading Value"
            type="number"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="editingReading.reason"
            label="Reason for Edit"
            type="textarea"
            outlined
            hint="Required for audit trail"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn 
            color="primary" 
            label="Save" 
            :loading="saving"
            @click="saveEditedReading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Modal -->
    <q-dialog v-model="showDeleteModal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="md" class="q-mr-sm" />
          <div class="text-h6">Delete Reading</div>
        </q-card-section>

        <q-card-section>
          <div class="text-body1 q-mb-md">
            Are you sure you want to delete this reading? This action will be logged.
          </div>
          <q-input
            v-model="deleteReason"
            label="Reason for Deletion"
            type="textarea"
            outlined
            hint="Required for audit trail"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn 
            color="negative" 
            label="Delete" 
            :loading="deleting"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- JSON Viewer Modal -->
    <q-dialog v-model="showJsonModal" full-width>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Raw JSON Data</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <pre class="bg-grey-2 q-pa-md" style="overflow: auto; max-height: 60vh;">{{ jsonData }}</pre>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Reading Modal -->
    <q-dialog v-model="showAddModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Add New Reading (Admin)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newReading.value"
            label="Reading Value"
            type="text"
            outlined
            class="q-mb-md"
            hint="Enter the meter reading value"
          />
          
          <q-input
            v-model="newReading.date"
            label="Reading Date"
            type="date"
            outlined
            class="q-mb-md"
          />
          
          <q-checkbox
            v-model="newReading.is_rollover"
            label="Mark as rollover reading"
            class="q-mb-md"
          />
          
          <q-input
            v-model="newReading.reason"
            label="Reason for Adding"
            type="textarea"
            outlined
            hint="Required for audit trail"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn 
            color="primary" 
            label="Add Reading" 
            :loading="adding"
            @click="submitNewReading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { useSiteStore } from "src/stores/site";
import { useAccountStore } from "src/stores/account";
import { useMeterStore } from "src/stores/meter";
import { useReadingStore } from "src/stores/reading";
import { fetchAndSaveMeterOnAccount } from "src/boot/axios";
import billingApi from "src/services/billingApi";
import adminApi from "src/services/adminApi";

// Shared UI Components
import { BillHeader, ReadingEntryPanel } from "src/components/ui";

const $q = useQuasar();

// Stores
const siteStore = useSiteStore();
const accountStore = useAccountStore();
const meterStore = useMeterStore();
const readingStore = useReadingStore();

// State
const loading = ref(false);
const selectedAccountId = ref(null);
const submittingReadingId = ref(null);
const currentDate = ref(new Date());
const deadlineDate = ref(new Date(Date.now() + 17 * 24 * 60 * 60 * 1000));
const periodStart = ref("10 Apr 2025");
const periodEnd = ref("10 May 2025");

// Modal State
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showJsonModal = ref(false);
const showAddModal = ref(false);
const editingReading = ref({ id: null, value: "", reason: "" });
const deleteReason = ref("");
const deletingReadingId = ref(null);
const newReading = ref({ 
  meter_id: null, 
  value: "", 
  date: new Date().toISOString().split('T')[0], 
  reason: "",
  is_rollover: false 
});
const saving = ref(false);
const deleting = ref(false);
const adding = ref(false);
const jsonData = ref("");

// Computed
const allAccounts = computed(() => {
  const accounts = [];
  siteStore.allSites.forEach(site => {
    const siteAccounts = accountStore.getAccountsById(site.id);
    siteAccounts.forEach(acc => {
      accounts.push({
        ...acc,
        siteName: site.address
      });
    });
  });
  return accounts;
});

const accountOptions = computed(() => {
  return allAccounts.value.map(acc => ({
    id: acc.id,
    label: `${acc.number} - ${acc.title} (${acc.siteName})`
  }));
});

const selectedAccount = computed(() => {
  if (!selectedAccountId.value) return null;
  return allAccounts.value.find(a => a.id === selectedAccountId.value);
});

const meters = computed(() => {
  if (!selectedAccountId.value) return [];
  return meterStore.getByAccuntId(selectedAccountId.value);
});

// Methods
const getMeterType = (meter) => {
  // meter.type.id: 1 = water, 2 = electricity
  return meter.type?.id === 1 ? "water" : "electricity";
};

const getMeterReadings = (meterId) => {
  const readings = readingStore.getReadingsByMeterId(meterId);
  return readings.map((r, index) => ({
    id: r.id,
    label: index === 0 ? "Start Reading" : "Reading",
    date: new Date(r.time),
    value: r.valueInString || r.value,
    type: r.isSubmit ? "Final" : "Estimated",
    canEdit: true, // Admin can edit all
  })).slice(0, 5);
};

const getCooldownSeconds = (meterId) => {
  const readings = readingStore.getReadingsByMeterId(meterId);
  if (readings.length === 0) return 0;
  
  const lastReading = readings[0];
  const timeSince = Date.now() - lastReading.time;
  const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours
  const remaining = cooldownMs - timeSince;
  
  return Math.max(0, Math.floor(remaining / 1000));
};

const getMeterDailyUsage = (meterId) => {
  // TODO: Calculate from readings
  return "1290";
};

const getMeterTotalUsage = (meterId) => {
  // TODO: Calculate from readings
  return "33.90";
};

const getMeterDailyCost = (meterId) => {
  // TODO: Get from billing API
  return 77.90;
};

const getMeterLineItems = (meterId) => {
  // TODO: Get from billing API
  return [
    { label: "Consumption Charges", amount: 1200.00 },
    { label: "Discharge charges", amount: 600.00 },
    { label: "Infrastructure Surcharge", amount: 200.00 },
  ];
};

const getMeterProjectedCharges = (meterId) => {
  // TODO: Get from billing API
  return 3000.00;
};

const onAccountSelected = async (accountId) => {
  if (!accountId) return;
  
  loading.value = true;
  try {
    await fetchAndSaveMeterOnAccount(accountId);
  } catch (e) {
    $q.notify({ message: "Failed to load meters", color: "negative" });
  } finally {
    loading.value = false;
  }
};

const navigatePeriod = (direction) => {
  // TODO: Implement period navigation
  $q.notify({ message: `Navigate ${direction}`, color: "info" });
};

// Reading Handlers
const handleSubmitReading = async (data) => {
  submittingReadingId.value = data.meterId;
  try {
    // TODO: Call API to submit reading
    $q.notify({ message: "Reading submitted (admin)", color: "positive" });
  } catch (e) {
    $q.notify({ message: "Failed to submit reading", color: "negative" });
  } finally {
    submittingReadingId.value = null;
  }
};

const handleEditReading = (reading) => {
  editingReading.value = {
    id: reading.id,
    value: reading.value,
    reason: ""
  };
  showEditModal.value = true;
};

const saveEditedReading = async () => {
  if (!editingReading.value.reason) {
    $q.notify({ message: "Please provide a reason for the edit", color: "warning" });
    return;
  }
  
  saving.value = true;
  try {
    const result = await adminApi.editReading(editingReading.value.id, {
      value: editingReading.value.value,
      reason: editingReading.value.reason,
    });
    
    if (result.status) {
      $q.notify({ message: "Reading updated successfully", color: "positive" });
      showEditModal.value = false;
      // Refresh meter readings
      if (selectedAccountId.value) {
        await fetchAndSaveMeterOnAccount(selectedAccountId.value);
      }
    } else {
      $q.notify({ message: result.error || "Failed to update reading", color: "negative" });
    }
  } catch (e) {
    $q.notify({ message: "Failed to update reading: " + e.message, color: "negative" });
  } finally {
    saving.value = false;
  }
};

const handleViewHistory = (meter) => {
  $q.notify({ message: `View history for meter ${meter.number}`, color: "info" });
};

// Admin Action Handlers
const handleAdminAdd = (meter) => {
  newReading.value = {
    meter_id: meter.id,
    value: "",
    date: new Date().toISOString().split('T')[0],
    reason: "",
    is_rollover: false,
  };
  showAddModal.value = true;
};

const submitNewReading = async () => {
  if (!newReading.value.reason) {
    $q.notify({ message: "Please provide a reason for adding", color: "warning" });
    return;
  }
  if (!newReading.value.value) {
    $q.notify({ message: "Please enter a reading value", color: "warning" });
    return;
  }
  
  adding.value = true;
  try {
    const result = await adminApi.addReading({
      meter_id: newReading.value.meter_id,
      meter_reading_date: newReading.value.date,
      meter_reading: newReading.value.value,
      reason: newReading.value.reason,
      is_rollover: newReading.value.is_rollover,
    });
    
    if (result.status) {
      $q.notify({ message: "Reading added successfully", color: "positive" });
      showAddModal.value = false;
      // Refresh meter readings
      if (selectedAccountId.value) {
        await fetchAndSaveMeterOnAccount(selectedAccountId.value);
      }
    } else {
      $q.notify({ message: result.error || "Failed to add reading", color: "negative" });
    }
  } catch (e) {
    $q.notify({ message: "Failed to add reading: " + e.message, color: "negative" });
  } finally {
    adding.value = false;
  }
};

const handleAdminEdit = (readingId) => {
  const reading = { id: readingId, value: "", reason: "" };
  editingReading.value = reading;
  showEditModal.value = true;
};

const handleAdminDelete = (readingId) => {
  deletingReadingId.value = readingId;
  deleteReason.value = "";
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!deleteReason.value) {
    $q.notify({ message: "Please provide a reason for deletion", color: "warning" });
    return;
  }
  
  deleting.value = true;
  try {
    const result = await adminApi.deleteReading(deletingReadingId.value, deleteReason.value);
    
    if (result.status) {
      $q.notify({ message: "Reading deleted successfully", color: "positive" });
      showDeleteModal.value = false;
      // Refresh meter readings
      if (selectedAccountId.value) {
        await fetchAndSaveMeterOnAccount(selectedAccountId.value);
      }
    } else {
      $q.notify({ message: result.error || "Failed to delete reading", color: "negative" });
    }
  } catch (e) {
    $q.notify({ message: "Failed to delete reading: " + e.message, color: "negative" });
  } finally {
    deleting.value = false;
  }
};

const handleAdminRecompute = async () => {
  if (!selectedAccountId.value) {
    $q.notify({ message: "Please select an account first", color: "warning" });
    return;
  }
  
  $q.loading.show({ message: "Recomputing bill..." });
  try {
    const result = await adminApi.recomputeAccountBill(selectedAccountId.value, "Admin recompute request");
    
    if (result.status) {
      $q.notify({ message: "Bill recomputed successfully", color: "positive" });
      // Refresh meter readings
      await fetchAndSaveMeterOnAccount(selectedAccountId.value);
    } else {
      $q.notify({ message: result.error || "Failed to recompute bill", color: "negative" });
    }
  } catch (e) {
    $q.notify({ message: "Failed to recompute bill: " + e.message, color: "negative" });
  } finally {
    $q.loading.hide();
  }
};

const handleViewJson = (meter) => {
  jsonData.value = JSON.stringify({
    meter: meter,
    readings: readingStore.getReadingsByMeterId(meter.id),
  }, null, 2);
  showJsonModal.value = true;
};

const handleAuditLog = (meter) => {
  $q.notify({ message: `View audit log for meter ${meter.number}`, color: "info" });
};

const handleCooldownOverride = (meter) => {
  $q.notify({ 
    message: `Cooldown overridden for meter ${meter.number}`, 
    color: "deep-purple" 
  });
};

// Lifecycle
onMounted(() => {
  // Auto-select first account if available
  if (accountOptions.value.length > 0) {
    // Don't auto-select, let admin choose
  }
});
</script>
