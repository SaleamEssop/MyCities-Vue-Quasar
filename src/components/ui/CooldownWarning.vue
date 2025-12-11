<template>
  <q-banner 
    v-if="show"
    dense 
    class="bg-orange-1 text-orange-9 q-my-sm"
    style="border-radius: 8px;"
  >
    <template v-slot:avatar>
      <q-icon name="schedule" color="orange" />
    </template>
    <div class="text-body2">
      Sorry, your last reading was less than 24 hours ago. 
      Please wait for <strong>{{ formattedTimeRemaining }}</strong> before you can add a reading.
    </div>
    <template v-if="mode === 'admin'" v-slot:action>
      <q-btn 
        flat 
        dense
        color="deep-purple" 
        label="Override (Admin)"
        @click="$emit('override')"
      />
    </template>
  </q-banner>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  secondsRemaining: { type: Number, default: 0 },
  mode: { type: String, default: "user" }, // "user" | "admin"
});

defineEmits(["override"]);

const formattedTimeRemaining = computed(() => {
  const totalSeconds = Math.max(0, props.secondsRemaining);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
});
</script>




