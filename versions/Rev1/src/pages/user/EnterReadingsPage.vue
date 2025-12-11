<template>
  <q-page class="enter-readings-page" data-test="enter-readings-page">
    <!-- Header: Current Date -->
    <div class="header-bar">
      <span>Current date: {{ currentDate }}</span>
    </div>

    <!-- Navigation Row with Due Badge -->
    <div class="nav-row">
      <button class="nav-arrow" @click="goBack">
        <q-icon name="chevron_left" />
      </button>
      
      <div class="due-badge">
        Final Reading due in {{ daysUntilDue }} days
      </div>
      
      <button class="nav-arrow" disabled>
        <q-icon name="chevron_right" />
      </button>
    </div>

    <!-- Title -->
    <div class="page-title">ENTER READINGS</div>
    <div class="period-text">Period - {{ periodStart }} to {{ periodEnd }}</div>

    <!-- Scrollable Content -->
    <div class="content-scroll">
      <!-- Water Section -->
      <div class="meter-section" data-test="water-meter-section">
        <div class="meter-type-header">
          <q-icon name="water_drop" size="24px" class="meter-icon water" />
          <span class="meter-type-name">Water</span>
        </div>

        <div class="meter-action-links">
          <a href="#" @click.prevent="activateMeter('water')" 
             :class="{ active: activeMeter === 'water' }">Enter reading</a>
          <a href="#" @click.prevent="toggleDetails('water')">
            {{ showWaterDetails ? 'Hide Details' : 'Show Details' }}
          </a>
        </div>

        <div class="meter-number">Meter Number #{{ waterMeterNumber }}</div>

        <!-- Reading History -->
        <div class="reading-history">
          <div class="reading-row">
            <span class="reading-label">Start Reading {{ waterStartDate }}</span>
            <span class="reading-value">{{ waterStartReading }}</span>
          </div>
          <div class="reading-row" v-if="waterEstimatedReading">
            <span class="reading-label">Estimated</span>
          </div>
        </div>

        <!-- Add New Reading Link -->
        <div class="add-reading-link" v-if="activeMeter !== 'water'">
          <a href="#" @click.prevent="activateMeter('water')">Add new reading</a>
        </div>

        <!-- Digit Input Display (when active) -->
        <div v-if="activeMeter === 'water'" class="digit-input-section">
          <div class="digit-display" @click="focusInput">
            <span class="digits black">{{ waterKiloliters || '0000' }}</span>
            <span class="digit-separator">-</span>
            <span class="digits black">{{ waterLiters || '0000' }}</span>
          </div>
        </div>
      </div>

      <!-- Electricity Section -->
      <div class="meter-section" data-test="electricity-meter-section">
        <div class="meter-type-header electricity">
          <q-icon name="bolt" size="24px" class="meter-icon electricity" />
          <span class="meter-type-name">Electricity</span>
        </div>

        <div class="meter-action-links">
          <a href="#" @click.prevent="activateMeter('electricity')"
             :class="{ active: activeMeter === 'electricity' }">Enter reading</a>
          <a href="#" @click.prevent="toggleDetails('electricity')">
            {{ showElectricityDetails ? 'Hide Details' : 'Show Details' }}
          </a>
        </div>

        <div class="meter-number">Meter Number #{{ electricityMeterNumber }}</div>

        <!-- Reading History -->
        <div class="reading-history">
          <div class="reading-row">
            <span class="reading-label">Start Reading {{ electricityStartDate }}</span>
            <span class="reading-value">{{ electricityStartReading }}</span>
          </div>
          <div class="reading-row" v-if="electricityFinalReading">
            <span class="reading-label">Final Estimated</span>
          </div>
          <div class="reading-row" v-if="electricityLastReading">
            <span class="reading-label">{{ electricityLastDate }}</span>
            <span class="reading-value">
              {{ electricityLastReading }}
              <a href="#" class="edit-link" @click.prevent="editReading('electricity')">Edit</a>
            </span>
          </div>
        </div>

        <!-- Add New Reading Link -->
        <div class="add-reading-link" v-if="activeMeter !== 'electricity'">
          <a href="#" @click.prevent="activateMeter('electricity')">Add new reading</a>
        </div>

        <!-- Warning Message -->
        <div v-if="showWarning" class="warning-message">
          Sorry, your last reading was less than 24 hours ago. Please wait for {{ waitTime }} before you can add a reading.
        </div>

        <!-- Digit Input Display (when active) -->
        <div v-if="activeMeter === 'electricity'" class="digit-input-section">
          <div class="digit-display" @click="focusInput">
            <span class="digits">{{ electricityReading || '000000' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Numeric Keypad (fixed at bottom when a meter is active) -->
    <div v-if="activeMeter" class="keypad-container" data-test="keypad">
      <div class="keypad-grid">
        <button 
          v-for="key in keypadKeys" 
          :key="key"
          class="keypad-btn"
          :data-test="`keypad-${key}`"
          @click="handleKeyPress(key)"
        >
          {{ key === 'backspace' ? '⌫' : key }}
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
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// State
const activeMeter = ref(route.query.type || null);
const showWaterDetails = ref(false);
const showElectricityDetails = ref(false);
const showWarning = ref(false);

// Water meter data
const waterMeterNumber = ref('132452');
const waterStartDate = ref('10th April');
const waterStartReading = ref('00140 - 45');
const waterEstimatedReading = ref(true);
const waterKiloliters = ref('9653');
const waterLiters = ref('5300');

// Electricity meter data
const electricityMeterNumber = ref('98736');
const electricityStartDate = ref('10th April');
const electricityStartReading = ref('763456');
const electricityFinalReading = ref(false);
const electricityLastDate = ref('');
const electricityLastReading = ref('');
const electricityReading = ref('123327');
const waitTime = ref('17 hours and 20 minutes');

// Keypad
const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

// Computed
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
});

