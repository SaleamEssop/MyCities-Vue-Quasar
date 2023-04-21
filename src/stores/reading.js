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
    cost: [],
  }),

  getters: {},

  actions: {
    getmetercost(meter_id) {

      if (meter_id != "fullbill") {
        return this.filterByProperty(this.cost[0]['data'], meter_id)
      } else {
        return this.filterByPropertyFullbill(this.cost[0]['data'])
      }
    },
    filterByProperty(array, value) {
      //console.log(array.length);
      var filtered = [];
      for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        if (obj['meter_id'] == value) {
          filtered.push(obj);
        }
        if (obj['status'] == false) {
          filtered.push(obj);
        }
      }
      console.log(filtered)
      return filtered;
    },
    filterByPropertyFullbill(array, value) {
      var filtered = [];
      for (var i = 0; i < array.length; i++) {
        var obj = array[i];

        if (obj['status'] == false) {
          continue
        }
        filtered.push(obj);
      }
      console.log(filtered)
      return filtered;
    },
    metercost(_reading) {
      this.cost = [];
      this.cost.push(_reading);
    },
    addReading(_reading) {
      this.readings.push(_reading);
    },
    updateReading(_reading) {
      this.delete(_reading.time, _reading.meter.id);
      this.addReading(_reading);
    },
    deleteReadings(_id) {
      let readingIndex = this.readings.findIndex(({ id }) => {
        return _id == id;
      });
      if (readingIndex > -1) {
        this.readings.splice(readingIndex, 1);
      }
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
      //const keyOfReadings = Object.keys(readings);
      this.readings = this.readings.filter((readingItem) => {
        return !(
          readingItem.meter.id == undefined ||
          readings[readingItem.meter.id] !== undefined
        );
      });
      this.readings.push(..._readings);
    },
  },
  persist: true,
});
