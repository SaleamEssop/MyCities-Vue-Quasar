import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";

export const useReadingStore = defineStore("reading", {
  state: () => ({
    readings: [],
  }),

  getters: {},

  actions: {
    addReading(_reading) {
      this.readings.push(_reading);
    },
    delete(timeToDelete, meterId) {
      const readingIndex = this.readings
        .filter(({ meter }) => meter.id === meterId)
        .findIndex((item) => item.time == timeToDelete);
      this.readings.splice(readingIndex, 1);
    },
    getReadingsByMeterId(meterId) {
      return this.readings
        .filter(({ meter }) => meter.id == meterId)
        .sort((a, b) => b.time - a.time);
    },
  },
  persist: true,
});
