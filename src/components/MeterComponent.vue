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
];
export default defineComponent({
  name: "MeterComponent",
  props: {
    text: String,
    meterStyle: Number,
    readingType: String, //
  },
  setup(props) {
    const chars = computed(() => {
      const fillArray = [...(props?.text?.toString() || "")];
      let newArr = [];
      if (fillArray.length < 8) {
        newArr = [...new Array(8 - fillArray.length)].map((x) => 0);
      }
      return [...newArr, ...fillArray];
    });
    const styles = (index) => {
      const size = chars.value.length || 0;
      console.log(size);
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
            return COLOR_STYLE[1];
          }
        }
      }
      return COLOR_STYLE[0];
    };
    return { chars, styles };
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

.recorded-reading {
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
/* .text-h4:before {
  content: "";
  border: 1px dotted black;
} */
</style>
