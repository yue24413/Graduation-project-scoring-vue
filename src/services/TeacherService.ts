import { createProgressNotification } from '@/components/progress'
import { useGet } from '@/fetch'
import { ListTutorStudentsStore } from '@/store/ListTutorStudentsStore'
import type { ProcessFile, ProcessScore, Progress, User } from '@/type'
import { ref } from 'vue'
export class TeacherService {
  //全部学生
  static async listStudentsService() {
    const data = await useGet<User[]>(`teacher/students`)
    return data.data.value?.data
  }
  //基于当前组打分
  static async listGroupStudentsService() {
    const data = await useGet<User[]>(`teacher/students/group`)
    return data.data.value?.data
  }
  //基于导师所带学生组打分
  static async listTutorStudentsService() {
    if (!ListTutorStudentsStore().studentsS.value) {
      const data = await useGet<User[]>(`teacher/students/tutor`)
      ListTutorStudentsStore().studentsS.value = data.data.value!
      return data.data.value?.data
    }
    return ListTutorStudentsStore().studentsS.value?.data
  }
  //某个过程的评分
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    const data = await useGet<ProcessScore[]>(`teacher/processes/${pid}/types/${auth}`)

    return data.data.value?.data
  }

  //
  static async listPorcessFilesService(pid: string, auth: string) {
    const data = await useGet<ProcessFile[]>(`teacher/processfiles/${pid}/types/${auth}`)
    return data.data.value?.data
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
