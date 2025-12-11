import { defineStore } from "pinia";

export const useBillingStore = defineStore("billing", {
  state: () => ({
    useBackendBilling: false, // Default to false (use frontend billing)
  }),

  getters: {
    isBackendBillingEnabled: (state) => state.useBackendBilling,
  },

  actions: {
    setUseBackendBilling(value) {
      this.useBackendBilling = value;
    },
    toggleBackendBilling() {
      this.useBackendBilling = !this.useBackendBilling;
    },
  },

  persist: true,
});





