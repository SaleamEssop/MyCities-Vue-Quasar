<template>
  <div class="bill-header">
    <div class="current-date">Current date: {{ formatDate(currentDate) }}</div>
    
    <div class="nav-row">
      <q-btn
        flat
        round
        dense
        icon="chevron_left"
        :disable="!canGoPrev"
        @click="$emit('prev')"
        class="nav-arrow-btn"
      />
      
      <q-badge
        :color="badgeColor"
        text-color="white"
        class="due-badge"
      >
        Final Reading due in <span class="days">{{ daysUntilDue }} days</span>
      </q-badge>
      
      <q-btn
        flat
        round
        dense
        icon="chevron_right"
        :disable="!canGoNext"
        @click="$emit('next')"
        class="nav-arrow-btn"
      />
    </div>
    
    <div v-if="showAmount" class="header-amount">R{{ formatCurrency(amount) }}</div>
    
    <div v-if="showTitle" class="page-title">{{ title }}</div>
    
    <div class="period-text">Period - {{ periodStart }} to {{ periodEnd }}</div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'BillHeader',
  
  props: {
    currentDate: {
      type: Date,
      default: () => new Date()
    },
    daysUntilDue: {
      type: Number,
      required: true
    },
    periodStart: {
      type: String,
      required: true
    },
    periodEnd: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    showAmount: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    canGoPrev: {
      type: Boolean,
      default: true
    },
    canGoNext: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['prev', 'next'],
  
  setup(props) {
    const badgeColor = computed(() => {
      if (props.daysUntilDue <= 3) return 'negative';
      if (props.daysUntilDue <= 7) return 'warning';
      return 'positive';
    });
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    const formatCurrency = (amount) => {
      return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    return {
      badgeColor,
      formatDate,
      formatCurrency
    };
  }
});
</script>

<style lang="scss" scoped>
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

.nav-arrow-btn {
  color: #000;
  min-width: 40px;
}

.due-badge {
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  
  .days {
    font-weight: 700;
  }
}

.header-amount {
  font-size: 36px;
  font-weight: 700;
  color: $primary;
  text-align: center;
  margin: 16px 0 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: $primary;
  text-align: center;
  margin: 12px 0 8px;
}

.period-text {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  text-align: center;
}
</style>
