<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="text-center footerMain">
      <q-img src="~assets/footer.png" class="footerImage" />
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "NoToolBarLayout",
  setup() {},
});
</script>
<style scoped>
/* .footerMain {
  height: 40px;
} */
.footerImage {
  width: 50%;
  object-fit: contain;
  /* height: 40px; */
}
</style>
