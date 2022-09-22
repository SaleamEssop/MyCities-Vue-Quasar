<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="text-center">
      <q-img src="~assets/footer.png" style="width: 50%; object-fit: contain" />
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
