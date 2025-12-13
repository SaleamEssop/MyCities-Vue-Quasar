<template>
  <div class="reading-entry-panel">
    <!-- Admin Toolbar (only in admin mode) -->
    <AdminReadingToolbar 
      v-if="mode === 'admin'"
      :selected-reading-id="selectedReadingId"
      @add="$emit('admin-add')"
      @edit="$emit('admin-edit', selectedReadingId)"
      @delete="$emit('admin-delete', selectedReadingId)"
      @recompute="$emit('admin-recompute')"
      @view-json="$emit('admin-view-json')"
      @audit-log="$emit('admin-audit-log')"
    />

    <!-- Meter Type Header -->
    <div class="row items-center justify-center q-mb-md">
      <div 
        class="meter-type-icon q-mr-sm"
        :class="meterTypeClass"
      >
        <q-icon :name="meterIcon" size="md" color="white" />
      </div>
      <span class="text-h5 text-weight-bold">{{ meterTypeLabel }}</span>
    </div>

    <!-- Tab Navigation -->
    <div class="row justify-center q-mb-md">
      <q-btn-toggle
        v-model="activeTab"
        flat
        toggle-color="primary"
        :options="[
          { label: 'Enter reading', value: 'enter' },
          { label: 'Show Details', value: 'details' }
        ]"
      />
    </div>

    <!-- Enter Reading Tab -->
    <div v-if="activeTab === 'enter'" class="q-px-md">
      <!-- Meter Number -->
      <div class="text-center q-mb-md">
        <div class="text-body1 text-grey-8">Meter Number #{{ meterNumber }}</div>
      </div>

      <!-- Reading History -->
      <div class="reading-history q-mb-md">
        <ReadingHistoryRow
          v-for="(reading, index) in displayedReadings"
          :key="reading.id || index"
          :label="reading.label"
          :date="reading.date"
          :reading="reading.value"
          :reading-type="reading.type"
          :can-edit="reading.canEdit"
          :mode="mode"
          :class="{ 'bg-blue-1': selectedReadingId === reading.id }"
          @click="selectReading(reading)"
          @edit="$emit('edit-reading', reading)"
        />
      </div>

      <!-- Add New Reading Link -->
      <div class="text-center q-mb-md">
        <a 
          href="#" 
          class="text-primary text-body2"
          @click.prevent="showInput = true"
        >
          Add new reading
        </a>
      </div>

      <!-- Cooldown Warning -->
      <CooldownWarning
        :show="isCooldownActive && showInput"
        :seconds-remaining="cooldownSecondsRemaining"
        :mode="mode"
        @override="handleCooldownOverride"
      />

      <!-- Reading Input (when not in cooldown or admin override) -->
      <div v-if="showInput && (!isCooldownActive || mode === 'admin')" class="q-mb-md">
        <div class="text-center q-mb-md">
          <MeterDigitDisplay
            :value="inputValue"
            :meter-type="meterType"
            :is-input="true"
          />
        </div>

        <!-- Hidden Input for capturing keyboard -->
        <q-input
          v-model="inputValue"
          type="number"
          outlined
          dense
          class="hidden-input"
          :maxlength="meterType === 'water' ? 8 : 6"
          autofocus
          @keyup.enter="submitReading"
        />

        <!-- Submit Button -->
        <div class="text-center q-mt-md">
          <q-btn
            color="primary"
            label="UPDATE"
            class="full-width"
            style="max-width: 300px;"
            :loading="submitting"
            :disable="!canSubmit"
            @click="submitReading"
          />
        </div>
      </div>
    </div>

    <!-- Details Tab -->
    <div v-if="activeTab === 'details'" class="q-px-md">
      <MeterUsageCard
        :meter-type="meterType"
        :daily-usage="dailyUsage"
        :total-usage="totalUsage"
        :daily-cost="dailyCost"
        :line-items="lineItems"
        :projected-charges="projectedCharges"
        :mode="mode"
        :expanded="true"
        @enter-reading="activeTab = 'enter'"
        @view-history="$emit('view-history')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import AdminReadingToolbar from "./AdminReadingToolbar.vue";
import ReadingHistoryRow from "./ReadingHistoryRow.vue";
import CooldownWarning from "./CooldownWarning.vue";
import MeterDigitDisplay from "./MeterDigitDisplay.vue";
import MeterUsageCard from "./MeterUsageCard.vue";

const props = defineProps({
  // Meter info
  meterId: { type: [Number, String], required: true },
  meterNumber: { type: String, default: "" },
  meterType: { type: String, default: "water" }, // "water" | "electricity"
  
  // Readings
  readings: { 
    type: Array, 
    default: () => [] 
    // [{ id, label, date, value, type, canEdit }]
  },
  
  // Cooldown
  cooldownSecondsRemaining: { type: Number, default: 0 },
  
  // Usage & Cost (for details tab)
  dailyUsage: { type: [Number, String], default: 0 },
  totalUsage: { type: [Number, String], default: 0 },
  dailyCost: { type: Number, default: 0 },
  lineItems: { type: Array, default: () => [] },
  projectedCharges: { type: Number, default: 0 },
  
  // Mode
  mode: { type: String, default: "user" }, // "user" | "admin"
  
  // State
  submitting: { type: Boolean, default: false },
});

const emit = defineEmits([
  "submit-reading",
  "edit-reading",
  "view-history",
  "admin-add",
  "admin-edit",
  "admin-delete",
  "admin-recompute",
  "admin-view-json",
  "admin-audit-log",
  "cooldown-override",
]);

const activeTab = ref("enter");
const inputValue = ref("");
const showInput = ref(false);
const selectedReadingId = ref(null);
const cooldownOverridden = ref(false);

// Computed
const meterTypeLabel = computed(() => {
  return props.meterType === "water" ? "Water" : "Electricity";
});

const meterIcon = computed(() => {
  return props.meterType === "water" ? "water_drop" : "bolt";
});

const meterTypeClass = computed(() => {
  return props.meterType === "water" ? "bg-cyan" : "bg-amber-8";
});

const isCooldownActive = computed(() => {
  if (cooldownOverridden.value) return false;
  return props.cooldownSecondsRemaining > 0;
});

const displayedReadings = computed(() => {
  return props.readings.slice(0, 5); // Show last 5 readings
});

const canSubmit = computed(() => {
  const value = String(inputValue.value).replace(/\D/g, "");
  const requiredDigits = props.meterType === "water" ? 4 : 3; // Minimum digits
  return value.length >= requiredDigits;
});

// Methods
const selectReading = (reading) => {
  if (props.mode === "admin") {
    selectedReadingId.value = selectedReadingId.value === reading.id ? null : reading.id;
  }
};

const handleCooldownOverride = () => {
  cooldownOverridden.value = true;
  emit("cooldown-override");
};

const submitReading = () => {
  if (!canSubmit.value) return;
  
  emit("submit-reading", {
    meterId: props.meterId,
    value: inputValue.value,
    meterType: props.meterType,
  });
};

// Reset input when readings change
watch(() => props.readings, () => {
  inputValue.value = "";
  showInput.value = false;
}, { deep: true });
</script>

<style scoped>
.reading-entry-panel {
  background: white;
  padding: 16px 0;
}

.meter-type-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reading-history {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
}

.hidden-input {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}

.hidden-input :deep(.q-field__control) {
  height: 0;
  min-height: 0;
}
</style>





