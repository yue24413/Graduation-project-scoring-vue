import { createNoticeBoard } from '@/components/Notice/index'
import { usePost } from '@/fetch'
import type { User } from '@/type/index'

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
    const name = resp.response.value?.headers.get('name')
    if (token) {
      // 显示成功消息
      createNoticeBoard('登录成功!', '欢迎您！' + name)
    }
    CommonService.refreshPage()
  }

  static getRole() {
    return sessionStorage.getItem('role')
  }
}

// const LibraryView = async () => {
//   const resp = await useGet<{ user: User }>('library')
//   userStore().userS.value = resp.data.value?.data.user ?? {}
//   const role = sessionStorage.getItem('role')
//   const userS = userStore().userS
//   userS.value = resp.data.value?.data.user ?? {}
//   console.log(resp.data.value?.data.user)
//   console.log(role)
//   let path = ''
//   switch (role) {
//     case consty.USER:
//       path = '/library/user'
//       break
//     case consty.ADMIN:
//       path = '/library/admin'
//       break
//     default:
//       path = '/library/defult'
//       break
//   }
//   console.log(path)
//   router.push(path)
// }
// export { LibraryView }
