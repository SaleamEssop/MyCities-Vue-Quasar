import { defineStore } from "pinia";

export const useDataSetStore = defineStore("dataStore", {
  state: () => ({
    dataSetStore: [],
  }),
  getters: {
    getdataSetStore: (state) => state.dataSetStore,
  },
  actions: {
    addDataStore(_alarm) {
      this.dataSetStore = _alarm;
    },
    deleteDataSet(_id) {
      let deleteIndex = this.dataSetStore.findIndex(({ id }) => {
        return _id == id;
      });
      if (deleteIndex > -1) {
        this.dataSetStore.splice(deleteIndex, 1);
      }
    },
    deleteDataSetRow(rowId, dataSetId) {
      let deleteIndex = this.dataSetStore.forEach(({ id, rows }) => {
        if (dataSetId === id) {
          let deleteRow = rows.findIndex(({ id }) => {
            return rowId == id;
          });
          if (deleteRow > -1) {
            rows.splice(deleteRow, 1);
          }
        }
      });
    },
  },
  persist: true,
});
