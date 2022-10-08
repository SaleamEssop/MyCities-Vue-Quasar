import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    account: 0,
    selectedAccount: null,
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
      return this.accounts
        .filter((account) => {
          return (
            account["deletedAt"] == undefined || account["deletedAt"] == null
          );
        })
        .filter(({ site }) => site.id == siteId);
    },
    getAccountById(accountId) {
      return this.accounts
        .filter((account) => {
          return (
            account["deletedAt"] == undefined || account["deletedAt"] == null
          );
        })
        .find(({ id }) => id == accountId);
    },
    update(_account) {
      const index = this.accounts.findIndex(({ id }) => id == _account.id);
      this.accounts[index] = _account;
    },
    deleteAccount(_account) {
      let accountIndex = this.accounts.findIndex(({ id }) => {
        return _account.id == id;
      });
      this.accounts[accountIndex]["deletedAt"] = Date.now();
      // if (meterIndex > -1) {
      //   this.meters.splice(meterIndex, 1);
      // }
    },
  },
  persist: true,
});
