import { defineStore } from "pinia";

export const useGetAlarmsStore = defineStore("alarms", {
  state: () => ({
    alarms: [],
  }),

  getters: {
    getAlarms: (state) => state.alarms,
  },
  actions: {
    setAlarms(_alarm) {
      this.alarms = _alarm;
    },
  },
  persist: true,
});
