<template>
  <q-page class="dashboard-page" data-test="dashboard-page">
    <!-- 
      HEADER SECTION - Dark Background (#1a1a1a)
      Contains: Current Date, Navigation, Due Badge, Amount, Period
    -->
    <div class="header-section">
      <!-- 1. Current Date Display -->
      <!-- DATA: Fetches current system date, formatted as "DD Mon YYYY" -->
      <div class="current-date" data-test="current-date">
        Current date: {{ currentDateFormatted }}
      </div>

      <!-- Navigation Row -->
      <div class="nav-row">
        <!-- 5a. Previous Period Button (Left Triangle) -->
        <!-- ACTION: Navigates to previous billing period -->
        <!-- TRIGGERS: fetchPeriodData(currentPeriodIndex - 1) -->
        <button 
          class="nav-arrow" 
          @click="goToPreviousPeriod" 
          :disabled="!hasPreviousPeriod"
          data-test="nav-previous"
          aria-label="Previous period"
        >
          <span class="arrow-icon">◀</span>
        </button>
        
        <!-- 2. Final Reading Due Badge -->
        <!-- DATA: Calculates days until reading due date -->
        <!-- COMPUTED: daysUntilDue = readingDueDate - currentDate -->
        <div 
          class="due-badge" 
          :class="dueBadgeClass"
          data-test="due-badge"
        >
          Final Reading due in <strong>{{ daysUntilDue }}</strong> days
        </div>
        
        <!-- 5b. Next Period Button (Right Triangle) -->
        <!-- ACTION: Navigates to next billing period -->
        <!-- TRIGGERS: fetchPeriodData(currentPeriodIndex + 1) -->
        <button 
          class="nav-arrow" 
          @click="goToNextPeriod"
          :disabled="!hasNextPeriod"
          data-test="nav-next"
          aria-label="Next period"
        >
          <span class="arrow-icon">▶</span>
        </button>
      </div>

      <!-- 3. Total Amount Due -->
      <!-- DATA: Fetches from API - sum of all charges for current period -->
      <!-- COMPUTED: waterCharges + electricityCharges + vat + rates -->
      <div class="amount-display" data-test="total-amount">
        <span class="currency">R</span>{{ totalAmountFormatted }}
      </div>

      <!-- 4. Billing Period Display -->
      <!-- DATA: Current billing period start and end dates -->
      <!-- FORMAT: "DD Mon YYYY to DD Mon YYYY" -->
      <div class="period-display" data-test="billing-period">
        Period - {{ periodStartFormatted }} to {{ periodEndFormatted }}
      </div>
    </div>

    <!-- CONTENT SECTION - White Background -->
    <div class="content-section">
      <!-- Water Meter Section -->
      <div class="meter-section" data-test="water-section">
        <!-- Water Meter Header Bar -->
        <!-- DATA: Fetches water meter statistics for current period -->
        <div class="meter-header">
          <div class="meter-icon">
            <q-icon name="water_drop" size="24px" />
          </div>
          <div class="meter-stats">
            <!-- Daily Usage: totalUsage / daysInPeriod -->
            <div class="stat-item">
              <div class="stat-label">Daily Usage</div>
              <div class="stat-value">{{ waterDailyUsage }}</div>
            </div>
            <!-- Total Usage: currentReading - previousReading -->
            <div class="stat-item">
              <div class="stat-label">Total Usage</div>
              <div class="stat-value">{{ waterTotalUsage }}</div>
            </div>
            <!-- Daily Cost: projectedCharges / daysInPeriod -->
            <div class="stat-item">
              <div class="stat-label">Daily Cost</div>
              <div class="stat-value">R {{ waterDailyCost }}</div>
            </div>
          </div>
        </div>

        <!-- Water Action Links -->
        <div class="action-links">
          <!-- ACTION: Opens Enter Reading screen for water meter -->
          <a href="#" @click.prevent="enterWaterReading" data-test="water-enter-reading">
            Enter reading
          </a>
          <!-- ACTION: Toggles visibility of water charges breakdown -->
          <a href="#" @click.prevent="toggleWaterDetails" data-test="water-toggle-details">
            {{ showWaterDetails ? 'Hide Details' : 'Show Details' }}
          </a>
        </div>

        <!-- Water Charges Breakdown (Collapsible) -->
        <!-- DATA: Fetched from tariff calculations based on usage -->
        <transition name="slide">
          <div v-if="showWaterDetails" class="charges-breakdown">
            <div class="charge-row">
              <span class="charge-label">Consumption Charges</span>
              <span class="charge-value">R{{ waterConsumptionCharges }}</span>
            </div>
            <div class="charge-row">
              <span class="charge-label">Discharge charges</span>
              <span class="charge-value">R{{ waterDischargeCharges }}</span>
            </div>
            <div class="charge-row">
              <span class="charge-label">Infrastructure Surcharge</span>
              <span class="charge-value">R{{ waterInfrastructureSurcharge }}</span>
            </div>
            <div class="charge-row projected">
              <span class="charge-label">Projected charges</span>
              <span class="charge-value">→ R {{ waterProjectedCharges }}</span>
            </div>
          </div>
        </transition>
      </div>

      <!-- Electricity Meter Section -->
      <div class="meter-section" data-test="electricity-section">
        <!-- Electricity Meter Header Bar -->
        <div class="meter-header">
          <div class="meter-icon electricity">
            <q-icon name="bolt" size="24px" />
          </div>
          <div class="meter-stats">
            <div class="stat-item">
              <div class="stat-label">Daily Usage</div>
              <div class="stat-value">{{ electricityDailyUsage }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Daily Cost</div>
              <div class="stat-value">R {{ electricityDailyCost }}</div>
            </div>
          </div>
        </div>

        <!-- Electricity Action Links -->
        <div class="action-links">
          <a href="#" @click.prevent="enterElectricityReading" data-test="elec-enter-reading">
            Enter reading
          </a>
          <a href="#" @click.prevent="viewElectricityHistory" data-test="elec-view-history">
            View History
          </a>
          <a href="#" @click.prevent="toggleElectricityDetails" data-test="elec-toggle-details">
            {{ showElectricityDetails ? 'Hide Details' : 'Show Details' }}
          </a>
        </div>

        <!-- Electricity Charges Breakdown (Collapsible) -->
        <transition name="slide">
          <div v-if="showElectricityDetails" class="charges-breakdown">
            <div class="charge-row">
              <span class="charge-label">Consumption Charges</span>
              <span class="charge-value">R{{ electricityConsumptionCharges }}</span>
            </div>
            <div class="charge-row projected">
              <span class="charge-label">Projected charges</span>
              <span class="charge-value">→ R {{ electricityProjectedCharges }}</span>
            </div>
          </div>
        </transition>
      </div>

      <!-- Summary Section -->
      <div class="summary-section">
        <!-- VAT: Calculated as percentage of total charges -->
        <div class="summary-row">
          <span class="summary-label">VAT</span>
          <span class="summary-value">R{{ vatAmount }}</span>
        </div>
        <!-- Rates: Fixed municipal rates -->
        <div class="summary-row">
          <span class="summary-label">Rates</span>
          <span class="summary-value">R{{ ratesAmount }}</span>
        </div>
      </div>

      <!-- Total Row -->
      <!-- COMPUTED: waterProjected + electricityProjected + vat + rates -->
      <div class="total-row">
        <span class="total-label">Total</span>
        <span class="total-value">R{{ totalAmountFormatted }}</span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
/**
 * DashboardPage - Main billing overview screen
 * 
 * DATA SOURCES:
 * - currentDate: System date
 * - billingPeriod: API fetch - /api/billing/periods/:periodId
 * - waterMeterData: API fetch - /api/meters/water/:meterId/usage
 * - electricityMeterData: API fetch - /api/meters/electricity/:meterId/usage
 * - charges: API fetch - /api/billing/calculate/:periodId
 * 
 * COMPUTATIONS:
 * - daysUntilDue: readingDueDate - currentDate
 * - dailyUsage: totalUsage / daysElapsed
 * - dailyCost: projectedCharges / daysInPeriod
 * - totalAmount: sum of all charges
 */

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// =============================================================================
// STATE - Would be fetched from API in production
// =============================================================================

// Period navigation
const currentPeriodIndex = ref(0);
const periods = ref([
  { id: 1, start: '2025-04-10', end: '2025-05-10', readingDue: '2025-04-20' },
  { id: 2, start: '2025-03-10', end: '2025-04-10', readingDue: '2025-03-20' },
]);

// UI state
const showWaterDetails = ref(true);
const showElectricityDetails = ref(false);

// Water meter data - MOCK DATA (replace with API)
const waterData = ref({
  dailyUsage: '1290 L',
  totalUsage: '33.90 kl',
  dailyCost: '77.90',
  consumptionCharges: '1200.00',
  dischargeCharges: '600.00',
  infrastructureSurcharge: '200.00',
  projectedCharges: '3000.00',
});

// Electricity meter data - MOCK DATA (replace with API)
const electricityData = ref({
  dailyUsage: '30 kW',
  dailyCost: '77.90',
  consumptionCharges: '2200.00',
  projectedCharges: '2200.00',
});

// Summary data - MOCK DATA (replace with API)
const vatAmount = ref('220.00');
const ratesAmount = ref('1200.00');
const totalAmount = ref(6700.00);

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

// 1. Current Date - formatted for display
const currentDateFormatted = computed(() => {
  // In production: return formatDate(new Date())
  return '17 Apr 2025'; // Mock for demo
});

// 2. Days until reading due
const daysUntilDue = computed(() => {
  // In production: calculate from period.readingDue - currentDate
  return 3;
});

// Due badge styling based on urgency
const dueBadgeClass = computed(() => {
  if (daysUntilDue.value <= 3) return 'urgent';
  if (daysUntilDue.value <= 7) return 'warning';
  return 'normal';
});

// 3. Total amount formatted
const totalAmountFormatted = computed(() => {
  return totalAmount.value.toFixed(2);
});

// 4. Period dates formatted
const periodStartFormatted = computed(() => '10 Apr 2025');
const periodEndFormatted = computed(() => '10 May 2025');

// 5. Navigation state
const hasPreviousPeriod = computed(() => currentPeriodIndex.value < periods.value.length - 1);
const hasNextPeriod = computed(() => currentPeriodIndex.value > 0);

// Water computed values
const waterDailyUsage = computed(() => waterData.value.dailyUsage);
const waterTotalUsage = computed(() => waterData.value.totalUsage);
const waterDailyCost = computed(() => waterData.value.dailyCost);
const waterConsumptionCharges = computed(() => waterData.value.consumptionCharges);
const waterDischargeCharges = computed(() => waterData.value.dischargeCharges);
const waterInfrastructureSurcharge = computed(() => waterData.value.infrastructureSurcharge);
const waterProjectedCharges = computed(() => waterData.value.projectedCharges);

// Electricity computed values
const electricityDailyUsage = computed(() => electricityData.value.dailyUsage);
const electricityDailyCost = computed(() => electricityData.value.dailyCost);
const electricityConsumptionCharges = computed(() => electricityData.value.consumptionCharges);
const electricityProjectedCharges = computed(() => electricityData.value.projectedCharges);

// =============================================================================
// METHODS - Actions that trigger API calls or navigation
// =============================================================================

/**
 * Navigate to previous billing period
 * TRIGGERS: fetchPeriodData(periodId)
 */
const goToPreviousPeriod = () => {
  if (hasPreviousPeriod.value) {
    currentPeriodIndex.value++;
    // TODO: fetchPeriodData(periods.value[currentPeriodIndex.value].id);
  }
};

/**
 * Navigate to next billing period
 * TRIGGERS: fetchPeriodData(periodId)
 */
const goToNextPeriod = () => {
  if (hasNextPeriod.value) {
    currentPeriodIndex.value--;
    // TODO: fetchPeriodData(periods.value[currentPeriodIndex.value].id);
  }
};

/**
 * Toggle water details visibility
 */
const toggleWaterDetails = () => {
  showWaterDetails.value = !showWaterDetails.value;
};

/**
 * Toggle electricity details visibility
 */
const toggleElectricityDetails = () => {
  showElectricityDetails.value = !showElectricityDetails.value;
};

/**
 * Navigate to enter water reading screen
 * ROUTE: /enter-readings?type=water
 */
const enterWaterReading = () => {
  router.push({ name: 'enter-readings', query: { type: 'water' } });
};

/**
 * Navigate to enter electricity reading screen
 * ROUTE: /enter-readings?type=electricity
 */
const enterElectricityReading = () => {
  router.push({ name: 'enter-readings', query: { type: 'electricity' } });
};

/**
 * Navigate to electricity history screen
 * ROUTE: /readings-list?type=electricity
 */
const viewElectricityHistory = () => {
  router.push({ name: 'readings-list', query: { type: 'electricity' } });
};

// =============================================================================
// LIFECYCLE
// =============================================================================

onMounted(() => {
  // TODO: Fetch initial data
  // fetchPeriodData(periods.value[0].id);
  // fetchWaterMeterData();
  // fetchElectricityMeterData();
});
</script>

<style lang="scss" scoped>
// Design tokens
$primary: #3294B8;
$primary-dark: #2a7a9a;
$success: #4CAF50;
$warning: #FF9800;
$header-bg: #E0E0E0;  // Light grey header background
$white: #ffffff;
$border: #e0e0e0;
$text-primary: #000000;
$text-secondary: #666666;

.dashboard-page {
  background: $white;
  min-height: 100%;
}

// =============================================================================
// HEADER SECTION - Light grey background (#E0E0E0)
// =============================================================================

.header-section {
  background: $header-bg;
  color: $text-primary;
  padding-bottom: 16px;
}

// 1. Current Date
.current-date {
  text-align: center;
  padding: 12px 16px;
  font-size: 14px;
  color: $text-primary;
  background: $header-bg;
}

// Navigation Row
.nav-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  gap: 16px;
}

// 5. Navigation Arrows - Black triangles
.nav-arrow {
  background: none;
  border: none;
  color: $text-primary;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  
  &:hover:not(:disabled) {
    opacity: 0.7;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .arrow-icon {
    font-size: 18px;
    font-weight: bold;
  }
}

// 2. Due Badge - Green
.due-badge {
  background: $success;
  color: $white;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  
  strong {
    font-weight: 700;
  }
  
  &.urgent {
    background: $success;
  }
  
  &.warning {
    background: $warning;
  }
}

// 3. Amount Display - Teal color
.amount-display {
  text-align: center;
  padding: 8px 16px;
  font-size: 42px;
  font-weight: 700;
  color: $primary;
  
  .currency {
    font-size: 42px;
  }
}

// 4. Period Display - Dark text on light grey
.period-display {
  text-align: center;
  font-size: 13px;
  color: $text-secondary;
  padding-bottom: 8px;
}

// =============================================================================
// CONTENT SECTION - White background
// =============================================================================

.content-section {
  background: $white;
}

// Meter Section
.meter-section {
  border-bottom: 1px solid $border;
}

.meter-header {
  display: flex;
  align-items: center;
  background: $primary;
  color: $white;
  padding: 12px 16px;
  gap: 12px;
}

.meter-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meter-stats {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  
  .stat-label {
    font-size: 10px;
    opacity: 0.9;
    margin-bottom: 2px;
  }
  
  .stat-value {
    font-size: 14px;
    font-weight: 600;
  }
}

// Action Links
.action-links {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  border-bottom: 1px solid $border;
  
  a {
    color: $primary;
    font-size: 13px;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// Charges Breakdown
.charges-breakdown {
  padding: 8px 16px;
  background: #fafafa;
}

.charge-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  
  .charge-label {
    color: $text-primary;
  }
  
  .charge-value {
    color: $text-primary;
    font-weight: 500;
  }
  
  &.projected {
    .charge-label {
      font-weight: 600;
    }
    
    .charge-value {
      font-size: 20px;
      color: $primary;
      font-weight: 700;
    }
  }
}

// Summary Section
.summary-section {
  padding: 8px 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  
  .summary-label {
    color: $text-secondary;
  }
  
  .summary-value {
    color: $text-primary;
    font-weight: 500;
  }
}

// Total Row
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid $border;
  
  .total-label {
    font-size: 24px;
    color: $primary;
    font-weight: 500;
  }
  
  .total-value {
    font-size: 24px;
    color: $primary;
    font-weight: 700;
  }
}

// Transitions
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
