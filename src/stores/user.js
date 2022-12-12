import { defineStore, getActivePinia } from "pinia";

const activePinia = getActivePinia();

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    authToken: null,
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.authToken,
  },

  actions: {
    setUser(_user, _authToken) {
      this.user = _user;
      this.authToken = _authToken;
    },
    signOut() {
      // this.user = null;
      // this.authToken = null;
      activePinia._s.forEach((store) => store.$reset());
    },
  },
  persist: true,
});
