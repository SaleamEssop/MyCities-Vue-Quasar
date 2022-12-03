import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";

const groupByKey = (list, key1, key2) =>
  list.reduce(
    (hash, obj) => ({
      ...hash,
      [obj[key1][key2]]: (hash[obj[key1][key2]] || []).concat(obj),
    }),
    {}
  );

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
    saveReadings(_readings) {
      const readings = groupByKey(_readings, "meter", "id");
      const keyOfReadings = Object.keys(readings);

      const readingIndex = this.readings.findIndex(({ meter }) => {
        return keyOfReadings.hasOwnProperty(meter.id);
      });
      if (readingIndex > -1) {
        this.readings.splice(readingIndex, 1);
      }
      this.readings.push(..._readings);
    },
  },
  persist: true,
});
