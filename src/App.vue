<template>
  <!-- <div class="row"> -->
  <!-- <div class="col-8">
      <q-img src="https://placeimg.com/500/300/nature" :ratio="1" />
    </div> -->
  <div class="backgroundImage">
    <router-view />
  </div>

  <!-- <div v-else>
    <q-dialog v-model="alertMessage" persistent>
      <q-card class="modalborder">
        <q-card-section>
          <div class="text-h6 text-center">No Internet Connection</div>
          <div class="q-mt-sm">
            You do not seem to have an internet connection. This app will not be
            able to upload and retrieve data.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn dense label="ok" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div> -->
  <!-- </div> -->
</template>

<script>
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "App",

  setup() {
    return {

    };
  },

  // setup() {
  //   const alertMessage = ref(true);
  //   const onLine = computed(() => {
  //     return navigator.onLine;
  //   });

  //   return {
  //     onLine,
  //     alertMessage,
  //   };
  // },
});
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 480px) {
  .backgroundImage {
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-image: url("../src/assets/bg.webp");
    z-index: -1;
  }
}
</style>
