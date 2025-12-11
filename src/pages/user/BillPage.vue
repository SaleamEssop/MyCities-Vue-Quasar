<template>
  <q-page class="bill-page">
    <!-- Header Section -->
    <div class="bill-header">
      <div class="current-date">Current date: {{ formatDate(currentDate) }}</div>
      
      <div class="nav-row">
        <div 
          class="nav-arrow left" 
          :class="{ disabled: currentPeriodIndex >= periods.length - 1 }"
          @click="prevPeriod"
        ></div>
        <div class="due-badge" :class="dueBadgeClass">
          Final Reading due in <span class="days">{{ daysUntilDue }} days</span>
        </div>
        <div 
          class="nav-arrow right"
          :class="{ disabled: currentPeriodIndex <= 0 }"
          @click="nextPeriod"
        ></div>
      </div>
      
      <div class="header-amount">R{{ formatCurrency(currentPeriod.total) }}</div>
      <div class="period-text">Period - {{ currentPeriod.startDate }} to {{ currentPeriod.endDate }}</div>
    </div>
    
    <!-- Water Meter Section -->
    <div class="meter-section">
      <div class="meter-bar">
        <div class="meter-icon water">
          <svg viewBox="0 0 24 24"><path d="M12 2C12 2 5 10 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 10 12 2 12 2Z"/></svg>
        </div>
        <div class="meter-stats">
          <div class="stat-item">
            <div class="stat-label">Daily Usage</div>
            <div class="stat-value">{{ currentPeriod.water.dailyUsage }} L</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total Usage</div>
            <div class="stat-value">{{ currentPeriod.water.totalUsage }} kl</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Daily Cost</div>
            <div class="stat-value">R {{ currentPeriod.water.dailyCost }}</div>
          </div>
        </div>
      </div>
      
      <div class="action-links">
        <span class="action-link" @click="goToReadings">Enter reading</span>
        <span class="action-link highlight" @click="waterDetailsOpen = !waterDetailsOpen">
          {{ waterDetailsOpen ? 'Hide Details' : 'Show Details' }}
        </span>
      </div>
      
      <q-slide-transition>
        <div v-show="waterDetailsOpen" class="details-section">
          <div class="charge-row" v-for="charge in currentPeriod.water.charges" :key="charge.label">
            <span class="charge-label">{{ charge.label }}</span>
            <span class="charge-value">R{{ formatCurrency(charge.amount) }}</span>
          </div>
        </div>
      </q-slide-transition>
      
      <div class="projected-row">
        <span class="projected-label">Projected charges <span class="projected-arrow">→</span></span>
        <span class="projected-value">R {{ formatCurrency(currentPeriod.water.projected) }}</span>
      </div>
    </div>
    
    <!-- Electricity Meter Section -->
    <div class="meter-section">
      <div class="meter-bar">
        <div class="meter-icon electricity">
          <svg viewBox="0 0 24 24"><path d="M13 2L4 14H11L10 22L20 10H13L13 2Z"/></svg>
        </div>
        <div class="meter-stats">
          <div class="stat-item">
            <div class="stat-label">Daily Usage</div>
            <div class="stat-value">{{ currentPeriod.electricity.dailyUsage }} kW</div>
          </div>
          <div class="stat-item invisible">
            <div class="stat-label">-</div>
            <div class="stat-value">-</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Daily Cost</div>
            <div class="stat-value">R {{ currentPeriod.electricity.dailyCost }}</div>
          </div>
        </div>
      </div>
      
      <div class="action-links">
        <span class="action-link" @click="goToReadings">Enter reading</span>
        <span class="action-link highlight" @click="elecDetailsOpen = !elecDetailsOpen">
          {{ elecDetailsOpen ? 'Hide Details' : 'Show Details' }}
        </span>
      </div>
      
      <q-slide-transition>
        <div v-show="elecDetailsOpen" class="details-section">
          <div class="charge-row" v-for="charge in currentPeriod.electricity.charges" :key="charge.label">
            <span class="charge-label">{{ charge.label }}</span>
            <span class="charge-value">R{{ formatCurrency(charge.amount) }}</span>
          </div>
        </div>
      </q-slide-transition>
      
      <div class="projected-row">
        <span class="projected-label">Projected charges <span class="projected-arrow">→</span></span>
        <span class="projected-value">R {{ formatCurrency(currentPeriod.electricity.projected) }}</span>
      </div>
    </div>
    
    <!-- VAT & Rates -->
    <div class="extras-section">
      <div class="charge-row">
        <span class="charge-label">VAT</span>
        <span class="charge-value">R{{ formatCurrency(currentPeriod.vat) }}</span>
      </div>
      <div class="charge-row">
        <span class="charge-label">Rates</span>
        <span class="charge-value">R{{ formatCurrency(currentPeriod.rates) }}</span>
      </div>
    </div>
    
    <!-- Total Section -->
    <div class="total-section">
      <span class="total-label">Total</span>
      <span class="total-value">R{{ formatCurrency(currentPeriod.total) }}</span>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'BillPage',
  
  setup() {
    const router = useRouter();
    const currentDate = ref(new Date());
    const currentPeriodIndex = ref(0);
    const waterDetailsOpen = ref(false);
    const elecDetailsOpen = ref(false);
    
    // Test data for 3 months
    const periods = ref([
      {
        startDate: '10 Apr 2025',
        endDate: '10 May 2025',
        dueDate: new Date('2025-04-20'),
        water: {
          dailyUsage: 1290,
          totalUsage: '33.90',
          dailyCost: '77.90',
          projected: 3000,
          charges: [
            { label: 'Consumption Charges', amount: 1200 },
            { label: 'Discharge charges', amount: 600 },
            { label: 'Infrastructure Surcharge', amount: 200 },
          ]
        },
        electricity: {
          dailyUsage: 30,
          dailyCost: '77.90',
          projected: 2200,
          charges: [
            { label: 'Consumption Charges', amount: 2200 },
          ]
        },
        vat: 220,
        rates: 1200,
        total: 6700
      },
      {
        startDate: '10 Mar 2025',
        endDate: '10 Apr 2025',
        dueDate: new Date('2025-03-20'),
        water: {
          dailyUsage: 1150,
          totalUsage: '31.20',
          dailyCost: '72.50',
          projected: 2800,
          charges: [
            { label: 'Consumption Charges', amount: 1100 },
            { label: 'Discharge charges', amount: 550 },
            { label: 'Infrastructure Surcharge', amount: 200 },
          ]
        },
        electricity: {
          dailyUsage: 28,
          dailyCost: '71.20',
          projected: 2050,
          charges: [
            { label: 'Consumption Charges', amount: 2050 },
          ]
        },
        vat: 198,
        rates: 1200,
        total: 6198
      },
      {
        startDate: '10 Feb 2025',
        endDate: '10 Mar 2025',
        dueDate: new Date('2025-02-20'),
        water: {
          dailyUsage: 1320,
          totalUsage: '35.80',
          dailyCost: '82.30',
          projected: 3200,
          charges: [
            { label: 'Consumption Charges', amount: 1350 },
            { label: 'Discharge charges', amount: 680 },
            { label: 'Infrastructure Surcharge', amount: 200 },
          ]
        },
        electricity: {
          dailyUsage: 35,
          dailyCost: '89.50',
          projected: 2580,
          charges: [
            { label: 'Consumption Charges', amount: 2580 },
          ]
        },
        vat: 258,
        rates: 1200,
        total: 7488
      }
    ]);
    
    const currentPeriod = computed(() => periods.value[currentPeriodIndex.value]);
    
    const daysUntilDue = computed(() => {
      const today = new Date();
      const due = currentPeriod.value.dueDate;
      const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      return Math.max(0, diff);
    });
    
    const dueBadgeClass = computed(() => {
      if (daysUntilDue.value <= 3) return 'urgent';
      if (daysUntilDue.value <= 7) return 'warning';
      return '';
    });
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    const formatCurrency = (amount) => {
      return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    const prevPeriod = () => {
      if (currentPeriodIndex.value < periods.value.length - 1) {
        currentPeriodIndex.value++;
      }
    };
    
    const nextPeriod = () => {
      if (currentPeriodIndex.value > 0) {
        currentPeriodIndex.value--;
      }
    };
    
    const goToReadings = () => {
      router.push('/readings');
    };
    
    return {
      currentDate,
      currentPeriodIndex,
      currentPeriod,
      periods,
      daysUntilDue,
      dueBadgeClass,
      waterDetailsOpen,
      elecDetailsOpen,
      formatDate,
      formatCurrency,
      prevPeriod,
      nextPeriod,
      goToReadings,
    };
  }
});
</script>

