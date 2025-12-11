<template>
  <div class="reading-history-row q-py-xs">
    <div class="row items-center justify-between">
      <div class="col">
        <div class="text-body2">
          {{ label }} {{ formattedDate }}
        </div>
        <div v-if="readingType" class="text-caption text-grey-7">
          {{ readingType }}
        </div>
      </div>
      <div class="col-auto text-right">
        <span class="text-body2 text-weight-medium">{{ formattedReading }}</span>
        <a 
          v-if="canEdit && mode === 'admin'"
          href="#" 
          class="text-primary q-ml-sm text-body2"
          @click.prevent="$emit('edit')"
        >
          Edit
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "Reading" },
  date: { type: [Date, String], required: true },
  reading: { type: [Number, String], required: true },
  readingType: { type: String, default: "" }, // "Estimated", "Final", "Final Estimated"
  canEdit: { type: Boolean, default: false },
  mode: { type: String, default: "user" }, // "user" | "admin"
});

defineEmits(["edit"]);

const formattedDate = computed(() => {
  const d = new Date(props.date);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
});

const formattedReading = computed(() => {
  // Format reading as "00140 - 45" style for water (with decimals)
  // or "763456" for electricity
  const readingStr = String(props.reading).replace(".", "");
  return readingStr;
});
</script>

<style scoped>
.reading-history-row {
  border-bottom: 1px solid #eee;
}
.reading-history-row:last-child {
  border-bottom: none;
}
</style>



