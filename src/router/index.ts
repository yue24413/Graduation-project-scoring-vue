import { CommonService } from '@/services'
import * as consty from '@/services/Const'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// createWebHashHistory
// createWebHistory
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
          },
          {
            path: 'scores',
            component: () => import('@/views/main/teacher/GroupScoringsView.vue')
          },
          {
            path: 'functions',
            component: () => import('@/views/main/teacher/functions/IndexView.vue')
          },
          {
            path: 'processes/:pid/types/:auth',
            component: () => import('@/views/main/teacher/ProcessView.vue')
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
    redirect: '/'
  }
]
const router = createRouter({
  // history: createWebHashHistory(),
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
    return { name: 'login' }
  }
})

export default router
