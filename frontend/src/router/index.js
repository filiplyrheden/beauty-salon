import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateProduct from "@/views/CreateProductView.vue";
import CourseView from "../views/CourseView.vue";
import AdminPage from "@/views/AdminPage.vue";
import EventsView from "@/views/EventsView.vue";
import ServicePage from "../views/ServiceView.vue";
import ServiceCategoriesPage from "../views/ServiceCategoriesView.vue";
import PageReviewsPage from "../views/PageReviewsView.vue";
import ProductReviewsPage from "../views/ProductReviewsView.vue";
import ProductCategoriesPage from "../views/ProductCategories.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import OrderPage from "../views/orderView.vue";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: RegisterPage,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/admin/products",
    name: "Product View",
    component: CreateProduct,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/courses",
    name: "CourseView",
    component: CourseView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin",
    name: "Admin Page",
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/events",
    name: "EventsView",
    component: EventsView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/services",
    name: "Service Page",
    component: ServicePage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/service-categories",
    name: "Service Categories Page",
    component: ServiceCategoriesPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/page-reviews",
    name: "Page Reviews Page",
    component: PageReviewsPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/product-categories",
    name: "Product Categories Page",
    component: ProductCategoriesPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/orders",
    name: "Order Page",
    component: OrderPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/product-reviews",
    name: "Product Reviews Page",
    component: ProductReviewsPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  // Additional routes can be added here
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const isAuthenticated = !!localStorage.getItem("token"); // JWT for auth
  const token = localStorage.getItem("token");

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (requiresAdmin) {
    // Decode JWT to get role (frontend can decode without verifying signature)
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    console.log(decodedToken);
    if (decodedToken.role !== "admin") {
      next("/403"); // Redirect to forbidden page if not admin
    } else {
      next(); // Proceed if user is admin
    }
  } else {
    next();
  }
});

export default router;
