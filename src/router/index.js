import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    redirect: '/defects'
  },
  {
    path: '/defects',
    name: 'Defects',
    component: () => import('../views/DefectList.vue'),
    meta: { title: '病害列表', requiresAuth: true }
  },
  {
    path: '/defect/:id',
    name: 'DefectDetail',
    component: () => import('../views/DefectDetail.vue'),
    meta: { title: '病害详情', requiresAuth: true }
  },
  {
    path: '/workorders',
    name: 'WorkOrders',
    component: () => import('../views/WorkOrderList.vue'),
    meta: { title: '任务单', requiresAuth: true }
  },
  {
    path: '/workorder/:id',
    name: 'WorkOrderDetail',
    component: () => import('../views/WorkOrderDetail.vue'),
    meta: { title: '任务单详情', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '无人机巡检 APP'
  
  const token = localStorage.getItem('token')
  const requiresAuth = to.meta.requiresAuth !== false
  
  if (requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
