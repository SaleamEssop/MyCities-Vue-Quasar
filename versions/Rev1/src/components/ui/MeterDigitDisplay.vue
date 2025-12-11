<template>
  <div class="meter-digit-display" :class="containerClass">
    <div class="digits-container">
      <span
        v-for="(digit, index) in displayDigits"
        :key="index"
        class="digit-box text-h5"
        :class="getDigitClass(index)"
      >
        {{ digit }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: { type: [Number, String], default: "" },
  meterType: { type: String, default: "water" }, // "water" | "electricity"
  isInput: { type: Boolean, default: false },
});

// Water meters: 8 digits (4 whole + 4 decimal, last 4 are red/highlighted)
// Electricity meters: 6 digits (5 whole + 1 decimal, last 1 is muted)

const totalDigits = computed(() => {
  return props.meterType === "water" ? 8 : 6;
});

const decimalDigits = computed(() => {
  return props.meterType === "water" ? 4 : 1;
});

const displayDigits = computed(() => {
  let valueStr = String(props.value || "").replace(".", "");
  
  if (props.isInput) {
    // For input mode: fill from left, pad right with underscores
    const filled = valueStr.split("");
    while (filled.length < totalDigits.value) {
      filled.push("_");
    }
    return filled.slice(0, totalDigits.value);
  } else {
    // For display mode: pad left with zeros
    while (valueStr.length < totalDigits.value) {
      valueStr = "0" + valueStr;
    }
    return valueStr.slice(-totalDigits.value).split("");
  }
});

const containerClass = computed(() => {
  return props.meterType === "water" 
    ? "water-meter" 
    : "electricity-meter";
});

const getDigitClass = (index) => {
  const isDecimalPart = index >= (totalDigits.value - decimalDigits.value);
  
  if (props.meterType === "water") {
    // Water: first 4 white bg, last 4 red bg
    return isDecimalPart ? "digit-decimal-water" : "digit-whole";
  } else {
    // Electricity: first 5 teal bg, last 1 muted bg
    return isDecimalPart ? "digit-decimal-elec" : "digit-whole-elec";
  }
};
</script>

<style scoped>
.meter-digit-display {
  display: inline-block;
  border-radius: 8px;
  padding: 8px;
  border: 4px solid;
}

.water-meter {
  border-color: #c10015;
  background: #c10015;
}

.electricity-meter {
  border-color: #00897b;
  background: #00897b;
}

.digits-container {
  display: flex;
  gap: 2px;
  border-top: 1px dashed rgba(0,0,0,0.3);
  border-bottom: 1px dashed rgba(0,0,0,0.3);
  padding: 4px 0;
}

.digit-box {
  width: 36px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto Mono', monospace;
  font-weight: bold;
  border-radius: 4px;
  border: 1px dashed rgba(0,0,0,0.2);
}

/* Water meter styles */
.digit-whole {
  background: white;
  color: black;
}

.digit-decimal-water {
  background: #c10015;
  color: white;
}

/* Electricity meter styles */
.digit-whole-elec {
  background: #00897b;
  color: white;
}

.digit-decimal-elec {
  background: #666;
  color: white;
}
</style>



