import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    role: "user", // "user" | "admin"
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.role === "admin",
    isUser: (state) => state.role === "user",
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },

  actions: {
    setAuth(user, token, role = "user") {
      this.user = user;
      this.token = token;
      this.role = role;
      this.isAuthenticated = true;
    },

    setRole(role) {
      this.role = role;
    },

    async fetchUserRole() {
      // This would call /api/me to get the user's role from backend
      // For now, we'll check if the user email contains 'admin'
      if (this.user?.email?.includes("admin") || this.user?.is_admin) {
        this.role = "admin";
      } else {
        this.role = "user";
      }
      return this.role;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.role = "user";
      this.isAuthenticated = false;
    },

    // For testing: toggle admin mode
    toggleAdminMode() {
      this.role = this.role === "admin" ? "user" : "admin";
      return this.role;
    },
  },

  persist: true,
});



