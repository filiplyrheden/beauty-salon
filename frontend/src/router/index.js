import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateProduct from "@/views/CreateProductView.vue";
import CourseView from "../views/CourseView.vue";
import AdminPage from "@/views/AdminPage.vue";
import ServicePage from "../views/ServiceView.vue";
import ServiceCategoriesPage from "../views/ServiceCategoriesView.vue";
import PageReviewsPage from "../views/PageReviewsView.vue";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/admin/createproduct",
    name: "CreateProduct",
    component: CreateProduct,
  },
  {
    path: "/admin/courses",
    name: "CourseView",
    component: CourseView,
  },
  {
    path: "/admin",
    name: "Admin Page",
    component: AdminPage,
  },
  {
    path: "/admin/services",
    name: "Service Page",
    component: ServicePage,
  },
  {
    path: "/admin/service-categories",
    name: "Service Categories Page",
    component: ServiceCategoriesPage,
  },
  {
    path: "/admin/page-reviews",
    name: "Page Reviews Page",
    component: PageReviewsPage,
  },
  // Additional routes can be added here
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
