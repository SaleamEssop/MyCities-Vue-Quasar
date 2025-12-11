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

// fixedCosts = getDefaultCostServer
// fixed_cost = default_cost
// fixed_costs =  default_fixed_costs

// fixedCosts =  defaultCosts
// mapp = getDefaultCost
