import { useGet } from '@/fetch'
import { ListTutorStudentsStore } from '@/store/ListTutorStudentsStore'
import type { ProcessFile, ProcessScore, User } from '@/type'
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
}
