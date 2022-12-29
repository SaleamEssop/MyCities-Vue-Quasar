import { defineStore } from "pinia";

export const useDefaultCostStore = defineStore("defaultCost", {
  state: () => ({
    defaultCost: [],
  }),

  getters: {
    getDefaultCost: (state) => state.defaultCost,
  },

  actions: {
    setDefaultCost(_cost) {
      this.defaultCost = _cost;
    },
  },

  persist: true,
});
