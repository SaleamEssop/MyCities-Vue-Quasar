const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "home",
        meta: { title: "Home" },
      },
      {
        path: "/send_reading/",
        children: [
          {
            path: "",
            component: () => import("pages/SendReadingPage.vue"),
            name: "send_reading",
            meta: { title: "Send Reading" },
          },
          {
            path: "addMeterPage",
            component: () => import("pages/AddMeterPage.vue"),
            meta: { title: "Add Meter" },
          },
          {
            path: "setReading/:meterId",
            component: () => import("pages/meter/SetReading.vue"),
            name: "set_reading_page",
            meta: { title: "Set Reading" },
          },
        ],
      },

      {
        path: "/history",
        component: () => import("pages/HistoryPage.vue"),
        name: "history",
        meta: { title: "History" },
      },
      {
        path: "/estimator",
        component: () => import("pages/EstimatorPage.vue"),
        name: "estimator",
        meta: { title: "Estimator" },
      },
      {
        path: "/account_setup/",
        children: [
          {
            path: "",
            component: () => import("pages/account/AccountSetupPage.vue"),
            name: "account_setup",
            meta: { title: "Account Setup" },
          },
          {
            path: "add_site",
            component: () => import("pages/account/AddSite.vue"),
            name: "add_site",
            meta: { title: "Site" },
          },
          {
            path: "add_meter_page",
            component: () => import("pages/AddMeterPage.vue"),
            name: "addMeterPage",
            meta: { title: "Add Meter" },
          },
        ],
      },
      {
        path: "/setting",
        component: () => import("pages/SettingPage.vue"),
        name: "Setting",
        meta: { title: "Setting" },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
    name: "Error",
  },
];

export default routes;
