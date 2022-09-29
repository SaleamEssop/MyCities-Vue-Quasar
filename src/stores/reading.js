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
    updateReading(_reading) {
      this.delete(_reading.time, _reading.meter.id);
      this.addReading(_reading);
    },
    delete(timeToDelete, meterId) {
      const readingIndex = this.readings.findIndex(
        (item) => item.time == timeToDelete && item.meter.id === meterId
      );
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
