<template>
  <div class="container-border" :class="readingType">
    <div class="text-container">
      <span
        v-for="(char, index) in chars"
        :key="index"
        class="text-h4"
        :style="styles(index)"
      >
        {{ char }}
      </span>
    </div>
    <input
      v-if="isInput"
      type="text"
      class="input-field"
      v-model="inputValue"
      :maxlength="meterStyleDigits"
      @input="handleInput"
    />
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch } from "vue";

const COLOR_STYLE = [
  { color: "black", background: "white" },
  { color: "white", background: "#b30101" },
  { color: "white", background: "#666666" },
];

export default defineComponent({
  name: "MeterComponent",
  props: {
    text: String,
    meterStyle: Number, 
    readingType: String,
    isInput: { type: Boolean, default: false },
  },
  emits: ["update:valueInString"],
  setup(props, { emit }) {
    const inputValue = ref(props.text || "");

   
    const meterStyleDigits = computed(() => {
      return props.meterStyle === 1 ? 8 : 6; 
    });

   
    watch(
      () => props.text,
      (newText) => {
        inputValue.value = newText || "";
      }
    );

    const chars = computed(() => {
      let inputReading = inputValue.value.toString().trim();

      if (inputReading.includes(".")) {
        inputReading = inputReading.replace(".", "");
      }

      const fillArray = [...inputReading];
      let newArr = [];
      if (fillArray.length < meterStyleDigits.value) {
        newArr = [...new Array(meterStyleDigits.value - fillArray.length)].map(
          (x) => (props.isInput ? "_" : "0")
        );
      }

      return [...fillArray, ...newArr];
    });

    const styles = (index) => {
      const size = chars.value.length || 0;
      switch (props.meterStyle) {
        case 1: {
          // Water
          if (index >= size - 4) {
            return COLOR_STYLE[1];
          }
          break;
        }
        case 2: {
          // Electricity
          if (index >= size - 1) {
            return COLOR_STYLE[2];
          }
          break;
        }
      }
      return COLOR_STYLE[0];
    };

    const handleInput = (event) => {
     
      inputValue.value = event.target.value.replace(/[^0-9]/g, "");
    
      emit("update:valueInString", inputValue.value);
    };

    function getValueInString() {
      return chars.value.map((_char) => (_char == "_" ? 0 : _char)).join("");
    }

    return {
      chars,
      styles,
      inputValue,
      handleInput,
      getValueInString,
      meterStyleDigits,
    };
  },
});
</script>
<style scoped>
.container-border {
  border-style: inset;
  border-width: 10px;

  /* border: 2px inset #b30101; */
  /* width: fit-content; */
  margin: auto;
  padding: 2px;
  border-radius: 10px;
}
.electricity-recorded-reading {
  border-color: #000000;
  background: #000000;
}
.water-recorded-reading {
  border-color: #b30101;
  background: #5f0000;
}
.submitted-reading {
  border-color: #b3b3b3;
  background: #b3b3b3;
}
.text-container {
  border-top: 1px dotted black;
  border-bottom: 1px dotted black;
}
.text-h4 {
  display: inline-block;
}

.text-h4:first-child:before {
  content: "";
  border: 1px dotted black;
  border-top: 0px;
  border-bottom: 0px;
}
.text-h4:after {
  content: "";
  border: 1px dotted black;
  border-top: 0px;
  border-bottom: 0px;
  height: fit-content;
}
.text-h4:last-child {
  border: 2px solid white;
}
/* .text-h4:before {
  content: "";
  border: 1px dotted black;
} */

.last-char-animated:last-child {
  animation: fadeIn 1s infinite;
}

.input-field {
  width: 100%;
  padding: 5px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 20px;
  text-align: center;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
