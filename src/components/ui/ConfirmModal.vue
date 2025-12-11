<template>
  <q-dialog v-model="internal" persistent>
    <q-card>
      <q-card-section class="text-h6">{{ title }}</q-card-section>
      <q-card-section class="text-body2">
        <slot>{{ message }}</slot>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="cancel" />
        <ButtonPrimary :label="confirmLabel" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import ButtonPrimary from "./ButtonPrimary.vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "Confirm" },
  message: { type: String, default: "" },
  confirmLabel: { type: String, default: "OK" },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const internal = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    internal.value = val;
  }
);

const cancel = () => {
  internal.value = false;
  emit("update:modelValue", false);
  emit("cancel");
};

const confirm = () => {
  internal.value = false;
  emit("update:modelValue", false);
  emit("confirm");
};
</script>






