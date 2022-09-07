<template>
  <div>
    <q-card class="text-center cursor-pointer">
      <q-card-section>
        <q-icon :name="icon" class="material-icons md-48" />
        <br />
        <span class="text-15">{{ title }}</span>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconButton",
  props: {
    title: String,
    icon: String,
  },
  setup(props) {},
});
</script>
