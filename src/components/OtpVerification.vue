<template>
  <div ref="otpCont" class="row justify-center">
    <input
      type="number"
      class="digit-box"
      :class="{ bounce: digits[ind] !== null }"
      v-for="(el, ind) in digits"
      :key="el + ind"
      v-model="digits[ind]"
      :autofocus="ind === 0"
      :step="1"
      maxlength="1"
      @keydown="handleKeyDown($event, ind)"
    />
    <!-- @keydown="handleKeyDown($event, ind)" -->

    <!-- :placeholder="ind + 1" -->
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  default: String,

  digitCount: {
    type: Number,
    required: true,
  },
});
const otpCont = ref(null);
const emit = defineEmits(["update:otp"]);

const isDigitsFull = () => {
  for (const elem of digits) {
    if (elem == null || elem == undefined) {
      return false;
    }
  }
  return true;
};

const handleKeyDown = (event, index) => {
  // event.key >= 0 && event.key <= 9
  if (
    event.key !== "ArrowRight" &&
    event.key !== "ArrowLeft" &&
    event.key !== "Tab"
  ) {
    event.preventDefault();
  }

  if (event.key === "Backspace") {
    digits[index] = null;

    if (index != 0) {
      otpCont.value.children[index - 1].focus();
    }
    return;
  }

  // if (new RegExp("^([0-9])$").test(event.key)) {
  if (event.key >= 0 && event.key <= 9) {
    digits[index] = event.key;

    if (index != props.digitCount - 1) {
      otpCont.value.children[index + 1].focus();
    }
    return;
  }
  if (isDigitsFull()) {
    emit("update:otp", digits.join(""));
  }
};

const digits = reactive([]);

if (props.default && props.default.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i);
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null;
  }
}
</script>

<style scoped>
.digit-box {
  height: 3rem;
  width: 2.4rem;
  border: 2px solid rgb(255, 255, 255);
  border-bottom: 2px solid black;
  display: inline-block;
  /* border-radius: 5px; */
  margin: 5px;
  /* padding: 15px; */
  font-size: 3rem;
}

.digit-box:focus {
  /* outline: 3px solid black; */
  border-bottom: 3px solid black;
  outline: none !important;
}

.bounce {
  animation: pulse 0.3s ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}
</style>
