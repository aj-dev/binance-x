import Vue from 'vue';
import VueRouter from 'vue-router';
import anonymous from '../components/anonymous.vue';
import portfolio from '../components/portfolio.vue';
import openOrders from '../components/open-orders.vue';
import positions from '../components/positions.vue';
import notifications from '../components/notifications.vue';
import settings from '../components/settings.vue';
import store from './store';

const routes = [
    {
        path: '/portfolio',
        component: portfolio,
        meta: { requiresAuth: true }
    },
    {
        path: '/open-orders',
        component: openOrders,
        meta: { requiresAuth: true }
    },
    {
        path: '/positions',
        component: positions,
        meta: { requiresAuth: true }
    },
    {
        path: '/notifications',
        component: notifications,
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        component: settings
    },
    {
        path: '/anonymous',
        component: anonymous
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(({ meta }) => meta && meta.requiresAuth) && !Object.keys(store.state.credentials).length) {
        next('/anonymous');
    } else {
        next();
    }
});

Vue.use(VueRouter);

export default router;
