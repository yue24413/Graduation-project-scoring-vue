import { createMessageDialog } from '@/components/message/index'
import { CommonService } from '@/services'
import * as consty from '@/services/Const'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/IndexView.vue')
  },
  {
    path: '/',
    component: () => import('@/views/main/IndexView.vue'),
    meta: {
      roles: [consty.STUDENT, consty.TEACHER, consty.ADMIN]
    },
    children: [
      {
        path: 'student',
        component: () => import('@/views/main/student/IndexView.vue'),
        meta: {
          roles: [consty.STUDENT]
        }
      },
      {
        path: 'teacher',
        component: () => import('@/views/main/teacher/IndexView.vue'),
        meta: {
          roles: [consty.TEACHER]
        },
        children: [
          {
            path: '',
            component: () => import('@/views/main/teacher/TutorStudentsView.vue')
          }
        ]
      },
      {
        path: 'admin',
        component: () => import('@/views/main/admin/IndexView.vue'),
        meta: {
          roles: [consty.ADMIN]
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
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
    return { name: 'login' }
  }
})

export default router
