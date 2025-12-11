const routes = [
  // Auth Routes (with AuthLayout - no header/footer)
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("pages/LoginPage.vue"),
        name: "login",
        meta: { title: "Login", guest: true },
      },
      {
        path: "account-setup",
        component: () => import("pages/AccountSetupPage.vue"),
        name: "account-setup",
        meta: { title: "Create Account", guest: true },
      },
    ],
  },

  // Main App Routes (with minimal layout for full-screen pages)
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"), // Using AuthLayout for full-screen pages
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import("pages/user/DashboardPage.vue"),
        name: "home",
        meta: { title: "Dashboard" },
      },
      {
        path: "dashboard",
        component: () => import("pages/user/DashboardPage.vue"),
        name: "dashboard",
        meta: { title: "Dashboard" },
      },
      {
        path: "enter-readings",
        component: () => import("pages/user/EnterReadingsPage.vue"),
        name: "enter-readings",
        meta: { title: "Enter Readings" },
      },
      {
        path: "meter-input",
        component: () => import("pages/user/MeterInputPage.vue"),
        name: "meter-input",
        meta: { title: "Enter Meter Reading" },
      },
      {
        path: "readings-list",
        component: () => import("pages/user/ReadingsListPage.vue"),
        name: "readings-list",
        meta: { title: "Readings List" },
      },
      {
        path: "reading/:id",
        component: () => import("pages/user/ReadingPreviewPage.vue"),
        name: "reading-preview",
        meta: { title: "Reading Details" },
      },
      {
        path: "settings",
        component: () => import("pages/user/SettingsPage.vue"),
        name: "settings",
        meta: { title: "Settings" },
      },
      {
        path: "about",
        component: () => import("pages/user/AboutPage.vue"),
        name: "about",
        meta: { title: "About" },
      },
      {
        path: "accounts",
        component: () => import("pages/AccountsListPage.vue"),
        name: "accounts-list",
        meta: { title: "Accounts" },
      },
      {
        path: "account/edit/:accountId",
        component: () => import("pages/AccountSetupPage.vue"),
        name: "account-edit",
        meta: { title: "Edit Account" },
      },
    ],
  },

  // Legacy routes - redirect
  {
    path: "/auth",
    redirect: "/login",
  },
  {
    path: "/auth/login",
    redirect: "/login",
  },

  // 404 - Always leave this as last one
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
    name: "Error",
  },
];

export default routes;
