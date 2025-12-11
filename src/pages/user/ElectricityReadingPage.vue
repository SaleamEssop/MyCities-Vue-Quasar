<template>
  <q-page class="electricity-reading-page" data-test="electricity-reading-page">
    <!-- Header: Current Date -->
    <div class="header-bar">
      <span>Current date: {{ currentDate }}</span>
    </div>

    <!-- Navigation Row with Due Badge -->
    <div class="nav-row">
      <button class="nav-arrow" @click="goToPreviousPeriod">
        <span class="arrow-icon">◀</span>
      </button>
      
      <div class="due-badge">
        Final Reading due in {{ daysUntilDue }} days
      </div>
      
      <button class="nav-arrow" @click="goToNextPeriod">
        <span class="arrow-icon">▶</span>
      </button>
    </div>

    <!-- Title -->
    <div class="page-title">ENTER ELECTRICITY READING</div>
    <div class="period-text">Period - {{ periodStart }} to {{ periodEnd }}</div>

    <!-- Scrollable Content Area -->
    <div class="content-scroll" ref="contentScrollRef">
      <!-- Electricity Section -->
      <div class="meter-section" data-test="electricity-meter-section">
        <div class="meter-type-header">
          <q-icon name="bolt" size="24px" class="meter-icon" />
          <span class="meter-type-name">Electricity</span>
        </div>

        <div class="meter-number">Meter Number #{{ electricityMeterNumber }}</div>

        <!-- Reading History -->
        <div class="reading-history">
          <div class="reading-row">
            <span class="reading-label">Start Reading {{ electricityStartDate }}</span>
            <span class="reading-value">{{ electricityStartReading }}</span>
          </div>
        </div>

        <!-- Reading Date Selector -->
        <div class="date-selector-section">
          <label class="date-label">Reading Date:</label>
          <q-input
            v-model="readingDate"
            type="date"
            filled
            dense
            class="date-input"
            data-test="reading-date-input"
          />
        </div>

        <!-- Electricity Digit Input Display -->
        <div class="digit-input-section" ref="electricityDigitRef">
          <div class="digit-display-container">
            <div 
              class="digit-group black-group active"
              data-test="electricity-group"
            >
              <span class="digits black">{{ electricityDisplay }}</span>
              <span v-if="electricityValue === ''" class="cursor-blink">|</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Spacer for keypad -->
      <div class="keypad-spacer"></div>
    </div>

    <!-- Numeric Keypad (fixed at bottom) -->
    <div class="keypad-container" data-test="keypad">
      <div class="keypad-grid">
        <button 
          v-for="key in keypadKeys" 
          :key="key"
          class="keypad-btn"
          :class="{ 'clear-btn': key === 'clear' }"
          :data-test="`keypad-${key}`"
          @click="handleKeyPress(key)"
        >
          {{ key === 'backspace' ? '⌫' : key === 'clear' ? 'C' : key }}
        </button>
      </div>
      <div class="keypad-actions">
        <button class="action-btn cancel" @click="handleCancel" data-test="keypad-cancel">
          CANCEL
        </button>
        <button class="action-btn enter" @click="handleEnter" data-test="keypad-enter">
          ENTER
        </button>
      </div>
    </div>

    <!-- Back Button -->
    <div class="back-button-container">
      <q-btn 
        flat 
        color="primary" 
        label="Back" 
        icon="arrow_back" 
        @click="goBack"
        data-test="back-button"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import seedData from 'src/services/seedData';

const router = useRouter();
const $q = useQuasar();

// Refs for scrolling
const contentScrollRef = ref(null);
const electricityDigitRef = ref(null);

// State
const dashboardData = ref(null);

// Digit value
const electricityValue = ref('');

// Reading date - defaults to today
const readingDate = ref(new Date().toISOString().split('T')[0]);

// Keypad keys
const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'backspace'];

// Initialize seed data and load dashboard data
onMounted(() => {
  seedData.initializeSeedData();
  dashboardData.value = seedData.getDashboardData();
});

// Computed - Electricity meter data from seed
const electricityMeterNumber = computed(() => dashboardData.value?.electricity?.meterNumber || '98736');
const electricityStartDate = computed(() => {
  if (!dashboardData.value?.electricity?.startReading?.date) return '10th April';
  const date = new Date(dashboardData.value.electricity.startReading.date);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
});
const electricityStartReading = computed(() => {
  return dashboardData.value?.electricity?.startReading?.value || '763456';
});

// Computed - Period data
const currentDate = computed(() => {
  const today = new Date();
  return today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
});
const daysUntilDue = computed(() => dashboardData.value?.period?.daysUntilDue || 17);
const periodStart = computed(() => {
  if (!dashboardData.value?.period?.startDate) return '10 Apr 2025';
  const date = new Date(dashboardData.value.period.startDate);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
});
const periodEnd = computed(() => {
  if (!dashboardData.value?.period?.endDate) return '10 May 2025';
  const date = new Date(dashboardData.value.period.endDate);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
});

