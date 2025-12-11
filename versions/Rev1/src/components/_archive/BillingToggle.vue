<template>
  <q-card v-if="showToggle" class="q-ma-md">
    <q-card-section>
      <div class="text-subtitle2 q-mb-sm">Billing System Toggle</div>
      <div class="row items-center">
        <div class="col">
          <div class="text-body2">
            Use Backend Billing:
            <q-badge :color="isBackendBilling ? 'positive' : 'grey'">
              {{ isBackendBilling ? "Enabled" : "Disabled" }}
            </q-badge>
          </div>
          <div class="text-caption text-grey-7 q-mt-xs">
            When enabled, bills are calculated by the backend API. When disabled, uses frontend
            calculation (waterDurban.js).
          </div>
        </div>
        <div class="col-auto">
          <q-toggle
            v-model="isBackendBilling"
            @update:model-value="handleToggle"
            color="primary"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useBillingStore } from "src/stores/billing";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "BillingToggle",
  props: {
    showToggle: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const billingStore = useBillingStore();
    const $q = useQuasar();

    const isBackendBilling = computed({
      get: () => billingStore.isBackendBillingEnabled,
      set: (value) => {
        billingStore.setUseBackendBilling(value);
      },
    });

    const handleToggle = (value) => {
      billingStore.setUseBackendBilling(value);
      $q.notify({
        message: `Backend billing ${value ? "enabled" : "disabled"}`,
        color: value ? "positive" : "info",
        position: "top",
        timeout: 2000,
      });
    };

    return {
      isBackendBilling,
      handleToggle,
    };
  },
});
</script>



