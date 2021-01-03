import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: {
      name: 'login'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/student-home',
    name: 'student-home',
    component: () => import(/* webpackChunkName: "home" */ '../views/StudentHome.vue')
  },
  {
    path: '/student-experiment/:eID',
    name: 'student-experiment',
    component: () => import('../views/Experiment')
  },
  {
    path: '/teacher-home',
    name: 'teacher-home',
    component: () => import(/* webpackChunkName: "home" */ '../views/TeacherHome')
  },
  {
    path: '/create-experiment',
    name: 'create-experiment',
    component: () => import('../views/CreateExperiment')
  },
  {
    path: '/manager-home',
    name: 'manager-home',
    component: () => import('../views/ManagerHome')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