// Display computed - show 0 when cleared/empty, otherwise show value
const electricityDisplay = computed(() => electricityValue.value || '0');

// Methods
const goToPreviousPeriod = () => {
  console.log('Go to previous period');
};

const goToNextPeriod = () => {
  console.log('Go to next period');
};

const goBack = () => {
  router.back();
};

const handleKeyPress = (key) => {
  if (key === 'backspace') {
    handleBackspace();
  } else if (key === 'clear') {
    handleClear();
  } else if (key === '.') {
    return; // Skip decimal
  } else {
    handleDigitInput(key);
  }
};

const handleDigitInput = (digit) => {
  // Electricity - max 6 digits
  if (electricityValue.value.length < 6) {
    electricityValue.value += digit;
  }
};

const handleBackspace = () => {
  electricityValue.value = electricityValue.value.slice(0, -1);
};

const handleClear = () => {
  // Clear completely resets to display 0
  electricityValue.value = '';
};

const handleCancel = () => {
  electricityValue.value = '';
  router.back();
};

const handleEnter = () => {
  const reading = electricityDisplay.value;
  const kwh = parseInt(reading, 10);
  
  // Save the reading with selected date
  const currentPeriod = seedData.getCurrentBillingPeriod();
  seedData.saveElectricityReading({
    meterId: 'EM-98736',
    periodId: currentPeriod?.id || 'period-2025-04',
    value: reading,
    kwh,
    type: 'end',
    isEstimated: false,
    date: readingDate.value, // Include selected date
  });
  
  // Format date for display
  const displayDate = new Date(readingDate.value).toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
  
  $q.notify({
    type: 'positive',
    message: `Electricity reading saved: ${reading} on ${displayDate}`,
    position: 'top',
  });
  
  router.push({ name: 'home' });
};
</script>

<style lang="scss" scoped>
$primary: #3294B8;
$primary-dark: #2a7a9a;
$success: #4CAF50;
$header-bg: #E0E0E0;
$border: #e0e0e0;
$text-secondary: #666666;
$black: #000000;

.electricity-reading-page {
  background: #ffffff;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header-bar {
  background: $header-bg;
  color: $black;
  padding: 12px 16px;
  font-size: 14px;
  text-align: center;
}

.nav-row {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $header-bg;
  padding: 8px 16px;
  gap: 12px;
}

.nav-arrow {
  background: none;
  border: none;
  color: $black;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
  
  .arrow-icon {
    font-size: 16px;
  }
}

.due-badge {
  background: $success;
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: $primary;
  text-align: center;
  padding: 16px 0 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: $header-bg;
}

.period-text {
  font-size: 13px;
  color: $text-secondary;
  text-align: center;
  padding-bottom: 16px;
  background: $header-bg;
}

// Scrollable content area
.content-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.keypad-spacer {
  height: 320px; // Space for keypad + back button
}

.meter-section {
  padding: 16px;
}

.meter-type-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
  
  .meter-icon {
    color: orange;
  }
  
  .meter-type-name {
    font-size: 20px;
    font-weight: 600;
    color: $black;
  }
}

.meter-number {
  text-align: center;
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 12px;
}

.reading-history {
  margin-bottom: 12px;
}

.reading-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
  
  .reading-label {
    color: $text-secondary;
  }
  
  .reading-value {
    color: $black;
    font-weight: 500;
  }
}

// Date Selector Section
.date-selector-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 0;
  margin-bottom: 8px;
  background: #f9f9f9;
  border-radius: 8px;
  
  .date-label {
    font-size: 14px;
    font-weight: 500;
    color: $text-secondary;
  }
  
  .date-input {
    max-width: 180px;
  }
}

// Digit Input Section
.digit-input-section {
  padding: 20px 0;
}

.digit-display-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.digit-group {
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid $primary;
  background: rgba($primary, 0.05);
  min-width: 120px;
  text-align: center;
}

.digits {
  font-family: 'Roboto Mono', monospace;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 4px;
  
  &.black {
    color: $black;
  }
}

.cursor-blink {
  animation: blink 1s infinite;
  font-size: 32px;
  font-weight: 300;
  color: $black;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

// Keypad - fixed at bottom within phone container
.keypad-container {
  position: absolute;
  bottom: 48px; // Space for back button
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.keypad-btn {
  height: 52px;
  border: none;
  border-right: 1px solid $border;
  border-bottom: 1px solid $border;
  background: white;
  font-size: 22px;
  font-weight: 500;
  color: $black;
  cursor: pointer;
  
  &:nth-child(3n) {
    border-right: none;
  }
  
  &:active {
    background: #f0f0f0;
  }
  
  &.clear-btn {
    color: #cc0000;
    font-weight: 700;
  }
}

.keypad-actions {
  display: flex;
}

.action-btn {
  flex: 1;
  height: 48px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  
  &.cancel {
    background: $primary-dark;
  }
  
  &.enter {
    background: $primary;
  }
  
  &:active {
    opacity: 0.9;
  }
}

// Back button at bottom
.back-button-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid $border;
  padding: 4px 8px;
  z-index: 101;
}
</style>
