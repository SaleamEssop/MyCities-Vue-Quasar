<template>
  <div class="admin-reading-toolbar bg-deep-purple-1 q-pa-sm q-mb-md" style="border-radius: 8px;">
    <div class="row items-center q-gutter-sm">
      <q-btn 
        dense 
        flat 
        color="deep-purple"
        icon="add"
        label="Add Reading"
        @click="$emit('add')"
      />
      <q-btn 
        dense 
        flat 
        color="deep-purple"
        icon="edit"
        label="Edit"
        :disable="!selectedReadingId"
        @click="$emit('edit')"
      />
      <q-btn 
        dense 
        flat 
        color="negative"
        icon="delete"
        label="Delete"
        :disable="!selectedReadingId"
        @click="$emit('delete')"
      />
      <q-separator vertical inset class="q-mx-sm" />
      <q-btn 
        dense 
        flat 
        color="primary"
        icon="refresh"
        label="Recompute Bill"
        @click="$emit('recompute')"
      />
      <q-btn 
        dense 
        flat 
        color="grey-7"
        icon="code"
        label="View JSON"
        @click="$emit('view-json')"
      />
      <q-space />
      <q-btn 
        dense 
        flat 
        color="grey-7"
        icon="history"
        label="Audit Log"
        @click="$emit('audit-log')"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedReadingId: { type: [Number, String], default: null },
});

defineEmits([
  "add",
  "edit", 
  "delete",
  "recompute",
  "view-json",
  "audit-log"
]);
</script>





