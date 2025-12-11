<template>
  <q-page class="reading-page">
    <!-- Header Section -->
    <div class="reading-header">
      <div class="current-date">Current date: {{ formatDate(currentDate) }}</div>
      
      <div class="nav-row">
        <div class="nav-arrow left" @click="$router.back()"></div>
        <div class="due-badge">
          Final Reading due in <span class="days">{{ daysUntilDue }} days</span>
        </div>
        <div class="nav-arrow right disabled"></div>
      </div>
      
      <div class="page-title">ENTER READINGS</div>
      <div class="period-text">Period - {{ period.startDate }} to {{ period.endDate }}</div>
    </div>
    
    <!-- Water Meter Bar -->
    <div class="meter-bar">
      <div class="meter-icon">
        <svg viewBox="0 0 24 24"><path d="M12 2C12 2 5 10 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 10 12 2 12 2Z"/></svg>
      </div>
      <span class="meter-name">Water</span>
    </div>
    
    <!-- Action Links -->
    <div class="action-links">
      <span class="action-link active">Enter reading</span>
      <span class="action-link highlight" @click="detailsOpen = !detailsOpen">
        {{ detailsOpen ? 'Hide Details' : 'Show Details' }}
      </span>
    </div>
    
    <!-- Reading Section -->
    <div class="reading-section">
      <div class="meter-number">Meter Number #{{ meterNumber }}</div>
      
      <div class="reading-row">
        <span class="reading-label">Start Reading {{ period.startDate }}</span>
        <span class="reading-value">{{ formatReading(startReading) }}</span>
      </div>
      
      <div class="reading-row" v-for="(reading, index) in readings" :key="index">
        <span class="reading-label">
          {{ reading.type }}
          <span class="reading-date">{{ reading.date }}</span>
        </span>
        <span class="reading-value">
          {{ formatReading(reading.value) }}
          <span v-if="reading.editable" class="edit-link" @click="editReading(index)">Edit</span>
        </span>
      </div>
    </div>
    
    <!-- Add New Reading Link -->
    <div class="add-reading-link" @click="showAddReading" v-if="!cooldownActive">
      Add new reading
    </div>
    
    <!-- Cooldown Warning -->
    <div v-if="cooldownActive" class="cooldown-warning">
      Sorry, your last reading was less than 24 hours ago. Please wait for 
      {{ cooldownHours }} hours and {{ cooldownMinutes }} minutes before you can add a reading.
    </div>
    
    <!-- Digit Display -->
    <div class="digit-display">
      <!-- 5 Black digits -->
      <div 
        v-for="(digit, index) in blackDigits" 
        :key="'b' + index"
        class="digit-box black"
        :class="{ active: activeDigitIndex === index }"
        @click="selectDigit(index)"
      >
        {{ digit }}
      </div>
      
      <!-- Separator -->
      <div class="digit-separator">-</div>
      
      <!-- 2 Red digits -->
      <div 
        v-for="(digit, index) in redDigits" 
        :key="'r' + index"
        class="digit-box red"
        :class="{ active: activeDigitIndex === 5 + index }"
        @click="selectDigit(5 + index)"
      >
        {{ digit }}
      </div>
    </div>
    
    <!-- Keypad (shown when entering) -->
    <q-slide-transition>
      <div v-if="showKeypad" class="keypad">
        <div class="keypad-row" v-for="row in keypadRows" :key="row.join('')">
          <button 
            v-for="key in row" 
            :key="key"
            class="keypad-btn"
            @click="handleKeyPress(key)"
          >
            {{ key }}
          </button>
        </div>
      </div>
    </q-slide-transition>
    
    <!-- Update Button -->
    <button class="update-btn" @click="submitReading" :disabled="!isValidReading">
      UPDATE
    </button>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'WaterReadingPage',
  
  setup() {
    const $q = useQuasar();
    const currentDate = ref(new Date());
    const detailsOpen = ref(true);
    const showKeypad = ref(false);
    const activeDigitIndex = ref(-1);
    
    // Meter data
    const meterNumber = ref('132452');
    const startReading = ref({ black: '09140', red: '45' });
    
    // Current reading being entered (5 black + 2 red digits)
    const blackDigits = ref(['0', '9', '6', '5', '3']);
    const redDigits = ref(['2', '5']);
    
    // Period info
    const period = ref({
      startDate: '10th April',
      endDate: '10th May',
      dueDate: new Date('2025-04-27')
    });
    
    // Reading history
    const readings = ref([
      { type: 'Final Estimated', date: '17th April', value: { black: '09653', red: '25' }, editable: true }
    ]);
    
    // Cooldown state
    const cooldownActive = ref(true);
    const cooldownHours = ref(17);
    const cooldownMinutes = ref(20);
    
    const keypadRows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['C', '0', '⌫']
    ];
    
    const daysUntilDue = computed(() => {
      const today = new Date();
      const due = period.value.dueDate;
      return Math.max(0, Math.ceil((due - today) / (1000 * 60 * 60 * 24)));
    });
    
    const isValidReading = computed(() => {
      const blackVal = parseInt(blackDigits.value.join(''));
      const startBlack = parseInt(startReading.value.black);
      return blackVal >= startBlack;
    });
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    const formatReading = (reading) => {
      if (typeof reading === 'object') {
        return `${reading.black} - ${reading.red}`;
      }
      return reading;
    };
    
    const selectDigit = (index) => {
      activeDigitIndex.value = index;
      showKeypad.value = true;
    };
    
    const handleKeyPress = (key) => {
      const idx = activeDigitIndex.value;
      if (idx < 0) return;
      
      if (key === 'C') {
        // Clear all
        blackDigits.value = ['0', '0', '0', '0', '0'];
        redDigits.value = ['0', '0'];
        activeDigitIndex.value = 0;
      } else if (key === '⌫') {
        // Backspace
        if (idx < 5) {
          blackDigits.value[idx] = '0';
        } else {
          redDigits.value[idx - 5] = '0';
        }
        if (idx > 0) {
          activeDigitIndex.value = idx - 1;
        }
      } else {
        // Number input
        if (idx < 5) {
          blackDigits.value[idx] = key;
        } else {
          redDigits.value[idx - 5] = key;
        }
        // Auto-advance
        if (idx < 6) {
          activeDigitIndex.value = idx + 1;
        } else {
          showKeypad.value = false;
          activeDigitIndex.value = -1;
        }
      }
    };
    
    const showAddReading = () => {
      showKeypad.value = true;
      activeDigitIndex.value = 0;
    };
    
    const editReading = (index) => {
      const reading = readings.value[index];
      blackDigits.value = reading.value.black.split('');
      redDigits.value = reading.value.red.split('');
      showKeypad.value = true;
      activeDigitIndex.value = 0;
    };
    
    const submitReading = () => {
      if (!isValidReading.value) {
        $q.notify({ type: 'negative', message: 'Reading cannot be less than start reading' });
        return;
      }
      
      const newReading = {
        black: blackDigits.value.join(''),
        red: redDigits.value.join('')
      };
      
      $q.notify({ type: 'positive', message: 'Reading updated successfully!' });
      showKeypad.value = false;
      activeDigitIndex.value = -1;
    };
    
    return {
      currentDate,
      detailsOpen,
      showKeypad,
      activeDigitIndex,
      meterNumber,
      startReading,
      blackDigits,
      redDigits,
      period,
      readings,
      cooldownActive,
      cooldownHours,
      cooldownMinutes,
      keypadRows,
      daysUntilDue,
      isValidReading,
      formatDate,
      formatReading,
      selectDigit,
      handleKeyPress,
      showAddReading,
      editReading,
      submitReading,
    };
  }
});
</script>

