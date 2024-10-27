import { createNoticeBoard } from '@/components/Notice/index'
import { useGet, usePost } from '@/fetch'
import router from '@/router'
import * as consty from '@/services/Const'
import { indexStores } from '@/store'
import { useUserStore } from '@/store/UserStore'

import type { Process, User } from '@/type/index'
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
    role && useUserStore().setUserSessionStorage(resp.data.value as User, role)
    const name = useUserStore().userS.value?.name
    if (token) {
      // 显示成功消息
      createNoticeBoard('登录成功!', '欢迎您！' + name)
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
  static async listProcessesService() {
    if (!indexStores.ProcessesTypesStore().Processes.value) {
      const data = await useGet<Process[]>('processes')
      indexStores.ProcessesTypesStore().Processes.value = data.data.value!
    }
    return indexStores.ProcessesTypesStore().Processes.value?.data
    // const data = await useGet<Process[]>('processes')
    // return data.data.value?.data
  }
}