const daysUntilDue = computed(() => 17);
const periodStart = computed(() => '10 Apr 2025');
const periodEnd = computed(() => '10 May 2025');

// Methods
const goBack = () => {
  if (activeMeter.value) {
    activeMeter.value = null;
  } else {
    router.back();
  }
};

const activateMeter = (type) => {
  activeMeter.value = type;
};

const toggleDetails = (type) => {
  if (type === 'water') {
    showWaterDetails.value = !showWaterDetails.value;
  } else {
    showElectricityDetails.value = !showElectricityDetails.value;
  }
};

const focusInput = () => {
  // Focus handling if needed
};

const editReading = (type) => {
  activateMeter(type);
};

const handleKeyPress = (key) => {
  if (key === 'backspace') {
    // Handle backspace
    if (activeMeter.value === 'water') {
      if (waterLiters.value.length > 0) {
        waterLiters.value = waterLiters.value.slice(0, -1);
      } else if (waterKiloliters.value.length > 0) {
        waterKiloliters.value = waterKiloliters.value.slice(0, -1);
      }
    } else {
      electricityReading.value = electricityReading.value.slice(0, -1);
    }
  } else if (key === '.') {
    // Skip decimal for meter readings
    return;
  } else {
    // Add digit
    if (activeMeter.value === 'water') {
      if (waterKiloliters.value.length < 5) {
        waterKiloliters.value += key;
      } else if (waterLiters.value.length < 4) {
        waterLiters.value += key;
      }
    } else {
      if (electricityReading.value.length < 7) {
        electricityReading.value += key;
      }
    }
  }
};

const handleCancel = () => {
  // Reset values
  if (activeMeter.value === 'water') {
    waterKiloliters.value = '';
    waterLiters.value = '';
  } else {
    electricityReading.value = '';
  }
  activeMeter.value = null;
};

const handleEnter = () => {
  // Save the reading
  const reading = activeMeter.value === 'water' 
    ? `${waterKiloliters.value}-${waterLiters.value}`
    : electricityReading.value;
  
  $q.notify({
    type: 'positive',
    message: `Reading saved: ${reading}`,
    position: 'top',
  });
  
  activeMeter.value = null;
  router.push({ name: 'home' });
};
</script>

<style lang="scss" scoped>
$primary: #3294B8;
$primary-dark: #2a7a9a;
$success: #4CAF50;
$dark-bg: #1a1a1a;
$border: #e0e0e0;
$text-secondary: #666666;

.enter-readings-page {
  background: #ffffff;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.header-bar {
  background: #E0E0E0;
  color: #000000;
  padding: 8px 16px;
  font-size: 12px;
  text-align: center;
}

.nav-row {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E0E0E0;
  padding: 8px 16px;
  gap: 12px;
}

.nav-arrow {
  background: none;
  border: none;
  color: #000000;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}

.due-badge {
  background: $success;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 12px;
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
}

.period-text {
  font-size: 12px;
  color: $text-secondary;
  text-align: center;
  padding-bottom: 16px;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 200px; // Space for keypad
}

.meter-section {
  padding: 16px;
  border-bottom: 1px solid $border;
}

.meter-type-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
  
  .meter-icon {
    color: $primary;
    
    &.electricity {
      color: $primary;
    }
  }
  
  .meter-type-name {
    font-size: 20px;
    font-weight: 600;
    color: #000;
  }
}

.meter-action-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
  
  a {
    color: $primary;
    font-size: 13px;
    text-decoration: none;
    
    &:hover, &.active {
      text-decoration: underline;
    }
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
    color: #000;
    font-weight: 500;
    
    .edit-link {
      color: $primary;
      margin-left: 8px;
      font-size: 12px;
    }
  }
}

.add-reading-link {
  text-align: center;
  padding: 8px 0;
  
  a {
    color: $primary;
    font-size: 13px;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.warning-message {
  background: #fff3cd;
  color: #856404;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  margin: 12px 0;
}

.digit-input-section {
  padding: 16px 0;
}

.digit-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-family: 'Roboto Mono', monospace;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 4px;
  cursor: pointer;
  
  .digits {
    color: #000;
    
    &.black {
      color: #000;
    }
  }
  
  .digit-separator {
    color: #000;
    margin: 0 8px;
  }
}

// Keypad - constrained to mobile view
.keypad-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  max-width: 390px;
  margin: 0 auto;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.keypad-btn {
  height: 56px;
  border: none;
  border-right: 1px solid $border;
  border-bottom: 1px solid $border;
  background: white;
  font-size: 24px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  
  &:nth-child(3n) {
    border-right: none;
  }
  
  &:active {
    background: #f0f0f0;
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
</style>