<style lang="scss" scoped>
.reading-page {
  background: #FFFFFF;
  min-height: 100vh;
}

.reading-header {
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

.meter-name {
  font-size: 24px;
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
  
  &.active {
    font-weight: 500;
  }
  
  &.highlight {
    color: $primary;
  }
}

.reading-section {
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
}

.edit-link {
  color: $primary;
  font-size: 13px;
  margin-left: 8px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
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
  margin: 12px 16px;
  font-size: 14px;
  color: #856404;
  line-height: 1.5;
}

.digit-display {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 24px 16px;
  background: #FFFFFF;
}

.digit-box {
  width: 40px;
  height: 52px;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  
  &.black {
    color: #000;
    border-color: #000;
  }
  
  &.red {
    color: #cc0000;
    border-color: #cc0000;
  }
  
  &.active {
    background: #e3f2fd;
    border-width: 3px;
  }
}

.digit-separator {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  color: #000;
  padding: 0 4px;
}

.keypad {
  background: #f5f5f5;
  padding: 12px;
}

.keypad-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.keypad-btn {
  width: 64px;
  height: 48px;
  border: none;
  border-radius: 4px;
  background: #FFFFFF;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:active {
    background: #e0e0e0;
  }
}

.update-btn {
  display: block;
  width: calc(100% - 32px);
  margin: 16px;
  padding: 16px;
  background: $primary;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  
  &:hover {
    background: darken($primary, 8%);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
</style>


