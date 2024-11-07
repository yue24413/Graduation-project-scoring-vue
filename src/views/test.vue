<script setup lang="ts">
const collectPS = (pses: ProcessScore[]) => {
  levelCount.value = {
    score_last: 0,
    score_60: 0,
    score_70: 0,
    score_80: 0,
    score_90: 0,
    len: studentsS.value?.length || 0
  }
  currentPStudentsR.value = []
  studentsS.value?.forEach((s) => {
    const stuD: StudentProcessScore = {}
    stuD.student = s
    currentPStudentsR.value.push(stuD)
    let temp = 0
    stuD.psTeachers = []
    stuD.averageScore = temp
    const teacherPSs = pses.filter((ps) => ps.studentId == stuD.student?.id)
    if (!teacherPSs) return

    //当前循环到的学生 有老师评分
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
      //塞得分
      stuD.psTeachers?.push(psTeacher)
      if (!userS.value) return
      //判断是不是当前登录的user
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
}
</script>
