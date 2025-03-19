import { defineStore } from "pinia";
import { getAllData } from "src/boot/axios";

export const useDataStore = defineStore("getAllData", {
  state: () => ({
   //get property data 
    allData: {},
    
    
  }),

  actions: {
    async fetchAllData() {
      try {
        if (!userStore.getUser?.id) {
          console.error("User ID not available");
          return;
        }
        let { data } = await getAllData();
        if (data && data.property) {
          this.allData.property = data.property;
        } else {
          this.allData.property = {
            property_name: "",
            property_address: "",
            property_manager: ""
          };
        }
        console.log("Fetched Data:", this.allData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
});
