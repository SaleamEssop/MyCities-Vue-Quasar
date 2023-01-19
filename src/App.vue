<template>
  <!-- <div class="row"> -->
  <!-- <div class="col-8">
      <q-img src="https://placeimg.com/500/300/nature" :ratio="1" />
    </div> -->
  <div class="responsive">
    <router-view />
  </div>
  <!-- </div> -->
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss" scoped>
// @media only screen and (min-width: 600px) {
//   .responsive {
//      width: 480px !important;
//      margin: auto;
//      justify-content: center;
//      display: flex;
//      border: 1px solid gray;
//   }
// }
</style>
