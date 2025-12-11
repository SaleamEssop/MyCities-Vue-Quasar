<template>
  <q-page class="enter-readings-page" data-test="enter-readings-page">
    <!-- Header: Current Date -->
    <div class="header-bar">
      <span>Current date: {{ currentDate }}</span>
    </div>

    <!-- Navigation Row with Due Badge -->
    <div class="nav-row">
      <button class="nav-arrow" @click="goBack">
        <span class="arrow-icon">◀</span>
      </button>
      
      <div class="due-badge">
        Final Reading due in {{ daysUntilDue }} days
      </div>
      
      <button class="nav-arrow" disabled>
        <span class="arrow-icon">▶</span>
      </button>
    </div>

    <!-- Title -->
    <div class="page-title">ENTER READINGS</div>
    <div class="period-text">Period - {{ periodStart }} to {{ periodEnd }}</div>

    <!-- Scrollable Content Area -->
    <div class="content-scroll" ref="contentScrollRef">
      <!-- Water Section -->
      <div class="meter-section" data-test="water-meter-section">
        <div class="meter-type-header">
          <q-icon name="water_drop" size="24px" class="meter-icon" />
          <span class="meter-type-name">Water</span>
        </div>

        <div class="meter-action-links">
          <a href="#" @click.prevent="activateWaterInput" 
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

        <!-- Add New Reading Link (when not active) -->
        <div class="add-reading-link" v-if="activeMeter !== 'water'">
          <a href="#" @click.prevent="activateWaterInput">Add new reading</a>
        </div>

        <!-- Water Digit Input Display (when active) -->
        <div v-if="activeMeter === 'water'" class="digit-input-section" ref="waterDigitRef">
          <div class="digit-display-container">
            <!-- RED Group (Liters - 2 digits) - Clickable -->
            <div 
              class="digit-group red-group"
              :class="{ active: activeGroup === 'liters' }"
              @click="setActiveGroup('liters')"
              data-test="water-liters-group"
            >
              <span class="digits red">{{ waterLiters || '00' }}</span>
              <span v-if="activeGroup === 'liters' && waterLiters === ''" class="cursor-blink red">|</span>
            </div>
            
            <span class="digit-separator">-</span>
            
            <!-- BLACK Group (Kiloliters - 5 digits) - Clickable -->
            <div 
              class="digit-group black-group"
              :class="{ active: activeGroup === 'kiloliters' }"
              @click="setActiveGroup('kiloliters')"
              data-test="water-kiloliters-group"
            >
              <span class="digits black">{{ waterKiloliters || '00000' }}</span>
              <span v-if="activeGroup === 'kiloliters' && waterKiloliters === ''" class="cursor-blink">|</span>
            </div>
          </div>
          <div class="group-labels">
            <span class="group-label red">Liters</span>
            <span class="group-label black">Kiloliters</span>
          </div>
        </div>
      </div>

      <!-- Electricity Section -->
      <div class="meter-section" data-test="electricity-meter-section">
        <div class="meter-type-header electricity">
          <q-icon name="bolt" size="24px" class="meter-icon" />
          <span class="meter-type-name">Electricity</span>
        </div>

        <div class="meter-action-links">
          <a href="#" @click.prevent="activateElectricityInput"
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
        </div>

        <!-- Add New Reading Link (when not active) -->
        <div class="add-reading-link" v-if="activeMeter !== 'electricity'">
          <a href="#" @click.prevent="activateElectricityInput">Add new reading</a>
        </div>

        <!-- Electricity Digit Input Display (when active) -->
        <div v-if="activeMeter === 'electricity'" class="digit-input-section" ref="electricityDigitRef">
          <div class="digit-display-container">
            <div 
              class="digit-group black-group single"
              :class="{ active: activeGroup === 'electricity' }"
              @click="setActiveGroup('electricity')"
              data-test="electricity-group"
            >
              <span class="digits black">{{ electricityReading || '000000' }}</span>
              <span v-if="activeGroup === 'electricity' && electricityReading === ''" class="cursor-blink">|</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Spacer for keypad -->
      <div class="keypad-spacer"></div>
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
import { ref, computed, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// Refs for scrolling
const contentScrollRef = ref(null);
const waterDigitRef = ref(null);
const electricityDigitRef = ref(null);

// State
const activeMeter = ref(route.query.type || null);
const activeGroup = ref(null); // 'liters', 'kiloliters', or 'electricity'
const showWaterDetails = ref(false);
const showElectricityDetails = ref(false);

// Water meter data
const waterMeterNumber = ref('132452');
const waterStartDate = ref('10th April');
const waterStartReading = ref('00140 - 45');
const waterEstimatedReading = ref(true);
const waterLiters = ref('');      // RED group - 2 digits
const waterKiloliters = ref('');  // BLACK group - 5 digits

// Electricity meter data
const electricityMeterNumber = ref('98736');
const electricityStartDate = ref('10th April');
const electricityStartReading = ref('763456');
const electricityReading = ref('');

// Keypad
const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

// Computed
const currentDate = computed(() => {
  return '17 Apr 2025';
});

const daysUntilDue = computed(() => 17);
const periodStart = computed(() => '10 Apr 2025');
const periodEnd = computed(() => '10 May 2025');

// Watch for active meter changes to scroll into view
watch(activeMeter, async (newVal) => {
  if (newVal) {
    await nextTick();
    scrollToActiveInput();
  }
});

// Methods
const scrollToActiveInput = () => {
  const targetRef = activeMeter.value === 'water' ? waterDigitRef.value : electricityDigitRef.value;
  if (targetRef && contentScrollRef.value) {
    targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const goBack = () => {
  if (activeMeter.value) {
    activeMeter.value = null;
    activeGroup.value = null;
  } else {
    router.back();
  }
};

const activateWaterInput = () => {
  activeMeter.value = 'water';
  activeGroup.value = 'kiloliters'; // Start with black group (kiloliters)
};

const activateElectricityInput = () => {
  activeMeter.value = 'electricity';
  activeGroup.value = 'electricity';
};

const setActiveGroup = (group) => {
  activeGroup.value = group;
};

const toggleDetails = (type) => {
  if (type === 'water') {
    showWaterDetails.value = !showWaterDetails.value;
  } else {
    showElectricityDetails.value = !showElectricityDetails.value;
  }
};

const handleKeyPress = (key) => {
  if (!activeGroup.value) return;
  
  if (key === 'backspace') {
    handleBackspace();
  } else if (key === '.') {
    // Skip decimal for meter readings
    return;
  } else {
    handleDigitInput(key);
  }
};

const handleDigitInput = (digit) => {
  if (activeGroup.value === 'liters') {
    // RED group - max 2 digits
    if (waterLiters.value.length < 2) {
      waterLiters.value += digit;
    }
  } else if (activeGroup.value === 'kiloliters') {
    // BLACK group - max 5 digits
    if (waterKiloliters.value.length < 5) {
      waterKiloliters.value += digit;
    }
  } else if (activeGroup.value === 'electricity') {
    // Electricity - max 6 digits
    if (electricityReading.value.length < 6) {
      electricityReading.value += digit;
    }
  }
};

const handleBackspace = () => {
  if (activeGroup.value === 'liters') {
    waterLiters.value = waterLiters.value.slice(0, -1);
  } else if (activeGroup.value === 'kiloliters') {
    waterKiloliters.value = waterKiloliters.value.slice(0, -1);
  } else if (activeGroup.value === 'electricity') {
    electricityReading.value = electricityReading.value.slice(0, -1);
  }
};

const handleCancel = () => {
  // Reset values
  if (activeMeter.value === 'water') {
    waterLiters.value = '';
    waterKiloliters.value = '';
  } else {
    electricityReading.value = '';
  }
  activeMeter.value = null;
  activeGroup.value = null;
};

const handleEnter = () => {
  // Validate and save the reading
  let reading = '';
  
  if (activeMeter.value === 'water') {
    const kl = waterKiloliters.value.padStart(5, '0');
    const l = waterLiters.value.padStart(2, '0');
    reading = `${kl}-${l}`;
  } else {
    reading = electricityReading.value.padStart(6, '0');
  }
  
  $q.notify({
    type: 'positive',
    message: `Reading saved: ${reading}`,
    position: 'top',
  });
  
  activeMeter.value = null;
  activeGroup.value = null;
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
$red: #cc0000;
$black: #000000;

.enter-readings-page {
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
  height: 280px; // Space for keypad
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
  }
  
  .meter-type-name {
    font-size: 20px;
    font-weight: 600;
    color: $black;
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
    color: $black;
    font-weight: 500;
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

// Digit Input Section
.digit-input-section {
  padding: 20px 0;
}

.digit-display-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.digit-group {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  min-width: 80px;
  text-align: center;
  
  &.active {
    border-color: $primary;
    background: rgba($primary, 0.05);
  }
  
  &:hover:not(.active) {
    background: #f5f5f5;
  }
}

.red-group {
  &.active {
    border-color: $red;
    background: rgba($red, 0.05);
  }
}

.digits {
  font-family: 'Roboto Mono', monospace;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 4px;
  
  &.red {
    color: $red;
  }
  
  &.black {
    color: $black;
  }
}

.cursor-blink {
  animation: blink 1s infinite;
  font-size: 32px;
  font-weight: 300;
  color: $black;
  
  &.red {
    color: $red;
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.digit-separator {
  font-size: 32px;
  font-weight: 600;
  color: $black;
  margin: 0 4px;
}

.group-labels {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 8px;
}

.group-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &.red {
    color: $red;
  }
  
  &.black {
    color: $text-secondary;
  }
}

// Keypad - fixed at bottom within phone container
.keypad-container {
  position: absolute;
  bottom: 0;
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
