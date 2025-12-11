<template>
  <q-page class="readings-page">
    <!-- Header Section -->
    <div class="readings-header">
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
      
      <div class="page-title">ENTER READINGS</div>
      <div class="period-text">Period - {{ currentPeriod.startDate }} to {{ currentPeriod.endDate }}</div>
    </div>
    
    <!-- WATER SECTION -->
    <div class="meter-section">
      <div class="meter-bar water">
        <div class="meter-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2C12 2 5 10 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 10 12 2 12 2Z"/></svg>
        </div>
        <span class="meter-name">Water</span>
      </div>
      
      <div class="action-links">
        <span class="action-link" :class="{ active: waterMode === 'entry' }" @click="startWaterEntry">Enter reading</span>
        <span class="action-link highlight" @click="waterDetailsOpen = !waterDetailsOpen">
          {{ waterDetailsOpen ? 'Hide Details' : 'Show Details' }}
        </span>
      </div>
      
      <!-- Water Reading Details -->
      <q-slide-transition>
        <div v-show="waterDetailsOpen" class="reading-details">
          <div class="meter-number">Meter Number #{{ water.meterNumber }}</div>
          
          <div class="reading-row">
            <span class="reading-label">Start Reading {{ currentPeriod.startDate }}</span>
            <span class="reading-value">{{ formatWaterReading(water.startReading) }}</span>
          </div>
          
          <div class="reading-row" v-for="(reading, index) in water.readings" :key="'w' + index">
            <span class="reading-label">
              {{ reading.type }}
              <span class="reading-date">{{ reading.date }}</span>
            </span>
            <span class="reading-value">
              {{ formatWaterReading(reading.value) }}
              <span v-if="reading.editable" class="edit-link" @click="editWaterReading(index)">Edit</span>
            </span>
          </div>
          
      <div class="add-reading-link" @click="startWaterEntry" v-if="!water.cooldownActive">
        Add new reading
      </div>
          
          <div v-if="water.cooldownActive" class="cooldown-warning">
            Sorry, your last reading was less than 24 hours ago. Please wait for 
            {{ water.cooldownHours }} hours and {{ water.cooldownMinutes }} minutes before you can add a reading.
          </div>
        </div>
      </q-slide-transition>
      
      <!-- Last input summary -->
      <div class="reading-summary">
        Last input: {{ formatWaterReading(latestWaterReading) }}
      </div>
    </div>
    
    <!-- ELECTRICITY SECTION -->
    <div class="meter-section">
      <div class="meter-bar electricity">
        <div class="meter-icon">
          <svg viewBox="0 0 24 24"><path d="M13 2L4 14H11L10 22L20 10H13L13 2Z"/></svg>
        </div>
        <span class="meter-name">Electricity</span>
      </div>
      
      <div class="action-links">
        <span class="action-link" :class="{ active: elecMode === 'entry' }" @click="startElecEntry">Enter reading</span>
        <span class="action-link highlight" @click="elecDetailsOpen = !elecDetailsOpen">
          {{ elecDetailsOpen ? 'Hide Details' : 'Show Details' }}
        </span>
      </div>
      
      <!-- Electricity Reading Details -->
      <q-slide-transition>
        <div v-show="elecDetailsOpen" class="reading-details">
          <div class="meter-number">Meter Number #{{ electricity.meterNumber }}</div>
          
          <div class="reading-row">
            <span class="reading-label">Start Reading {{ currentPeriod.startDate }}</span>
            <span class="reading-value">{{ electricity.startReading }}</span>
          </div>
          
          <div class="reading-row" v-for="(reading, index) in electricity.readings" :key="'e' + index">
            <span class="reading-label">
              {{ reading.type }}
              <span class="reading-date" v-if="reading.date">{{ reading.date }}</span>
            </span>
            <span class="reading-value">
              {{ reading.value }}
              <span v-if="reading.editable" class="edit-link" @click="editElecReading(index)">Edit</span>
            </span>
          </div>
          
      <div class="add-reading-link" @click="startElecEntry" v-if="!electricity.cooldownActive">
        Add new reading
      </div>
          
          <div v-if="electricity.cooldownActive" class="cooldown-warning">
            Sorry, your last reading was less than 24 hours ago. Please wait for 
            {{ electricity.cooldownHours }} hours and {{ electricity.cooldownMinutes }} minutes before you can add a reading.
          </div>
        </div>
      </q-slide-transition>
      
      <div class="reading-summary">
        Last input: {{ latestElecReading }}
      </div>
    </div>

    <!-- KEYPAD OVERLAY -->
    <q-dialog v-model="keypad.open" persistent position="bottom">
      <q-card class="keypad-card">
        <div class="keypad-display">
          <template v-if="keypad.mode === 'water'">
            <span v-for="(d, i) in water.blackDigits" :key="'d'+i" class="digit-head black">{{ d }}</span>
            <span class="digit-head sep">-</span>
            <span v-for="(d, i) in water.redDigits" :key="'r'+i" class="digit-head red">{{ d }}</span>
          </template>
          <template v-else>
            <span v-for="(d, i) in electricity.digits" :key="'e'+i" class="digit-head black">{{ d }}</span>
          </template>
        </div>

        <div class="keypad">
          <div class="keypad-row" v-for="row in keypadRows" :key="'kr'+row.join('')">
            <button class="keypad-btn" v-for="key in row" :key="key" @click="handleKeyPress(key)">
              <span v-if="key !== '⌫'">{{ key }}</span>
              <span v-else>⌫</span>
            </button>
          </div>
        </div>

        <div class="keypad-actions">
          <button class="action-btn cancel" @click="cancelKeypad">CANCEL</button>
          <button class="action-btn enter" @click="confirmKeypad">ENTER</button>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ReadingsPage',
  
  setup() {
    const $q = useQuasar();
    const currentDate = ref(new Date());
    const currentPeriodIndex = ref(0);
    
    // UI State
    const waterMode = ref('entry');
    const elecMode = ref('entry');
    const waterDetailsOpen = ref(true);
    const elecDetailsOpen = ref(true);
    const waterActiveIndex = ref(-1);
    const elecActiveIndex = ref(-1);
    const keypad = reactive({
      open: false,
      mode: 'water', // 'water' | 'elec'
      restoreWater: null,
      restoreElec: null,
    });
    
    // Period data (3 months)
    const periods = ref([
      { startDate: '10 Apr 2025', endDate: '10 May 2025', dueDate: new Date('2025-04-27') },
      { startDate: '10 Mar 2025', endDate: '10 Apr 2025', dueDate: new Date('2025-03-27') },
      { startDate: '10 Feb 2025', endDate: '10 Mar 2025', dueDate: new Date('2025-02-27') },
    ]);
    
    const currentPeriod = computed(() => periods.value[currentPeriodIndex.value]);
    
    // Water meter data
    const water = reactive({
      meterNumber: '132452',
      startReading: { red: '45', black: '09140' }, // Water: RED (left) - BLACK (right)
      blackDigits: ['0', '9', '6', '5', '3'],
      redDigits: ['2', '5'],
      readings: [
        { type: 'Final Estimated', date: '17th April', value: { red: '25', black: '09653' }, editable: true }
      ],
      cooldownActive: true,
      cooldownHours: 17,
      cooldownMinutes: 20,
    });
    
    // Electricity meter data
    const electricity = reactive({
      meterNumber: '98736',
      startReading: '763456',
      digits: ['7', '6', '4', '3', '5', '1'],
      readings: [
        { type: 'Estimated', date: '', value: '', editable: false }
      ],
      cooldownActive: false,
      cooldownHours: 0,
      cooldownMinutes: 0,
    });
    
    const keypadRows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['.', '0', '⌫']
    ];
    
    const daysUntilDue = computed(() => {
      const today = new Date();
      const due = currentPeriod.value.dueDate;
      return Math.max(0, Math.ceil((due - today) / (1000 * 60 * 60 * 24)));
    });
    
    const dueBadgeClass = computed(() => {
      if (daysUntilDue.value <= 3) return 'urgent';
      if (daysUntilDue.value <= 7) return 'warning';
      return '';
    });
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    const formatWaterReading = (reading) => {
      if (typeof reading === 'object') {
        // Water: RED (left, 2 digits) - BLACK (right, 5 digits)
        return `${reading.red} - ${reading.black}`;
      }
      return reading;
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
    
    const latestWaterReading = computed(() => water.readings[water.readings.length - 1].value);
    const latestElecReading = computed(() => {
      const last = electricity.readings[electricity.readings.length - 1];
      return last.value || electricity.digits.join('');
    });

    // Open keypad helpers
    const openKeypad = (mode) => {
      keypad.mode = mode;
      keypad.open = true;
      if (mode === 'water') {
        waterActiveIndex.value = 0;
        elecActiveIndex.value = -1;
        keypad.restoreWater = {
          black: [...water.blackDigits],
          red: [...water.redDigits],
        };
      } else {
        elecActiveIndex.value = 0;
        waterActiveIndex.value = -1;
        keypad.restoreElec = [...electricity.digits];
      }
    };

    // Water digit functions
    const startWaterEntry = () => openKeypad('water');
    const editWaterReading = (index) => {
      const reading = water.readings[index];
      // Water: RED (left) - BLACK (right)
      water.redDigits = reading.value.red.split('');
      water.blackDigits = reading.value.black.split('');
      openKeypad('water');
    };

    // Electricity digit functions
    const startElecEntry = () => openKeypad('elec');
    const editElecReading = (index) => {
      const reading = electricity.readings[index];
      if (reading.value) {
        electricity.digits = reading.value.padStart(6, '0').split('');
      }
      openKeypad('elec');
    };

    // Unified keypad handler
    const handleKeyPress = (key) => {
      if (keypad.mode === 'water') {
        const idx = waterActiveIndex.value;
        if (idx < 0) return;
        if (key === '⌫') {
          if (idx < 5) water.blackDigits[idx] = '0'; else water.redDigits[idx - 5] = '0';
          if (idx > 0) waterActiveIndex.value = idx - 1;
          return;
        }
        if (key === '.') return; // ignore decimals
        if (idx < 5) water.blackDigits[idx] = key; else water.redDigits[idx - 5] = key;
        if (idx < 6) waterActiveIndex.value = idx + 1; else waterActiveIndex.value = 6;
      } else {
        const idx = elecActiveIndex.value;
        if (idx < 0) return;
        if (key === '⌫') {
          electricity.digits[idx] = '0';
          if (idx > 0) elecActiveIndex.value = idx - 1;
          return;
        }
        if (key === '.') return;
        electricity.digits[idx] = key;
        if (idx < 5) elecActiveIndex.value = idx + 1; else elecActiveIndex.value = 5;
      }
    };

    const cancelKeypad = () => {
      if (keypad.mode === 'water' && keypad.restoreWater) {
        water.blackDigits = [...keypad.restoreWater.black];
        water.redDigits = [...keypad.restoreWater.red];
      }
      if (keypad.mode === 'elec' && keypad.restoreElec) {
        electricity.digits = [...keypad.restoreElec];
      }
      keypad.open = false;
      waterActiveIndex.value = -1;
      elecActiveIndex.value = -1;
    };

    const confirmKeypad = () => {
      if (keypad.mode === 'water') {
        const val = { black: water.blackDigits.join(''), red: water.redDigits.join('') };
        // enforce last editable only
        water.readings.forEach((r, idx) => (r.editable = idx === water.readings.length - 1));
        water.readings[water.readings.length - 1].value = val;
        $q.notify({ type: 'positive', message: 'Water reading updated' });
      } else {
        const val = electricity.digits.join('');
        electricity.readings.forEach((r, idx) => (r.editable = idx === electricity.readings.length - 1));
        electricity.readings[electricity.readings.length - 1].value = val;
        $q.notify({ type: 'positive', message: 'Electricity reading updated' });
      }
      keypad.open = false;
      waterActiveIndex.value = -1;
      elecActiveIndex.value = -1;
    };
    
    return {
      currentDate,
      currentPeriodIndex,
      currentPeriod,
      periods,
      daysUntilDue,
      dueBadgeClass,
      waterMode,
      elecMode,
      waterDetailsOpen,
      elecDetailsOpen,
      showWaterKeypad,
      showElecKeypad,
      waterActiveIndex,
      elecActiveIndex,
      water,
      electricity,
      keypadRows,
      formatDate,
      formatWaterReading,
      prevPeriod,
      nextPeriod,
      startWaterEntry,
      editWaterReading,
      startElecEntry,
      editElecReading,
      handleKeyPress,
      cancelKeypad,
      confirmKeypad,
      keypad,
      latestWaterReading,
      latestElecReading,
    };
  }
});
</script>

