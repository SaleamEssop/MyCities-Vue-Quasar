<template>
  <div class="meter-reading-entry">
    <div class="meter-number">Meter Number #{{ meterNumber }}</div>
    
    <div class="reading-row" v-for="(reading, index) in readings" :key="index">
      <span class="reading-label">
        {{ reading.label }}
        <span v-if="reading.date" class="reading-date">{{ reading.date }}</span>
      </span>
      <span class="reading-value">
        <span
          v-if="reading.editable"
          class="edit-link"
          @click="$emit('edit', reading, index)"
        >
          Edit
        </span>
        {{ formatReading(reading.value) }}
      </span>
    </div>
    
    <div
      v-if="showAddLink && !cooldownActive"
      class="add-reading-link"
      @click="$emit('add')"
    >
      Add new reading
    </div>
    
    <div v-if="cooldownActive" class="cooldown-warning">
      Sorry, your last reading was less than 24 hours ago. Please wait for 
      {{ cooldownHours }} hours and {{ cooldownMinutes }} minutes before you can add a reading.
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MeterReadingEntry',
  
  props: {
    meterNumber: {
      type: String,
      required: true
    },
    readings: {
      type: Array,
      default: () => [],
      validator: (readings) => {
        return readings.every(r => r.label && r.value !== undefined);
      }
    },
    showAddLink: {
      type: Boolean,
      default: true
    },
    cooldownActive: {
      type: Boolean,
      default: false
    },
    cooldownHours: {
      type: Number,
      default: 0
    },
    cooldownMinutes: {
      type: Number,
      default: 0
    },
    meterType: {
      type: String,
      default: 'water'
    }
  },
  
  emits: ['add', 'edit'],
  
  setup(props) {
    const formatReading = (value) => {
      if (!value) return '';
      if (typeof value === 'object' && value.black && value.red) {
        return `${value.black} - ${value.red}`;
      }
      return value;
    };
    
    return {
      formatReading
    };
  }
});
</script>

<style lang="scss" scoped>
.meter-reading-entry {
  padding: 16px;
  background: #FFFFFF;
}

.meter-number {
  font-size: 15px;
  color: #000;
  margin-bottom: 16px;
}

.reading-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.reading-label {
  font-size: 15px;
  color: #000;
  
  .reading-date {
    display: block;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.6);
  }
}

.reading-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-link {
  color: $primary;
  font-size: 13px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  order: -1; /* Move to left */
}

.add-reading-link {
  color: $primary;
  font-size: 15px;
  text-align: center;
  padding: 16px;
  cursor: pointer;
}

.cooldown-warning {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 14px 16px;
  margin: 12px 0;
  font-size: 14px;
  color: #856404;
  line-height: 1.5;
}
</style>

