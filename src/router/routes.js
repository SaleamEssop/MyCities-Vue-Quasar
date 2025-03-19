// import MainLayout from "layouts/MainLayout";
// import NoToolBarLayout from "layouts/NoToolBarLayout";

const routes = [
  {
    path: "/",
    component: () => import("layouts/NoToolBarLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "home",
        meta: { title: "Home", meta: { requiresAuth: true } },
      },
      {
        path: "/meters",
        component: () => import("layouts/MainLayout.vue"),
        children: [
          {
            path: ":id/cost",
            component: () => import("pages/Meters/MeterCost.vue"),
            name: "MeterCost",
            meta: { title: "Meter Cost", meta: { requiresAuth: true } },
          },
          {
            path: ":id/meter-cost",
            component: () => import("pages/Meters/MeterCostPropertyUser.vue"),
            name: "MeterCostProperty",
            meta: { title: "Meter Cost", meta: { requiresAuth: true } },
          },
          {
            path: ":id/AccountSummary",
            component: () => import("pages/Meters/AccountSummary.vue"),
            name: "AccountSummary",
            meta: { title: "Account Summary", meta: { requiresAuth: true } },
          },
        ],
      },
      {
        path: "/accounts",
        component: () => import("layouts/MainLayout.vue"),
        children: [
          {
            path: ":id/bill",
            component: () => import("pages/Account/FullBill.vue"),
            name: "FullBill",
            meta: { title: "Full Bill", meta: { requiresAuth: true } },
          },
        ],
      },
      {
        path: "/data_set",
        component: () => import("pages/DatasetPage.vue"),
        name: "data-set",
        meta: { title: "Data", meta: { requiresAuth: true } },
      },
      {
        path: "/send_reading/",
        component: () => import("layouts/MainLayout.vue"),
        children: [
          {
            path: "",
            component: () => import("pages/MainPage.vue"),
            name: "send_reading",
            meta: { title: "Manage > Accounts", meta: { requiresAuth: true } },
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "/auth/login",
        component: () => import("src/pages/AuthPage.vue"),
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