<style lang="scss" scoped>
.bill-page {
  background: #FFFFFF;
  min-height: 100vh;
}

.bill-header {
  background: rgba(224, 224, 224, 0.78);
  padding: 16px;
}

.current-date {
  font-size: 16px;
  color: #000;
  text-align: center;
  margin-bottom: 12px;
}

.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.nav-arrow {
  width: 0;
  height: 0;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &.left {
    border: 12px solid transparent;
    border-right: 18px solid #000;
    border-left: none;
  }
  
  &.right {
    border: 12px solid transparent;
    border-left: 18px solid #000;
    border-right: none;
  }
  
  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.due-badge {
  background: $positive;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  color: #FFFFFF;
  
  .days {
    font-weight: 700;
  }
  
  &.warning {
    background: #f2c037;
  }
  
  &.urgent {
    background: #c10015;
  }
}

.header-amount {
  font-size: 36px;
  font-weight: 700;
  color: $primary;
  text-align: center;
  margin: 16px 0 8px;
}

.period-text {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  text-align: center;
}

.meter-section {
  margin-bottom: 8px;
}

.meter-bar {
  background: $primary;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.meter-icon {
  width: 45px;
  height: 45px;
  
  svg {
    width: 100%;
    height: 100%;
    fill: #FFFFFF;
  }
}

.meter-stats {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  
  &.invisible {
    visibility: hidden;
  }
}

.stat-label {
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}

.action-links {
  display: flex;
  gap: 24px;
  padding: 14px 16px;
  background: #FFFFFF;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.action-link {
  font-size: 15px;
  color: #000;
  cursor: pointer;
  
  &.highlight {
    color: $primary;
  }
}

.details-section {
  background: #F5F5F5;
  padding: 8px 16px;
}

.charge-row {
  display: flex;
  justify-content: space-between;
  background: #FFFFFF;
  padding: 10px 12px;
  margin-bottom: 4px;
  font-size: 15px;
  font-weight: 700;
}

.projected-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin: 0 12px 8px;
}

.projected-label {
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.projected-arrow {
  font-size: 22px;
}

.projected-value {
  font-size: 32px;
  font-weight: 700;
}

.extras-section {
  padding: 8px 16px;
  background: #FFFFFF;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
  background: #F5F5F5;
  margin-top: 8px;
}

.total-label {
  font-size: 36px;
  color: $primary;
}

.total-value {
  font-size: 36px;
  font-weight: 700;
  color: $primary;
}
</style>

