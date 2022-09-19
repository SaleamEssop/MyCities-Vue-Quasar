import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";

export const useMeterStore = defineStore("meter", {
  state: () => ({
    meters: [],
  }),

  getters: {
    allMeters: (state) => {
      const meters = state.meters; //JSON.parse(JSON.stringify(state.meters));
      return meters.map((_meter) => {
        const METER_TYPES =
          getCurrentInstance().appContext.config.globalProperties.$METER_TYPES;
        _meter.type = METER_TYPES.find((meter) => meter.id == _meter.type.id);
        // _meter.account = useAccountStore().allAccounts.find(
        //   (account) => account.id == _meter.account.id
        // );
        _meter.readings.data = _meter.readings.data.sort(
          (a, b) => b.time - a.time
        );
        _meter.readings.data.map((reading) => {
          return reading;
        });
        //_meter.readings.data = [];
        return _meter;
      });
    },
    findById: (state, meterId) => {},
  },

  actions: {
    addMeter(_meter) {
      this.meters.push(_meter);
    },
    addReading(_meterId, reading) {
      let meter = this.meters.find(({ id }) => {
        return _meterId == id;
      });
      //console.log('meter?.readings?.data.length', meter?.readings?.data.length);
      if (meter?.readings?.data.length == 0) {
        reading["isSubmit"] = true;
      }
      meter?.readings?.data.push(reading);
    },
    delete(_meterId, reading) {
      //console.log(_meterId, reading.time);
      let meter = this.meters.find(({ id }) => {
        return _meterId == id;
      });
      const readingIndex = meter?.readings?.data.findIndex(
        ({ time }) => time == reading.time
      );
      if (readingIndex > -1) {
        // only splice array when item is found
        meter?.readings?.data.splice(readingIndex, 1); // 2nd parameter means remove one item only
      }
    },
    getByAccuntId(accountId) {
      return this.allMeters.filter(({ account }) => {
        return account.id == accountId;
      });
    },
  },

  persist: true,
});
