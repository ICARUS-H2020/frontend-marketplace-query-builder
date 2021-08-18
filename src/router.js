import store from '@/store';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// Route level code-splitting
// This generates a separate chunk (component.[hash].js) for this route which is lazy-loaded when the route is visited.
// As "component", use the filename (without the extension) of the view
function load(component) {
    return () => import(/* webpackPrefetch: 1, webpackChunkName: "[request]" */ `@/views/${component}.vue`);
}

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: 'active',
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return { selector: to.hash };
        }

        return { x: 0, y: 0 };
    },
    routes: [
        {
            path: '/',
            name: 'home',
            component: load('home/Dashboard'),
            meta: { title: 'Home', icon: 'lnr-home' },
        },
        {
            path: '/marketplace',
            name: 'marketplace',
            component: load('marketplace/Marketplace'),
            meta: { title: 'Marketplace', icon: 'lnr-store' },
        },
        {
            path: '/marketplace/dataset',
            name: 'marketplace.dataset',
            component: load('marketplace/Dataset'),
            meta: { title: 'Marketplace > Dataset', icon: 'lnr-store' },
        },
        {
            path: '/marketplace/request-quotation',
            name: 'marketplace.quotation',
            component: load('marketplace/RequestQuotation'),
            meta: { title: 'Marketplace > Dataset > Request Quotation', icon: 'lnr-store' },
            props: true,
        },
        {
            path: '/marketplace/contract',
            name: 'marketplace.contract',
            component: load('marketplace/Contract'),
            meta: { title: 'Marketplace > Contract', icon: 'lnr-store' },
            props: true,
        },
        {
            path: '/assets',
            name: 'assets',
            component: load('assets/Assets'),
            meta: { title: 'Assets', icon: 'lnr-layers' },
        },
        {
            path: '/assets/contracts',
            name: 'assets.contracts',
            component: load('assets/Contracts'),
            meta: { title: 'Assets > Contracts', icon: 'lnr-store' },
        },
        {
            path: '/assets/applications',
            name: 'assets.applications',
            component: load('assets/Applications'),
            meta: { title: 'Assets > Applications', icon: 'lnr-layers' },
        },
        {
            path: '/assets/assetsStatistics',
            name: 'assets.assetsStatistics',
            component: load('assets/AssetsStatistics'),
            meta: { title: 'Assets > Assets Statistics', icon: 'lnr-chart-bars' },
            props: true,
        },
        {
            path: '/assets/applications/:id',
            name: 'assets.applications.detail',
            component: load('assets/ApplicationDetail'),
            meta: { title: 'Assets > Application', icon: 'lnr-layers' },
            props: true,
        },
        {
            path: '/assets/applications/:id/edit',
            name: 'assets.applications.detail.edit',
            component: load('assets/EditApplication'),
            meta: { title: 'Assets > Application > Edit', icon: 'lnr-layers' },
            props: true,
        },
        {
            path: '/assets/:id',
            name: 'assets.dataset',
            component: load('assets/Dataset'),
            meta: { title: 'Assets > Dataset', icon: 'lnr-layers' },
            props: true,
        },
        {
            path: '/assets/:id/edit',
            name: 'assets.dataset.edit',
            component: load('assets/EditDataset'),
            meta: { title: 'Assets > Dataset > Edit', icon: 'lnr-layers' },
            props: true,
        },

        {
            path: '/help',
            name: 'help',
            beforeEnter() {
                window.open(process.env.VUE_APP_DOC_URL, '_blank');
            },
            meta: { title: 'Help', icon: 'lnr-question-circle' },
        },
        {
            name: 'organization-profile',
            path: '/organization-profile',
            component: load('profile/Organization'),
            meta: { title: 'Organization Profile', icon: 'lnr-apartment' },
        },
        {
            name: 'organization',
            path: '/organization/:id',
            component: load('profile/Organization'),
            meta: { title: 'Organization Profile', icon: 'lnr-apartment' },
            props: true,
        },
        {
            name: 'organization-profile-edit',
            path: '/organization-profile/manage',
            component: load('profile/EditOrganization'),
            meta: { title: 'Organization Profile > Manage', icon: 'lnr-apartment' },
            props: true,
        },
        {
            name: 'organization-profile.contract-template',
            path: '/organization-profile/manage/contract-template',
            component: load('profile/ContractTemplate'),
            meta: { title: 'Organization Profile > Manage > Contract Template', icon: 'lnr-apartment' },
        },
        {
            name: 'organization-profile.contract-template.edit',
            path: '/organization-profile/manage/contract-template/:id/edit',
            component: load('profile/ContractTemplate'),
            meta: { title: 'Organization Profile > Manage > Contract Template > Edit', icon: 'lnr-apartment' },
            props: true,
        },
        {
            name: 'administration-panel',
            path: '/administration-panel',
            component: load('profile/Administration'),
            meta: { title: 'Administration Panel', icon: 'lnr-cog' },
        },
        {
            path: '/all-notifications',
            name: 'notifications',
            component: load('notifications/Notifications'),
            meta: { title: 'Notifications', icon: 'pe-7s-bell' },
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: load('favorites/Favorites'),
            meta: { title: 'Favorites', icon: 'pe-7s-star' },
        },
        {
            path: '/query-history',
            name: 'query-history',
            component: load('query-builder/QueryHistory'),
            meta: { title: 'Query History', icon: 'pe-7s-search' },
        },

        {
            path: '/login',
            name: 'login',
            component: load('Login'),
            meta: {
                title: 'Login',
                requiresAuth: false,
            },
        },
        {
            path: '/password-recovery',
            name: 'password-recovery',
            component: load('RecoverPassword'),
            meta: {
                title: 'Recover Password',
                requiresAuth: false,
            },
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: load('ChangePassword'),
            meta: {
                title: 'Change Password',
                requiresAuth: false,
            },
        },
        {
            path: '/error500',
            name: 'error500',
            component: load('Error500'),
            meta: {
                title: '500',
                requiresAuth: false,
            },
        },
        {
            path: '*',
            name: 'error404',
            component: load('Error404'),
            meta: {
                title: '404',
                requiresAuth: false,
            },
        },
    ],
});

