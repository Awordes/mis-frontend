import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/auth',
            name: 'auth',
            component: () => import('../views/Auth.vue'),
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/Admin.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/client',
            name: 'client',
            component: () => import('../views/Client.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/app',
            name: 'app',
            component: () => import('../App.vue'),
        }
    ],
})