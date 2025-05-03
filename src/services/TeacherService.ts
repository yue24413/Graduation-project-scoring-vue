import { createNoticeBoard } from '@/components/Notice'
import { useDelete, useGet, usePatch, usePost, usePut } from '@/fetch'
import { useInfosStore } from '@/stores/InfosStore'
import { useProcessInfosStore } from '@/stores/ProcessInfosStore'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUsersStore } from '@/stores/UsersStore'

import type {
  Process,
  ProcessFile,
  ProcessItem,
  ProcessScore,
  Progress,
  StudentAttach,
  StudentDTO,
  User
} from '@/types'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { ELLoading, StoreCache, StoreClear, StoreMapCache } from './Decorators'
const TEACHER = 'teacher'

const infosStore = useInfosStore()
const processInfosStore = useProcessInfosStore()
const processStore = useProcessStore()
const usersStore = useUsersStore()

export class TeacherService {
  // 获取指导学生

  @StoreCache(infosStore.tutortudentsS)
  static async listTutorStudentsService() {
    const data = await useGet<User[]>(`${TEACHER}/students/tutor`)
    return data as unknown as Ref<User[]>
  }

  //

  @StoreCache(infosStore.groupStudentsS)
  static async listGroupStudentsService() {
    const data = await useGet<User[]>(`${TEACHER}/students/group`)
    return data as unknown as Ref<User[]>
  }

  //

  @StoreCache(infosStore.groupTeachersS)
  static async listGroupTeachersService() {
    const data = await useGet<User[]>(`${TEACHER}/teachers/group`)
    return data as unknown as Ref<User[]>
  }

  // 加载指定过程评分
  @StoreMapCache(processInfosStore.processScoresMapS)
  @ELLoading()
  static async listProcessScoresService(pid: string, auth: string) {
    const data = await useGet<ProcessScore[]>(`${TEACHER}/processes/${pid}/types/${auth}`)
    return data as unknown as Ref<ProcessScore[]>
  }

  // 添加评分
  @ELLoading()
  @StoreClear(processInfosStore.clear)
  @StoreMapCache(processInfosStore.processScoresMapS, [0, 1])
  static async addPorcessScoreService(pid: string, auth: string, ps: ProcessScore) {
    // @ts-ignore
    ps.detail = JSON.stringify(ps.detail)
    const data = await usePost<ProcessScore[]>(`${TEACHER}/processscores/types/${auth}`, ps)
    return data.data.value?.data as unknown as Ref<ProcessScore[]>
  }

  //

  @StoreMapCache(processInfosStore.porcessFilesMapS)
  static async listPorcessFilesService(pid: string, auth: string) {
    const data = await useGet<ProcessFile[]>(`${TEACHER}/processfiles/${pid}/types/${auth}`)
    return data as unknown as ProcessFile[]
  }

  // 获取全部教师
  @StoreCache(usersStore.allTeachersS)
  // @ELLoading()
  static async listTeachersService() {
    const data = await useGet<User[]>(`${TEACHER}/teachers`)
    return data as unknown as Ref<User[]>
  }

  @StoreCache(usersStore.allStudentsS)
  @ELLoading()
  static async listStudentsService() {
    const data = await useGet<User[]>(`${TEACHER}/students`)
    return data as unknown as Ref<User[]>
  }
  // 获取全部学生评分
  @StoreCache(processInfosStore.allProcessScoresS)
  @ELLoading()
  static async getAllProcessScoresService() {
    const data = await useGet<ProcessScore[]>(`${TEACHER}/processscores`)
    return data as unknown as Ref<ProcessScore[]>
  }

  // 加载小组全部评分
  @ELLoading()
  @StoreCache(processInfosStore.groupProcessScoresS)
  static async listProcessScoresGroupService() {
    const data = await useGet<ProcessScore[]>(`${TEACHER}/processscores/groups`)
    return data as unknown as Ref<ProcessScore[]>
  }

