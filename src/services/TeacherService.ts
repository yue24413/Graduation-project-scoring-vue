import { useGet } from '@/fetch'
import type { ProcessScore, User } from '@/type'
export class TeacherService {
  //全部学生
  static async listStudentsService() {
    const data = await useGet<User[]>(`teacher/students`)
    return data.data.value
  }
  //基于当前组打分
  static async listGroupStudentsService() {
    const data = await useGet<User[]>(`teacher/students/group`)
    return data.data.value?.data
  }
  //基于导师所带学生组打分
  static async listTutorStudentsService() {
    const data = await useGet<User[]>(`teacher/students/tutor`)
    return data.data.value?.data
  }
  //某个过程的评分
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    const data = await useGet<ProcessScore[]>(`teacher/processes/${pid}/types/${auth}`)
    return data.data.value?.data
  }
}
