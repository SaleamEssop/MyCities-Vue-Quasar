<template>
  <q-btn
    :label="label"
    :color="color"
    :text-color="textColor"
    :unelevated="unelevated"
    :outline="outline"
    :rounded="rounded"
    :loading="loading"
    :disable="disable"
    :icon="icon"
    :type="type"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  />
</template>

<script setup>
defineProps({
  label: { type: String, default: "Submit" },
  color: { type: String, default: "primary" },
  textColor: { type: String, default: "black" },
  unelevated: { type: Boolean, default: true },
  outline: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disable: { type: Boolean, default: false },
  icon: { type: String, default: null },
  type: { type: String, default: "button" },
});
defineEmits(["click"]);
</script>

