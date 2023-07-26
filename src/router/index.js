import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import { auth } from '../firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/recipes',
    name: 'Recipe Board',
    component: () => import( /* webpackChunkName: "login" */ '../views/RecipeBoard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chef/:handle',
    name: 'Chef\'s Page',
    component: () => import( /* webpackChunkName: "login" */ '../views/Chef.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/recipe/create',
    name: 'Create Recipe',
    component: () => import( /* webpackChunkName: "login" */ '../views/CreateRecipe.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/recipe/:id',
    name: 'Recipe',
    component: () => import( /* webpackChunkName: "login" */ '../views/Recipe.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import( /* webpackChunkName: "settings" */ '../views/Settings.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// navigation guard to check for logged in users
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
