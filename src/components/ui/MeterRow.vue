<template>
  <q-item :clickable="clickable" v-bind="$attrs" @click="$emit('click', $event)">
    <q-item-section>
      <q-item-label class="text-body1">
        <slot name="title">{{ title }}</slot>
      </q-item-label>
      <q-item-label caption>
        <slot name="subtitle">{{ subtitle }}</slot>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <slot name="side"></slot>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  clickable: { type: Boolean, default: false },
});
defineEmits(["click"]);
</script>






