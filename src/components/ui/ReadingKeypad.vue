<template>
  <q-dialog
    v-model="localVisible"
    position="bottom"
    :maximized="false"
    @hide="$emit('cancel')"
  >
    <q-card class="keypad-card">
      <!-- Digit Display Strip - Grouped with Cursor -->
      <div class="digit-display-strip">
        <!-- Water: Red group (LEFT, 2 digits) + Black group (RIGHT, 5 digits) -->
        <template v-if="meterType === 'water'">
          <div
            class="digit-group red-group"
            :class="{ active: activeGroup === 'red' }"
            @click="selectGroup('red')"
          >
            <span v-if="isGroupEmpty('red') && activeGroup !== 'red'" class="cursor red-cursor">_</span>
            <span v-else>{{ redGroupValue }}</span>
          </div>
          <div class="digit-separator">-</div>
          <div
            class="digit-group black-group"
            :class="{ active: activeGroup === 'black' }"
            @click="selectGroup('black')"
          >
            <span v-if="isGroupEmpty('black') && activeGroup !== 'black'" class="cursor black-cursor">_</span>
            <span v-else>{{ blackGroupValue }}</span>
          </div>
        </template>
        
        <!-- Electricity: Single black group (6 digits) -->
        <template v-else>
          <div
            class="digit-group black-group"
            :class="{ active: activeGroup === 'black' }"
            @click="selectGroup('black')"
          >
            <span v-if="isGroupEmpty('black') && activeGroup !== 'black'" class="cursor black-cursor">_</span>
            <span v-else>{{ blackGroupValue }}</span>
          </div>
        </template>
      </div>
      
      <!-- Numeric Keypad -->
      <div class="keypad-grid">
        <q-btn
          v-for="key in keypadKeys"
          :key="key"
          flat
          unelevated
          class="keypad-btn"
          :label="getKeyLabel(key)"
          @click="handleKeyPress(key)"
        />
      </div>
      
      <!-- Action Buttons -->
      <div class="keypad-actions">
        <q-btn
          flat
          unelevated
          class="action-btn cancel-btn"
          label="CANCEL"
          @click="handleCancel"
        />
        <q-btn
          flat
          unelevated
          class="action-btn enter-btn"
          label="ENTER"
          @click="handleEnter"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
  name: 'ReadingKeypad',
  
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    meterType: {
      type: String,
      default: 'water', // 'water' or 'electricity'
      validator: (val) => ['water', 'electricity'].includes(val)
    },
    initialValue: {
      type: String,
      default: ''
    }
  },
  
  emits: ['update:modelValue', 'enter', 'cancel', 'change'],
  
  setup(props, { emit }) {
    const localVisible = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val)
    });
    
    // Water: 5 black + 2 red = 7 digits total
    // Electricity: 6 black digits
    const totalDigits = computed(() => props.meterType === 'water' ? 7 : 6);
    const showSeparator = computed(() => props.meterType === 'water');
    
    const blackDigits = ref([]);
    const redDigits = ref([]);
    const activeGroup = ref(null); // 'black' or 'red'
    const currentIndex = ref(0);
    
    // Initialize digits arrays
    const initDigits = () => {
      if (props.initialValue && props.initialValue !== '') {
        // Parse initial value
        if (props.meterType === 'water') {
          // Format: "25-9653" (red-black) or "9653-25" (black-red)
          // Check if format is red-black or black-red
          const parts = props.initialValue.includes('-') 
            ? props.initialValue.split('-')
            : [props.initialValue.slice(0, 2), props.initialValue.slice(2)];
          // Water: LEFT is RED (2 digits), RIGHT is BLACK (5 digits)
          redDigits.value = parts[0].padStart(2, '0').split('');
          blackDigits.value = parts[1].padStart(5, '0').split('');
        } else {
          blackDigits.value = props.initialValue.padStart(6, '0').split('');
          redDigits.value = [];
        }
      } else {
        // Start with all zeros (will show cursor)
        if (props.meterType === 'water') {
          redDigits.value = Array(2).fill('0');
          blackDigits.value = Array(5).fill('0');
        } else {
          blackDigits.value = Array(6).fill('0');
          redDigits.value = [];
        }
      }
      currentIndex.value = 0;
      activeGroup.value = null;
    };
    
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        initDigits();
      }
    }, { immediate: true });
    
    const blackGroupValue = computed(() => {
      return blackDigits.value.join('');
    });
    
    const redGroupValue = computed(() => {
      return redDigits.value.join('');
    });
    
    const selectGroup = (group) => {
      activeGroup.value = group;
      currentIndex.value = 0;
    };
    
    const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];
    
    const getKeyLabel = (key) => {
      if (key === 'backspace') return '⌫';
      return key;
    };
    
    const handleKeyPress = (key) => {
      if (!activeGroup.value) {
        // No group selected, ignore
        return;
      }
      
      const targetDigits = activeGroup.value === 'black' ? blackDigits.value : redDigits.value;
      const maxLength = activeGroup.value === 'black' 
        ? (props.meterType === 'water' ? 5 : 6)
        : 2;
      
      if (key === 'backspace') {
        // Delete: erase all numerals ending in a single 0 digit
        // If last digit is 0, set all to 0, otherwise just set last to 0
        if (targetDigits[maxLength - 1] === '0') {
          // All digits ending in 0, erase all
          for (let i = 0; i < maxLength; i++) {
            targetDigits[i] = '0';
          }
        } else {
          // Set last digit to 0
          targetDigits[maxLength - 1] = '0';
        }
        currentIndex.value = 0;
      } else if (key === '.') {
        // Skip decimal for now
        return;
      } else {
        // If group is empty, start from beginning
        const isEmpty = activeGroup.value === 'red' 
          ? redGroupValue.value === '00'
          : (props.meterType === 'water' ? blackGroupValue.value === '00000' : blackGroupValue.value === '000000');
        
        if (isEmpty) {
          currentIndex.value = 0;
        }
        
        if (currentIndex.value < maxLength) {
          targetDigits[currentIndex.value] = key;
          if (currentIndex.value < maxLength - 1) {
            currentIndex.value++;
          }
        }
      }
      emit('change', getCurrentValue());
    };
    
    const getCurrentValue = () => {
      if (props.meterType === 'water') {
        // Water: RED (left, 2 digits) - BLACK (right, 5 digits)
        return `${redGroupValue.value}-${blackGroupValue.value}`;
      }
      return blackGroupValue.value;
    };
    
    const isGroupEmpty = (group) => {
      if (group === 'red') {
        return redGroupValue.value === '00';
      }
      if (props.meterType === 'water') {
        return blackGroupValue.value === '00000';
      }
      return blackGroupValue.value === '000000';
    };
    
    const handleCancel = () => {
      emit('cancel');
      localVisible.value = false;
    };
    
    const handleEnter = () => {
      emit('enter', getCurrentValue());
      localVisible.value = false;
    };
    
    return {
      localVisible,
      totalDigits,
      showSeparator,
      blackGroupValue,
      redGroupValue,
      activeGroup,
      selectGroup,
      isGroupEmpty,
      keypadKeys,
      getKeyLabel,
      handleKeyPress,
      handleCancel,
      handleEnter
    };
  }
});
</script>

