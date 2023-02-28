import { defineStore } from "pinia";

export const useDataSetStore = defineStore("dataStore", {
  state: () => ({
    dataStore: [],
  }),
  getters: {
    getDataStore: (state) => state.dataStore,
  },
  actions: {
    addDataStore(_alarm) {
      this.dataStore = _alarm;
    },
  },
  persist: true,
});
