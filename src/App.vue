<template>
   
  <alarm />
  <router-view />
</template>

<script>
import { defineComponent, ref } from "vue";
import Alarm from "./components/Alarm.vue";

export default defineComponent({
  components: { Alarm },
  name: "App",
 
});
</script>