<style lang="scss" scoped>
.readings-page {
  background: #FFFFFF;
  min-height: 100vh;
  padding-bottom: 20px;
}

.readings-header {
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
  
  .days { font-weight: 700; }
  
  &.warning { background: #f2c037; }
  &.urgent { background: #c10015; }
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

.meter-section {
  margin-bottom: 16px;
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
  
  &.active { font-weight: 500; }
  &.highlight { color: $primary; }
}

.reading-details {
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

.reading-summary {
  padding: 12px 16px;
  font-size: 15px;
  color: #000;
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
  margin: 12px 0;
  font-size: 14px;
  color: #856404;
  line-height: 1.5;
}

.digit-display {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 20px 16px;
  background: #FFFFFF;
}

.digit-box {
  width: 38px;
  height: 50px;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
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
    border-color: $primary;
  }
}

.digit-separator {
  display: flex;
  align-items: center;
  font-size: 26px;
  font-weight: 700;
  color: #000;
  padding: 0 4px;
}

.keypad-card {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  border: 1px solid #3a88b3;
  border-radius: 0;
}

.keypad-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  min-height: 46px;
}

.digit-head {
  font-size: 26px;
  font-weight: 700;
}
.digit-head.black { color: #000; }
.digit-head.red { color: #cc0000; }
.digit-head.sep { padding: 0 4px; }

.keypad {
  background: #ffffff;
  padding: 0;
}

.keypad-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid #e0e0e0;
}

.keypad-btn {
  height: 56px;
  border: 1px solid #e0e0e0;
  border-left: none;
  border-top: none;
  background: #ffffff;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}

.keypad-actions {
  display: flex;
  gap: 12px;
  padding: 12px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.action-btn.cancel {
  background: #2f7088;
  color: #ffffff;
}

.action-btn.enter {
  background: $primary;
  color: #ffffff;
}

.update-btn {
  display: block;
  width: calc(100% - 32px);
  margin: 12px 16px;
  padding: 14px;
  background: $primary;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  
  &:hover {
    background: darken($primary, 8%);
  }
}
</style>

