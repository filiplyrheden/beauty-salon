import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'; // Make sure you have this view created

const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: HomeView
    },
    // Additional routes can be added here
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;