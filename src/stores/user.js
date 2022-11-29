import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),

  getters: {
    getUser: (state) => state.user,
  },

  actions: {
    setUser(_user) {
      this.user = _user;
    },
    signOut() {
      this.user = null;
    },
  },
  persist: true,
});
