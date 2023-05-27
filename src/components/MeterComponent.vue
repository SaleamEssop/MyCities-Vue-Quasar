<template>
  <!-- <span v-for="(char, index) in  chars " :key="index" class="text-h4" :style="styles(index)">{{ char }}</span> -->
  <div style="display: flex; flex-direction: row">
    <v-otp-input ref="otpInput" :value="getValueInString()" input-classes="otp-input" separator="-" :num-inputs="8"
      :should-auto-focus="true" input-type="letter-numeric" :placeholder="['_', '_', '_', '_', '_', '_', '_', '_']"
      @on-change="handleOnChange" @on-complete="handleOnComplete" />
  </div>

  <!-- <button @click="handleClearInput()">Clear Input</button> -->
  <!-- // <button @click="fillInput(props?.text?.toString()?.trim())">Fill Input</button> -->
</template>
<script>
import { defineComponent, computed, ref, InstanceType } from "vue";
import VOtpInput from "vue3-otp-input";
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
  methods: {
    handleOnComplete(value) {
      console.log('OTP completed: ', value);
    },
    handleOnChange(value) {
      console.log(this.$refs.otpInput);
      console.log('OTP changed: ', value);
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
    },
  },
  setup(props) {
    console.log(props);
    const otpInput = ref < InstanceType < typeof VOtpInput > null > (null);
    const bindModal = ref("");
    let lastPendingArray = [];
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
    console.log(meterStyleDigits);
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
    console.log(getValueInString);
    return { chars, styles, getValueInString };
  },
  components: { VOtpInput }
});
</script>
<style>
.otp-input {
  width: 40px;
  width: 30px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
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
