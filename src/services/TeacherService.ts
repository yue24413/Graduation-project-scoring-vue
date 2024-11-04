import { createProgressNotification } from '@/components/progress'
import { useGet, usePost } from '@/fetch'
import { teacherStores } from '@/store/TeacherStores'
import type { ProcessFile, ProcessScore, Progress, User } from '@/type'
import type { Ref } from 'vue'
import { ref } from 'vue'
const TEACHER = 'teacher'
export class TeacherService {
  //全部学生
  static async listStudentsService() {
    const data = await useGet<User[]>(`teacher/students`)
    return data as unknown as Ref<User[]>
  }
  //基于当前组打分
  static async listGroupStudentsService() {
    if (!teacherStores.ListGroupStudentsStore.studentsS.value) {
      const data = await useGet<User[]>(`teacher/students/group`)
      teacherStores.ListGroupStudentsStore.studentsS.value = data
    }
    console.log(teacherStores.ListGroupStudentsStore.studentsS.value)
    return teacherStores.ListGroupStudentsStore.studentsS.value
  }
  //基于导师所带学生组打分
  // @StoreCache(teacherStores.ListTutorStudentsStore.studentsS)
  static async listTutorStudentsService() {
    if (!teacherStores.ListTutorStudentsStore.studentsS.value) {
      const data = await useGet<User[]>(`teacher/students/tutor`)
      teacherStores.ListTutorStudentsStore.studentsS.value = data
    }
    // const data = await useGet<User[]>(`teacher/students/tutor`)
    return teacherStores.ListTutorStudentsStore.studentsS.value
    // return data.data.value?.data
  }
  //某个过程的评分
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    console.log('pid: ' + pid)
    const exists = teacherStores.ListProcessesProcessScoresStore.getProcessResult(pid)
    if (!exists) {
      const prop = await useGet<ProcessScore[]>(`teacher/processes/${pid}/types/${auth}`)
      console.log('useGet<ProcessScore>')
      console.log(prop)
      // 检查数据是否存在
      if (prop) {
        // 将获取到的数据直接存储在 Map 中
        teacherStores.ListProcessesProcessScoresStore.setProcessResult(pid, prop)
      }
    }
    return teacherStores.ListProcessesProcessScoresStore.getProcessResult(pid)
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

  //添加评分
  static addPorcessScoreService = async (ps: ProcessScore, auth: string) => {
    if (!teacherStores.AddPorcessScoreStore.PorcessScoreS.value) {
      const data = await usePost<ProcessScore[]>(`${TEACHER}/processscores/types/${auth}`, ps)
      teacherStores.AddPorcessScoreStore.PorcessScoreS.value = data
    }
    return teacherStores.AddPorcessScoreStore.PorcessScoreS.value
  }
}
