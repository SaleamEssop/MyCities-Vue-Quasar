import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    account: 0,
    accounts: [],
  }),

  getters: {
    allAccounts: (state) => state.accounts,
  },

  actions: {
    addAccount(_account) {
      this.accounts.push(_account);
    },
    getAccountsById(siteId) {
      return this.accounts.filter(({ site }) => site.id == siteId);
    },
  },
  persist: true,
});
