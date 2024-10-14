import { createNoticeBoard } from '@/components/Notice/index'
import { useGet, usePost } from '@/fetch'
import router from '@/router'
import * as consty from '@/services/Const'
import type { Process, User } from '@/type/index'
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
    // const name = resp.response.value?.headers.get('name')
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
    const data = await useGet<Process[]>('processes')
    console.log(data.data.value?.data)
    return data.data.value?.data
  }
}
