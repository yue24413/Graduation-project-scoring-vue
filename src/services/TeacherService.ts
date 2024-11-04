import { createProgressNotification } from '@/components/progress'
import { useGet, usePost } from '@/fetch'
import { teacherStores } from '@/store/TeacherStores'
import type { ProcessFile, ProcessScore, Progress, User } from '@/type'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { ELLoading, StoreCache, StoreClear, StoreMapCache } from './Decorators'

const TEACHER = 'teacher'
export class TeacherService {
  //全部学生
  static async listStudentsService() {
    const data = await useGet<User[]>(`teacher/students`)
    return data as unknown as Ref<User[]>
  }
  //基于当前组打分
  @StoreCache(teacherStores.ListGroupStudentsStore.studentsS)
  static async listGroupStudentsService() {
    const data = await useGet<User[]>(`teacher/students/group`)
    return data as unknown as Ref<User[]>
  }
  //基于导师所带学生组打分
  @StoreCache(teacherStores.ListTutorStudentsStore.studentsS)
  static async listTutorStudentsService() {
    const data = await useGet<User[]>(`teacher/students/tutor`)
    return data as unknown as Ref<User[]>
  }
  //某个过程的评分
  @
  @StoreMapCache(teacherStores.ListProcessesProcessScoresStore.processScoresMap)
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    const prop = await useGet<ProcessScore[]>(`teacher/processes/${pid}/types/${auth}`)
    return prop as unknown as Ref<ProcessScore[]>
  }

  //添加评分
  @ELLoading()
  @StoreClear(teacherStores.ListProcessesProcessScoresStore.processScoresMap)
  @StoreMapCache(teacherStores.ListProcessesProcessScoresStore.processScoresMap, [0, 1])
  static async addPorcessScoreService(pid: string, auth: string, ps: ProcessScore) {
    ps.detail = JSON.stringify(ps.detail)
    const prop = await usePost<ProcessScore[]>(`${TEACHER}/processscores/types/${auth}`, ps)
    return prop.data.value?.data as unknown as Ref<ProcessScore[]>
  }

  //
  static async listPorcessFilesService(pid: string, auth: string) {
    const data = await useGet<ProcessFile[]>(`teacher/processfiles/${pid}/types/${auth}`)
    return data
  }
  //从服务器下载指定文件，并在下载过程中更新一个进度条通知
  static getProcessFileService = async (name: string) => {
    //使用 encodeURIComponent 对文件名进行编码
    const pname = encodeURIComponent(name)
    const progressR = ref<{ progress: Progress }>({
      progress: { percentage: 0, title: name, rate: 0, total: 0, loaded: 0 }
    })
    const progNotiF = createProgressNotification(progressR.value)
    const resp = await useGet(`teacher/download/${pname}`)
  }
}
