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
            meta: { title: "Manage", meta: { requiresAuth: true } },
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
