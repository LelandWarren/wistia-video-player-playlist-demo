// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import PublicView from "../views/PublicView.vue";
import AdminView from "../views/AdminView.vue";

const routes = [
  {
    path: "/",
    name: "Public",
    component: PublicView,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