// Adjust window title, based on route title
router.beforeEach((to, from, next) => {
    // 1. Redirect login/register/register-organization routes to "/" if user is already logged in
    if (
        store.state.signedIn &&
        (to.name === 'login' || to.name === 'register' || to.name === 'register-organization')
    ) {
        if (store.getters.isAdmin) {
            // Administrators should be redirected to their dashboard
            return next('/admin');
        }
        return next('/');
    }

    // 1b. Admins are only allowed to visit their routes
    if (store.state.signedIn && store.getters.isAdmin) {
        if (to.meta.adminOnly) {
            if (document) {
                const title = to.meta.title || to.name;
                document.title = `ICARUS - ${title}`;
            }

            return next();
        }

        return next('/admin');
    }

    // 1c. Redirect admin routes to "/" if user is not admin
    if (store.state.signedIn && !store.getters.isAdmin && to.meta.adminOnly) {
        return next('/');
    }

    // 1d. Redirect organization-profile-edit route to "/" if user is not organization's manager
    if (
        store.state.signedIn &&
        to.name === 'organization-profile-edit' &&
        store.state.user.id !== store.state.organization.manager.id
    ) {
        return next('/');
    }

    // 2. If route doesn't require authentication, or user is signed-in, allow access
    if (to.meta.requiresAuth === false || store.state.signedIn) {
        // If document is in place (false only for SSR), ådjust tab title based on meta.title
        if (document) {
            const title = to.meta.title || to.name;
            document.title = `ICARUS - ${title}`;
        }

        return next();
    }

    // 3. For all other cases, redirect to the Login page
    return next('/login');
});

export default router;
