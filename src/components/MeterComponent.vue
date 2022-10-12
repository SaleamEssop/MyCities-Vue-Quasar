<template>
  <div class="container-border" :class="readingType">
    <div class="text-container">
      <span
        v-for="(char, index) in chars"
        :key="index"
        class="text-h4"
        :style="styles(index)"
        >{{ char }}</span
      >
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, ref } from "vue";
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
    readingType: String, //
    isInput: { default: false, type: Boolean },
  },
  setup(props) {
    let lastPendingArray = [];
    const chars = computed(() => {
      let meterStyleDigits = 6;
      switch (props.meterStyle) {
        case 1: {
          meterStyleDigits = 8;
          break;
        }
        case 2: {
          meterStyleDigits = 6;
          break;
        }
      }

      let inputReading = props?.text?.toString()?.trim();

      if (props.isInput) {
        if (inputReading) {
          if (inputReading.includes(".")) {
            inputReading = inputReading.replace(".", "");
          }
        } else {
          inputReading = "";
        }
        const fillArray = [...inputReading];
        let newArr = [];
        if (fillArray.length < meterStyleDigits) {
          newArr = [...new Array(meterStyleDigits - fillArray.length)].map(
            (x) => (props.isInput ? "_" : "0")
            // (inputReading || "").length > 0 ? "0" : "_"
            // "_"
          );
        }
        lastPendingArray = newArr;
        return [...fillArray, ...newArr];
      } else {
        if (inputReading) {
          if (inputReading.includes(".")) {
            inputReading = inputReading.replace(".", "");
          }
        } else {
          inputReading = "";
        }
        const fillArray = [...inputReading];
        let newArr = [];
        if (fillArray.length < meterStyleDigits) {
          newArr = [...new Array(meterStyleDigits - fillArray.length)].map(
            (x) => ((inputReading || "").length > 0 ? "0" : "_")
          );
        }
        return [...newArr, ...fillArray];
      }
    });

    const styles = (index) => {
      const size = chars.value.length || 0;
      switch (props.meterStyle) {
        case 1: {
          // Water
          if (index >= size - 4) {
            return COLOR_STYLE[1];
          }
        }
        case 2: {
          // Electricity
          if (index >= size - 1) {
            return COLOR_STYLE[2];
          }
        }
      }
      return COLOR_STYLE[0];
    };

    function getValueInString() {
      return chars.value.map((_char) => (_char == "_" ? 0 : _char)).join("");
    }

    return { chars, styles, getValueInString };
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
.text-h4:last-child:after {
  border-right: 4px dashed white;
}
/* .text-h4:before {
  content: "";
  border: 1px dotted black;
} */

.last-char-animated:last-child {
  animation: fadeIn 1s infinite;
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
