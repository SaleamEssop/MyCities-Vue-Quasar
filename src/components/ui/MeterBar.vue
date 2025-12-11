<template>
  <div class="meter-bar" :class="type">
    <div class="meter-icon">
      <q-icon :name="icon" size="45px" color="white" />
    </div>
    
    <div v-if="showStats" class="meter-stats">
      <div class="stat-item" v-for="(stat, index) in stats" :key="index">
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value">{{ stat.value }}</div>
      </div>
    </div>
    
    <span v-else class="meter-name">{{ name }}</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MeterBar',
  
  props: {
    type: {
      type: String,
      default: 'water', // 'water' or 'electricity'
      validator: (val) => ['water', 'electricity'].includes(val)
    },
    name: {
      type: String,
      default: 'Water'
    },
    icon: {
      type: String,
      default: 'water_drop'
    },
    stats: {
      type: Array,
      default: () => []
    },
    showStats: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="scss" scoped>
.meter-bar {
  background: $primary;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.meter-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.meter-name {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
}

.meter-stats {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
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
</style>



