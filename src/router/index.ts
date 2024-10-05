import { createMessageDialog } from '@/components/message/index'
import { CommonService } from '@/services'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/IndexView.vue')
  },
  {
    path: '/',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/login/IndexView.vue')
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach((to, from) => {
  const roles = to.meta.roles

  // 如果路由没有定义权限，则直接放行
  if (!roles) return true

  // 获取当前用户的角色
  const userRole = CommonService.getRole()

  // 检查用户角色是否在路由定义的角色数组中
  if (Array.isArray(roles) && roles.includes(userRole)) {
    return true
  } else {
    createMessageDialog('无权限')
    return { name: 'home' }
  }
})

export default router
