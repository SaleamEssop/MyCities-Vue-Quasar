<template>
  <div class="numeric-keypad" data-test="numeric-keypad">
    <div class="keypad-grid">
      <q-btn
        v-for="key in keypadKeys"
        :key="key"
        flat
        unelevated
        class="keypad-btn"
        :label="getKeyLabel(key)"
        :aria-label="`Key ${key === 'backspace' ? 'backspace' : key}`"
        :data-test="`keypad-key-${key === 'backspace' ? 'backspace' : key}`"
        @click="handleKeyPress(key)"
      />
    </div>
    
    <div class="keypad-actions">
      <q-btn
        flat
        unelevated
        class="action-btn clear-btn"
        label="CLEAR"
        aria-label="Clear active group"
        data-test="keypad-clear"
        @click="handleClear"
      />
      <q-btn
        flat
        unelevated
        class="action-btn enter-btn"
        label="ENTER"
        aria-label="Enter reading"
        data-test="keypad-enter"
        @click="handleEnter"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeGroup: {
    type: String,
    default: null, // 'kiloliters' or 'liters'
  },
});

const emit = defineEmits(['keypress', 'clear', 'enter']);

const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

const getKeyLabel = (key) => {
  if (key === 'backspace') return '⌫';
  return key;
};

const handleKeyPress = (key) => {
  if (!props.activeGroup) {
    return; // No active group, ignore
  }
  
  if (key === 'backspace') {
    emit('clear');
  } else if (key === '.') {
    // Skip decimal for now (water meters don't use decimals)
    return;
  } else if (/[0-9]/.test(key)) {
    emit('keypress', key);
  }
};

const handleClear = () => {
  if (props.activeGroup) {
    emit('clear');
  }
};

const handleEnter = () => {
  emit('enter');
};
</script>

<style scoped>
.numeric-keypad {
  background: white;
  border-top: 1px solid #e0e0e0;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.keypad-btn {
  min-height: 60px;
  border: 1px solid #e0e0e0;
  border-left: none;
  border-top: none;
  background: white;
  font-size: 24px;
  font-weight: 500;
  color: #000;
}

.keypad-btn:nth-child(3n+1) {
  border-left: 1px solid #e0e0e0;
}

.keypad-btn:nth-child(-n+3) {
  border-top: 1px solid #e0e0e0;
}

.keypad-btn:active {
  background: #f0f0f0;
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
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
}

.clear-btn {
  background: #2f7088;
}

.enter-btn {
  background: #3294B8;
}

@media (prefers-reduced-motion: reduce) {
  .keypad-btn {
    transition: none;
  }
}
</style>

