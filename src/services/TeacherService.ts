import { useGet } from '@/fetch'
import type { ResultVO, User } from '@/type'
export class TeacherService {
  static async listTutorStudentsService() {
    const prop = useGet<ResultVO<{ students: User[] }>>('teacher/student/tutor')
    return (await prop).data.value
  }
}
