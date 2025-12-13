<template>
  <div
    ref="groupRef"
    class="digit-group"
    :class="[
      `digit-group-${type}`,
      { active: isActive, empty: isEmpty }
    ]"
    :aria-label="ariaLabel"
    :aria-atomic="true"
    :aria-live="isActive ? 'polite' : 'off'"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <span v-if="isEmpty" class="caret" :class="`caret-${type}`" aria-hidden="true">_</span>
    <span v-else class="digits">{{ displayValue }}</span>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true, // 'kiloliters' or 'liters'
  },
  value: {
    type: String,
    default: '', // Empty string means empty, show caret
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['activate']);

const groupRef = ref(null);

const isEmpty = computed(() => {
  return !props.value || props.value.length === 0;
});

const displayValue = computed(() => {
  return props.value || '';
});

const handleClick = () => {
  emit('activate');
  // Scroll into view when activated
  if (groupRef.value) {
    setTimeout(() => {
      groupRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
};

// Watch for activation and scroll into view
watch(() => props.isActive, (newVal) => {
  if (newVal && groupRef.value) {
    setTimeout(() => {
      groupRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
});

onMounted(() => {
  if (props.isActive && groupRef.value) {
    setTimeout(() => {
      groupRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
});
</script>

<style scoped>
.digit-group {
  min-height: 64px;
  border: 2px solid;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  cursor: pointer;
  padding: 12px 16px;
  transition: all 0.2s ease;
  background: white;
  user-select: none;
  outline: none;
}

.digit-group:focus {
  outline: 2px solid #3294B8;
  outline-offset: 2px;
}

.digit-group-kiloliters {
  color: #cc0000;
  border-color: #cc0000;
}

.digit-group-liters {
  color: #000;
  border-color: #000;
}

.digit-group.active {
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(50, 148, 184, 0.2);
}

.digit-group-kiloliters.active {
  background: #ffebee;
  border-color: #cc0000;
}

.digit-group-liters.active {
  background: #e3f2fd;
  border-color: #3294B8;
}

.digit-group.empty {
  border-style: dashed;
}

.caret {
  font-size: 36px;
  font-weight: 700;
  animation: blink 1s infinite;
}

.caret-kiloliters {
  color: #cc0000;
}

.caret-liters {
  color: #000;
}

.digits {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
    opacity: 1;
  }
  
  .digit-group {
    transition: none;
  }
}

@media (max-width: 480px) {
  .digit-group {
    min-height: 56px;
    font-size: 24px;
    padding: 10px 12px;
  }
  
  .caret {
    font-size: 32px;
  }
  
  .digits {
    font-size: 24px;
  }
}
</style>




