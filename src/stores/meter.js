import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";

export const useMeterStore = defineStore("meter", {
  state: () => ({
    selectedMeter: null,
    meters: [],
  }),

  getters: {
    allMeters: (state) => {
      const meters = state.meters; //JSON.parse(JSON.stringify(state.meters));
      return meters.map((_meter) => {
        const METER_TYPES =
          getCurrentInstance().appContext.config.globalProperties.$METER_TYPES;
        _meter.type = METER_TYPES.find((meter) => meter.id == _meter.type.id);
        return _meter;
      });
    },
  },

  actions: {
    addMeter(_meter) {
      this.meters.push(_meter);
    },
    // addReading(_meterId, reading) {
    //   let meter = this.meters.find(({ id }) => {
    //     return _meterId == id;
    //   });
    //   if (meter?.readings?.data.length == 0) {
    //     reading["isSubmit"] = true;
    //   }
    //   meter?.readings?.data.push(reading);
    // },
    // delete(_meterId, reading) {
    //   let meter = this.meters.find(({ id }) => {
    //     return _meterId == id;
    //   });
    //   const readingIndex = meter?.readings?.data.findIndex(
    //     ({ time }) => time == reading.time
    //   );
    //   if (readingIndex > -1) {
    //     // only splice array when item is found
    //     meter?.readings?.data.splice(readingIndex, 1); // 2nd parameter means remove one item only
    //   }
    // },
    getByAccuntId(accountId) {
      return this.allMeters
        .filter(({ account }) => {
          return account.id == accountId;
        })
        .filter((meter) => {
          return meter["deletedAt"] == undefined || meter["deletedAt"] == null;
        });
    },
    getMeterById(meterId) {
      return this.allMeters.find(({ id }) => id == meterId);
    },
    deleteMeter(_meter) {
      let meterIndex = this.meters.findIndex(({ id }) => {
        this.selectedMeter = null;
        return _meter.id == id;
      });
      this.meters[meterIndex]["deletedAt"] = Date.now();
      // if (meterIndex > -1) {
      //   this.meters.splice(meterIndex, 1);
      // }
    },
    saveMeterByAccountId(meters, accountId) {
      const alreadySavedMeters = this.getByAccuntId(accountId);

      alreadySavedMeters.forEach((_meter) => {
        let meterIndex = this.meters.findIndex(({ id }) => {
          return _meter.id == id;
        });
        if (meterIndex > -1) {
          this.meters.splice(meterIndex, 1);
        }
      });
      this.meters.push(...meters);
    },
  },
  persist: true,
});
