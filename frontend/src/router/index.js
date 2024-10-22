import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateProduct from "../views/admin/CreateProductView.vue";
import CourseView from "../views/admin/CourseView.vue";
import AdminPage from "../views/admin/AdminPage.vue";
import EventsView from "../views/admin/EventsView.vue";
import ServicePage from "../views/admin/ServiceView.vue";
import ServiceCategoriesPage from "../views/admin/ServiceCategoriesView.vue";
import PageReviewsPage from "../views/admin/PageReviewsView.vue";
import ProductReviewsPage from "../views/admin/ProductReviewsView.vue";
import ProductCategoriesPage from "../views/admin/ProductCategories.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import OrderPage from "../views/admin/orderView.vue";
import ProductsPage from "../views/ecommerce/ProductsView.vue";
import { store } from "@/store/store";
import ProductView from "@/views/ecommerce/ProductView.vue";
import ForgotPassword from "@/views/mainpage/ForgotPassword.vue";
import ResetPassword from "@/views/mainpage/ResetPassword.vue";
import ProfilePage from "@/views/mainpage/ProfilePage.vue";
import AboutUsPage from "../views/mainpage/AboutUsView.vue";
import SuccessPage from "../views/mainpage/SuccessView.vue";
import TreatmentsPage from "../views/mainpage/TreatmentsView.vue";
import CheckOutPage from "../views/ecommerce/CheckOutView.vue";

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
    path: "/about-us",
    name: "AboutUsPage",
    component: AboutUsPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/checkout",
    name: "CheckoutPage",
    component: CheckOutPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/behandlingar",
    name: "TreatmentsPage",
    component: TreatmentsPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/success",
    name: "SuccessPage",
    component: SuccessPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/user/profile",
    name: "ProfilePage",
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/shop",
    name: "Products Page",
    component: ProductsPage,
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
  {
    path: "/product/:id",
    name: "Singular Product Page",
    component: ProductView,
  },
  {
    path: "/forgot-password",
    name: "Forgot Password Page",
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:token",
    name: "Reset Password Page",
    component: ResetPassword,
  },
  // Additional routes can be added here
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch("checkAuth");
  next(); // Allow the navigation to continue
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const isAuthenticated = !!localStorage.getItem("token"); // JWT for auth
  const token = localStorage.getItem("token");

  if (to.path === "/login" && isAuthenticated) {
    // Redirect authenticated users away from /login
    return next("/"); // Return immediately after redirection
  }

  if (requiresAuth && !isAuthenticated) {
    return next("/login"); // Return immediately if authentication is required but user is not authenticated
  }

  if (requiresAdmin) {
    if (!token) {
      return next("/login"); // Return immediately if there's no token
    }
    // Decode JWT to get role
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    if (decodedToken.role !== "admin") {
      return next("/403"); // Return immediately if user is not an admin
    }
  }

  return next(); // Only proceed after all checks are passed
});

export default router;
