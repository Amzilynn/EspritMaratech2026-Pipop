import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/authentication/Error.vue')
        },
        MainRoutes,
        AuthRoutes
    ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('role');
    
    // If user has role 'user' and tries to access any backoffice page, redirect to frontoffice
    if (role === 'user' && !to.path.startsWith('/auth')) {
        console.log('User role detected, redirecting to frontoffice');
        window.location.href = 'http://localhost:5173/';
        return;
    }

    next();
});
