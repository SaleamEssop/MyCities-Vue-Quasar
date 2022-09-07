import { defineStore } from "pinia";
import { useSiteStore } from "./site";

const siteStore = useSiteStore();
export const useAccountStore = defineStore("account", {
  state: () => ({
    account: 0,
    accounts: siteStore.sites.flatMap((site) => site.accounts),
  }),

  getters: {
    allAccounts: (state) => state.accounts,
  },

  actions: {
    addAccount(_account) {
      this.accounts.push(_account);
    },
  },
  persist: true,
});
