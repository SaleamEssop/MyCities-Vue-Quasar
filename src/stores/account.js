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
    getAccountById(accountId) {
      return this.accounts.find(({ id }) => id == accountId);
    },
    update(_account) {
      const index = this.accounts.findIndex(({ id }) => id == _account.id);
      this.accounts[index] = _account;
    },
  },
  persist: true,
});
