<template>
  <q-page class="meter-input-page" data-test="meter-input-page">
    <q-scroll-area class="page-scroll-area" :style="scrollAreaStyle">
      <div class="page-content">
        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Water Meter Reading</h1>
          <p class="page-subtitle">Enter your meter reading</p>
        </div>

        <!-- Meter Groups -->
        <div class="meter-groups" ref="groupsContainerRef">
          <div class="group-label">Kiloliters</div>
          <DigitGroup
            ref="kilolitersGroupRef"
            type="kiloliters"
            :value="kilolitersValue"
            :is-active="activeGroup === 'kiloliters'"
            aria-label="Kiloliters input group"
            data-test="group-kiloliters"
            @activate="activateGroup('kiloliters')"
          />
          
          <div class="group-separator">-</div>
          
          <div class="group-label">Liters</div>
          <DigitGroup
            ref="litersGroupRef"
            type="liters"
            :value="litersValue"
            :is-active="activeGroup === 'liters'"
            aria-label="Liters input group"
            data-test="group-liters"
            @activate="activateGroup('liters')"
          />
        </div>

        <!-- Instructions -->
        <div class="instructions">
          <p>Tap a group to activate it, then use the keypad to enter digits.</p>
        </div>
      </div>
      
      <!-- Spacer for fixed keypad -->
      <div class="keypad-spacer" :style="{ height: keypadHeight + 'px' }"></div>
    </q-scroll-area>

    <!-- Fixed Keypad -->
    <div 
      ref="keypadRef"
      class="fixed-keypad"
      :style="{ height: keypadHeight + 'px' }"
      data-test="keypad-container"
    >
      <NumericKeypad
        :active-group="activeGroup"
        @keypress="handleKeyPress"
        @clear="handleClear"
        @enter="handleEnter"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import DigitGroup from 'src/components/ui/DigitGroup.vue';
import NumericKeypad from 'src/components/ui/NumericKeypad.vue';
import { saveReading } from 'src/services/readingsStorage';

const router = useRouter();

// State
const activeGroup = ref(null); // 'kiloliters' or 'liters'
const kilolitersValue = ref('');
const litersValue = ref('');

// Refs
const kilolitersGroupRef = ref(null);
const litersGroupRef = ref(null);
const groupsContainerRef = ref(null);
const keypadRef = ref(null);

// Layout state
const keypadHeight = ref(320); // Default height
const scrollAreaStyle = computed(() => ({
  height: `calc(100vh - ${keypadHeight.value}px)`,
}));

// Activate a group
const activateGroup = (group) => {
  activeGroup.value = group;
  
  // Scroll active group into view
  nextTick(() => {
    const groupRef = group === 'kiloliters' ? kilolitersGroupRef.value : litersGroupRef.value;
    // In Vue 3, component refs expose $el for the root element
    const element = groupRef?.$el || groupRef;
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
};

// Handle keypad key press
const handleKeyPress = (key) => {
  if (!activeGroup.value) {
    return;
  }
  
  if (activeGroup.value === 'kiloliters') {
    kilolitersValue.value += key;
  } else {
    litersValue.value += key;
  }
};

// Handle clear - removes ALL digits and shows ONLY flashing caret
const handleClear = () => {
  if (!activeGroup.value) {
    return;
  }
  
  // Clear ALL digits in active group - set to empty string
  if (activeGroup.value === 'kiloliters') {
    kilolitersValue.value = '';
  } else {
    litersValue.value = '';
  }
  
  // Group remains active, showing flashing caret
};

// Handle enter
const handleEnter = () => {
  // Validate: at least one group must have a value
  if (!kilolitersValue.value && !litersValue.value) {
    return; // Can't save empty reading
  }
  
  // Save reading
  const reading = {
    kiloliters: kilolitersValue.value || '0',
    liters: litersValue.value || '0',
    type: 'manual',
  };
  
  saveReading(reading);
  
  // Navigate to readings list
  router.push({ name: 'readings-list' });
};

// Handle keyboard input (for accessibility)
const handleKeyboardInput = (event) => {
  if (!activeGroup.value) {
    return;
  }
  
  const key = event.key;
  
  if (key === 'Backspace' || key === 'Delete') {
    handleClear();
    event.preventDefault();
  } else if (key === 'Enter') {
    handleEnter();
    event.preventDefault();
  } else if (/[0-9]/.test(key)) {
    handleKeyPress(key);
    event.preventDefault();
  } else if (key === 'Escape') {
    activeGroup.value = null;
    event.preventDefault();
  }
};

// Handle visual viewport resize (mobile keyboard)
const handleViewportResize = () => {
  if (window.visualViewport) {
    const viewportHeight = window.visualViewport.height;
    const windowHeight = window.innerHeight;
    const keyboardHeight = windowHeight - viewportHeight;
    
    // Adjust keypad position if keyboard is visible
    if (keyboardHeight > 50) {
      // Keyboard is open
      if (keypadRef.value) {
        keypadRef.value.style.bottom = `${keyboardHeight}px`;
      }
    } else {
      // Keyboard is closed
      if (keypadRef.value) {
        keypadRef.value.style.bottom = '0';
      }
    }
  }
};

// Measure keypad height
const measureKeypadHeight = () => {
  if (keypadRef.value) {
    const height = keypadRef.value.offsetHeight;
    if (height > 0) {
      keypadHeight.value = height;
    }
  }
};

// ResizeObserver for dynamic height
let resizeObserver = null;

onMounted(() => {
  // Measure keypad height
  nextTick(() => {
    measureKeypadHeight();
  });
  
  // Set up keyboard listener
  window.addEventListener('keydown', handleKeyboardInput);
  
  // Set up visual viewport listener (mobile keyboard)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportResize);
  }
  
  // Set up ResizeObserver for keypad
  if (keypadRef.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      measureKeypadHeight();
    });
    resizeObserver.observe(keypadRef.value);
  }
  
  // Auto-activate first group if both are empty
  if (!kilolitersValue.value && !litersValue.value) {
    activateGroup('kiloliters');
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardInput);
  
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', handleViewportResize);
  }
  
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// Watch for route changes to reset if needed
watch(() => router.currentRoute.value.name, (newName) => {
  if (newName !== 'meter-input') {
    // Reset when leaving page (optional - comment out if you want to preserve state)
    // kilolitersValue.value = '';
    // litersValue.value = '';
    // activeGroup.value = null;
  }
});
</script>

<style scoped>
.meter-input-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
}

.page-scroll-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.page-content {
  padding: 24px 16px;
  max-width: 480px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #3294B8;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.meter-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.group-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.group-separator {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: #000;
  margin: -8px 0;
}

.instructions {
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
}

.keypad-spacer {
  /* Spacer to prevent content from being hidden behind fixed keypad */
}

.fixed-keypad {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

/* Safe area insets for iOS */
@supports (padding: max(0px)) {
  .fixed-keypad {
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}

@media (min-width: 481px) {
  .fixed-keypad {
    left: 50%;
    transform: translateX(-50%);
    max-width: 480px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
  }
}
</style>

