import { defineStore } from "pinia";

export const useSiteStore = defineStore("site", {
  state: () => ({
    sites: [],
  }),

  getters: {
    allSites: (state) => state.sites,
  },

  actions: {
    addSite(_site) {
      this.sites.push(_site);
    },
    getSiteById(siteId) {
      return this.sites.filter(({ id }) => id == siteId)[0];
    },
  },
  persist: true,
});
