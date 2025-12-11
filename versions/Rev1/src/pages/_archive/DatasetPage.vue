<template>
  <div class="data-set-page">
    <DataSet />
  </div>
</template>

<script>
import DataSet from "src/components/DataSet.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: { DataSet },
  name: "DataSetPage",
});
</script>

<style scoped>
.data-set-page {
  /* max-width: 480px !important; */
  background: white;
  height: 94vh;
  overflow: scroll;
}

@media only screen and (min-width: 480px) {
  .data-set-page {
    width: 480px !important;
    background: white;
    height: 94vh;
    overflow: scroll;
  }
}
</style>