<style lang="scss" scoped>
.keypad-card {
  border-radius: 16px 16px 0 0;
  max-width: 100%;
}

.digit-display-strip {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #FFFFFF;
  border: 1px solid #e0e0e0;
  margin: 8px;
  border-radius: 4px;
}

.digit-group {
  flex: 1;
  min-height: 48px;
  border: 2px solid;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  background: #FFFFFF;
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.2s;
  
  &.black-group {
    color: #000;
    border-color: #000;
    
    &.active {
      background: #e3f2fd;
      border-width: 3px;
      border-color: $primary;
    }
  }
  
  &.red-group {
    color: #cc0000;
    border-color: #cc0000;
    
    &.active {
      background: #ffebee;
      border-width: 3px;
      border-color: #cc0000;
    }
  }
}

.digit-separator {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #000;
  padding: 0 4px;
}

.cursor {
  font-size: 32px;
  font-weight: 700;
  animation: blink 1s infinite;
}

.cursor.red-cursor {
  color: #cc0000;
}

.cursor.black-cursor {
  color: #000;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: #FFFFFF;
  border-top: 1px solid #e0e0e0;
}

.keypad-btn {
  min-height: 60px;
  border: 1px solid #e0e0e0;
  border-left: none;
  border-top: none;
  border-radius: 0;
  font-size: 24px;
  font-weight: 500;
  color: #000;
  
  &:nth-child(3n+1) {
    border-left: 1px solid #e0e0e0;
  }
  
  &:nth-child(-n+3) {
    border-top: 1px solid #e0e0e0;
  }
}

.keypad-actions {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #000;
}

.action-btn {
  flex: 1;
  min-height: 48px;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  
  &.cancel-btn {
    background: #2f7088;
    color: #FFFFFF;
  }
  
  &.enter-btn {
    background: $primary;
    color: #FFFFFF;
  }
}
</style>

