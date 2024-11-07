import { useUserStore } from '@/stores/UserStore'
import type {
  LevelCount,
  ProcessScore,
  PSDetail,
  PSDetailTeacher,
  StudentProcessScore,
  User
} from '@/types/index'
import type { Ref } from 'vue'
import { ref } from 'vue'
export const collectService = (pses: ProcessScore[], studentsS: Ref<User[]>) => {
  const currentPStudentsR = ref<StudentProcessScore[]>([])
  const userStore = useUserStore()
  const userS = userStore.userS
  const levelCount = ref<LevelCount>({
    score_last: 0,
    score_60: 0,
    score_70: 0,
    score_80: 0,
    score_90: 0,
    len: studentsS?.value.length
  })
  const collectPS = (pses: ProcessScore[]) => {
    levelCount.value = {
      score_last: 0,
      score_60: 0,
      score_70: 0,
      score_80: 0,
      score_90: 0,
      len: studentsS?.value.length
    }
    studentsS.value.forEach((s) => {
      const stuD: StudentProcessScore = {}
      stuD.student = s
      currentPStudentsR.value.push(stuD)
      let temp = 0
      stuD.psTeachers = []
      stuD.averageScore = temp
      const teacherPSs = pses.filter((ps) => ps.studentId == stuD.student?.id)
      if (!teacherPSs) return
      teacherPSs.forEach((ps) => {
        const psDetail = ps.detail as PSDetail
        psDetail.score && (temp += psDetail.score)
        const psTeacher: PSDetailTeacher = {
          processScoreId: ps.id,
          teacherId: ps.teacherId,
          teacherName: psDetail.teacherName,
          score: psDetail.score,
          detail: psDetail.detail
        }
        stuD.psTeachers?.push(psTeacher)
        if (!userS.value) return
        if (ps.teacherId == userS.value.id) {
          stuD.currentTeacherScore = psDetail.score
        }
        stuD.psTeachers?.length! > 0 && (stuD.averageScore = temp / stuD.psTeachers?.length!)
        stuD.averageScore = Math.round(stuD.averageScore!)

        if (stuD.averageScore >= 90) {
          levelCount.value.score_90++
        } else if (stuD.averageScore >= 80 && stuD.averageScore < 90) {
          levelCount.value.score_80++
        } else if (stuD.averageScore >= 70 && stuD.averageScore < 80) {
          levelCount.value.score_70++
        } else if (stuD.averageScore >= 60 && stuD.averageScore < 70) {
          levelCount.value.score_60++
        } else if (stuD.averageScore < 60) {
          levelCount.value.score_last++
        }
      })
    })
    return { currentPStudentsR, levelCount }
  }
  return collectPS(pses)
}