  //
  //
  static getProcessFileService = async (name: string) => {
    const pname = encodeURIComponent(name)
    const progressR = ref<{ progress: Progress }>({
      progress: { percentage: 0, title: name, rate: 0, total: 0, loaded: 0 }
    })
    createNoticeBoard(`progressR.value`, '')

    try {
      // 创建一个新的 AbortController 用于取消请求
      const controller = new AbortController()
      const signal = controller.signal

      // 手动发起一个 fetch 请求，useGet 内部也是基于 fetch 的
      const response = await fetch(`${TEACHER}/download/${pname}`, {
        method: 'GET',
        headers: {
          // 如果 useGet 中有设置 token 等通用请求头，这里也需要添加
          token: sessionStorage.getItem('token') || ''
        },
        signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : 0
      let loaded = 0
      let isReading = true // 新增一个变量来控制循环

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body reader available')
      }

      const chunks: Uint8Array[] = []
      while (isReading) {
        // 使用变量控制循环
        const { done, value } = await reader.read()
        if (done) {
          isReading = false // 读取完成时设置为 false 退出循环
        }
        if (value) {
          chunks.push(value)
          loaded += value.length
          const progress = total > 0 ? loaded / total : 0
          const rate = total > 0 ? loaded / total / (Date.now() / 1000) : 0
          progressR.value.progress.percentage = progress
          progressR.value.progress.rate = rate
          progressR.value.progress.loaded = loaded
          progressR.value.progress.total = total
        }
      }

      const blob = new Blob(chunks)
      //progNotif.close();

      const filename = decodeURIComponent(response.headers.get('filename') || '')
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error('下载文件时出错:', error)
    }
  }

  //
  @ELLoading()
  @StoreCache(processStore.processesS, true)
  static async updateProcessService(process: Process) {
    // @ts-ignore
    process.items = JSON.stringify(process.items)
    // @ts-ignore
    process.studentAttach = JSON.stringify(process.studentAttach)
    const data = await usePatch<Process[]>(`${TEACHER}/processes`, process)
    return data as unknown as Ref<Process[]>
  }
  //
  @StoreCache(processStore.processesS, true)
  static async delProcessService(pid: string) {
    const data = await useDelete<Process[]>(`${TEACHER}/processes/${pid}`)
    return data as unknown as Ref<Process[]>
  }
  // 添加过程
  @StoreCache(processStore.processesS, true)
  static async addProcessService(ps: Process) {
    if ((ps.items as ProcessItem[])?.length > 0) {
      // @ts-ignore
      ps.items = JSON.stringify(ps.items)
    }
    if ((ps.studentAttach as StudentAttach[])?.length > 0) {
      // @ts-ignore
      ps.studentAttach = JSON.stringify(ps.studentAttach)
    }
    console.log(ps)

    const data = await usePost<Process[]>(`${TEACHER}/processes`, JSON.stringify(ps))
    return data.data.value?.data as unknown as Ref<Process[]>
  }

  @StoreCache(usersStore.allStudentsS, true)
  @ELLoading()
  static async addStudentsService(students: User[]) {
    students.forEach((stu) => {
      //@ts-ignore
      stu.student && (stu.student = JSON.stringify(stu.student))
    })
    console.log(students)
    const data = await usePost<User[]>(`${TEACHER}/students`, students)
    return data.data.value?.data as unknown as Ref<User[]>
  }

  // 更新学生信息
  @StoreClear(infosStore.clear)
  @StoreCache(usersStore.allStudentsS, true)
  @ELLoading()
  static async updateStudentsTeachersService(students: User[]) {
    students.forEach((stu) => {
      //@ts-ignore
      stu.student && (stu.student = JSON.stringify(stu.student))
    })
    const data = await usePatch<User[]>(`${TEACHER}/students/teachers`, students)
    return data as unknown as Ref<User[]>
  }

  // 更新学生信息
  @StoreClear(infosStore.clear)
  @StoreCache(usersStore.allStudentsS, true)
  @ELLoading()
  static async updateStudentsGroupsService(students: StudentDTO[]) {
    const data = await usePatch<User[]>(`${TEACHER}/students/groups`, students)
    return data as unknown as Ref<User[]>
  }

  // 更新学生信息
  @StoreClear(infosStore.clear)
  @StoreCache(usersStore.allStudentsS, true)
  @ELLoading()
  static async updateStudentsProjectsService(students: StudentDTO[]) {
    const data = await usePatch<User[]>(`${TEACHER}/students/projecttitles`, students)
    return data as unknown as Ref<User[]>
  }

  //
  static resetPasswordService = async (number: string) => {
    const data = await usePut<number>(`${TEACHER}/passwords/${number}`)
    return data
  }

  //
  static getStudentService = async (account: string) => {
    return await useGet<User>(`${TEACHER}/users/${account}`)
  }

  @StoreClear(usersStore.clear, infosStore.clear)
  static async updateStudentService(student: User) {
    // @ts-ignore
    student.student && (student.student = JSON.stringify(student.student))
    await usePatch(`${TEACHER}/student`, student)
    return true
  }
}
