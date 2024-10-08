import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CourseView from "../views/CourseView.vue";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  { path: "/courses", name: "CourseView", component: CourseView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
