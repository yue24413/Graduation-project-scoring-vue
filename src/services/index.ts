import { createNoticeBoard } from '@/components/Notice/index'
import { useGet, usePost } from '@/fetch'
import router from '@/router'
import * as consty from '@/services/Const'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUserStore } from '@/stores/UserStore'
import type { Process, User } from '@/types/index'
import type { Ref } from 'vue'
import { StoreCache } from './Decorators'
const userStore = useUserStore()
const processStore = useProcessStore()
// indexStores
export class CommonService {
  static refreshPage = async () => {
    setTimeout(() => {
      location.reload()
    }, 2000)
  }
  // login
  static loginService = async (user: User) => {
    const resp = await usePost<{ user: User }>('login', user)

    const token = resp.response.value?.headers.get('token')
    token && sessionStorage.setItem('token', token)
    const role = resp.response.value?.headers.get('role')
    role && sessionStorage.setItem('role', role)
    role && userStore.setUserSessionStorage(resp.data.value?.data as User, role)
    const name = userStore.userS.value?.name
    if (token) {
      // 显示成功消息
      createNoticeBoard('登录成功!', '欢迎您！' + name)
      if (user.number === user.password) {
        router.push('/settings')
        return
      }
      let path = ''
      switch (role) {
        case consty.ADMIN:
          path = '/admin'
          break
        case consty.STUDENT:
          path = '/student'
          break
        case consty.TEACHER:
          path = '/teacher'
          break
      }
      router.push(path)
    }
  }
  static getRole() {
    return sessionStorage.getItem('role')
  }
  @StoreCache(processStore.processesS)
  static async listProcessesService() {
    const data = await useGet<Process[]>('processes')
    return data as unknown as Ref<Process[]>
  }
  static updateSelfPassword = async (pwd: string) => {
    await usePost('passwords', { password: pwd })
  }
}
