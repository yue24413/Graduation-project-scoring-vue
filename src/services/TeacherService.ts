import { useGet, usePatch, usePost } from '@/fetch'
import { useInfosStore } from '@/stores/InfosStore'
import { useProcessInfosStore } from '@/stores/ProcessInfosStore'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUsersStore } from '@/stores/UsersStore'
import type { Process, ProcessFile, ProcessScore, User } from '@/types'
import type { Ref } from 'vue'
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
    return await useGet<ProcessFile[]>(`${TEACHER}/processfiles/${pid}/types/${auth}`)
  }

  // 获取全部教师
  @StoreCache(usersStore.allTeachersS)
  static async listTeachersService() {
    const data = await useGet<User[]>(`${TEACHER}/teachers`)
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
  @StoreCache(processInfosStore.groupProcessScoresS)
  @ELLoading()
  static async listProcessScoresGroupService() {
    const data = await useGet<ProcessScore[]>(`${TEACHER}/processscores/groups`)
    return data as unknown as Ref<ProcessScore[]>
  }

  //
  //
  @StoreCache(processStore.processesS, true)
  static async updateProcessService(process: Process) {
    // @ts-ignore
    process.items = JSON.stringify(process.items)
    // @ts-ignore
    process.studentAttach = JSON.stringify(process.studentAttach)
    const data = await usePatch<Process[]>(`${TEACHER}/processes`, process)
    return data as unknown as Ref<Process[]>
  }
}
