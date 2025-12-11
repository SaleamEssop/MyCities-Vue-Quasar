<template>
  <q-input
    v-model="modelValueLocal"
    :label="label"
    :type="type"
    :placeholder="placeholder"
    :dense="dense"
    :outlined="outlined"
    :error="error"
    :error-message="errorMessage"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  dense: { type: Boolean, default: true },
  outlined: { type: Boolean, default: true },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

