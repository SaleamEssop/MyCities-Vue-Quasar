<template>
  <div class="meter-usage-card">
    <MeterBar
      :type="meterType"
      :name="meterName"
      :icon="icon"
      :stats="stats"
      :show-stats="true"
    />
    
    <ActionLinks
      :links="actionLinks"
      @click="handleActionClick"
    />
    
    <q-slide-transition>
      <div v-show="detailsOpen" class="details-section">
        <div
          v-for="(charge, index) in charges"
          :key="index"
          class="charge-row"
        >
          <span class="charge-label">{{ charge.label }}</span>
          <span class="charge-value">R{{ formatCurrency(charge.amount) }}</span>
        </div>
      </div>
    </q-slide-transition>
    
    <div class="projected-row">
      <span class="projected-label">Projected charges <span class="projected-arrow">→</span></span>
      <span class="projected-value">R {{ formatCurrency(projected) }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import MeterBar from './MeterBar.vue';
import ActionLinks from './ActionLinks.vue';

export default defineComponent({
  name: 'MeterUsageCard',
  
  components: {
    MeterBar,
    ActionLinks
  },
  
  props: {
    meterType: {
      type: String,
      default: 'water',
      validator: (val) => ['water', 'electricity'].includes(val)
    },
    meterName: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'water_drop'
    },
    stats: {
      type: Array,
      required: true
    },
    charges: {
      type: Array,
      default: () => []
    },
    projected: {
      type: Number,
      required: true
    },
    showEnterReading: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['enter-reading'],
  
  setup(props, { emit }) {
    const detailsOpen = ref(false);
    
    const actionLinks = computed(() => {
      const links = [];
      if (props.showEnterReading) {
        links.push({
          label: 'Enter reading',
          action: 'enter-reading',
          active: false
        });
      }
      links.push({
        label: detailsOpen.value ? 'Hide Details' : 'Show Details',
        action: 'toggle-details',
        highlight: true
      });
      return links;
    });
    
    const handleActionClick = (action) => {
      if (action === 'toggle-details') {
        detailsOpen.value = !detailsOpen.value;
      } else if (action === 'enter-reading') {
        emit('enter-reading');
      }
    };
    
    const formatCurrency = (amount) => {
      return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    return {
      detailsOpen,
      actionLinks,
      handleActionClick,
      formatCurrency
    };
  }
});
</script>

<style lang="scss" scoped>
.meter-usage-card {
  margin-bottom: 8px;
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
</style>
