<script setup lang="ts">
import { CommonService } from '@/services'
import { PA_REVIEW } from '@/services/Const'
import { TeacherService } from '@/services/TeacherService'
import { useUserStore } from '@/store/UserStore'
import type {
  LevelCount,
  PSDetail,
  PSDetailTeacher,
  ProcessFile,
  ProcessScore,
  Student,
  StudentProcessScore,
  User
} from '@/type/index'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const userStore = useUserStore()
const userS = userStore.userS
//从地址中得到过程id以及过程身份
const params = useRoute().params as { pid: string; auth: string }

//result数组封装各个功能
const result = await Promise.all([
  params.auth == PA_REVIEW
    ? TeacherService.listTutorStudentsService()
    : TeacherService.listGroupStudentsService(),

  //通过pid和auth双重 得到点击的某个过程
  TeacherService.listProcessesProcessScoresService(params.pid, params.auth),
  //File
  TeacherService.listPorcessFilesService(params.pid, params.auth),
  //导航
  CommonService.listProcessesService()
])
const studentsS = result[0]
const processesS = result[3]
const levelCount = ref<LevelCount>({
  score_last: 0,
  score_60: 0,
  score_70: 0,
  score_80: 0,
  score_90: 0,
  len: studentsS?.length || 0
})

/*:data="currentPStudentsR" 表示这个表格将会使用名为 currentPStudentsR 的数据数组作为其数据源。这个数组中的每个元素通常代表一行数据，而每一行数据中的键（key）则会对应表格中的列。 */

const currentPStudentsR = ref<StudentProcessScore[]>([])
const collectPS = (pses: ProcessScore[]) => {
  levelCount.value = {
    score_last: 0,
    score_60: 0,
    score_70: 0,
    score_80: 0,
    score_90: 0,
    len: studentsS?.length || 0
  }
  currentPStudentsR.value = []
  studentsS?.forEach((s) => {
    console.log(s)
    const stuD: StudentProcessScore = {}
    stuD.student = s
    currentPStudentsR.value.push(stuD)
    let temp = 0
    stuD.psTeachers = []
    stuD.averageScore = temp

    const teacherPSs = pses.filter((ps) => {
      ps.studentId == stuD.student?.id
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
  })
}
collectPS(result[1] as ProcessScore[])

/********* */
const currentProcessAttach = processesS?.find((ps) => ps.id == params.pid)?.studentAttach

const processFilesR = ref<ProcessFile[]>()
processFilesR.value = result[2]
const processFileC = computed(
  () => (sid: string, number: number) =>
    processFilesR.value?.find((pf) => pf.studentId == sid && pf.number == number)
)
const clickAttachF = async (sid: string, number: number) => {
  const pname = processFilesR.value?.find(
    (pf) => pf.studentId == sid && pf.number == number
  )?.detail
  pname && (await TeacherService.getProcessFileService(pname))
}

/********************* */
//评分
</script>
<template>
  <div>
    <el-row style="margin: 0px 50px">
      <el-col>
        <div>
          优秀
          <el-tag :type="levelCount.score_90 > 0 ? 'success' : ''">
            {{ levelCount.score_90 }}
          </el-tag>
          ；良好
          <el-tag :type="levelCount.score_80 > 0 ? 'info' : ''">{{ levelCount.score_80 }}</el-tag>
          ；中等
          <el-tag :type="levelCount.score_70 > 0 ? 'warning' : ''">
            {{ levelCount.score_70 }}
          </el-tag>
          ；及格
          <el-tag :type="levelCount.score_60 > 0 ? 'primary' : ''">
            {{ levelCount.score_60 }}
          </el-tag>
          ；不及格
          <el-tag :type="levelCount.score_last > 0 ? 'danger' : ''">
            {{ levelCount.score_last }}
          </el-tag>
          ；共
          <el-tag>{{ levelCount.len }}</el-tag>
        </div>
        <el-table :data="currentPStudentsR">
          <el-table-column type="index" label="#" />
          <el-table-column>
            <template #default="scope">
              <el-text>
                {{ (scope.row.student as User).name }}
              </el-text>
              <br />
              <el-text>
                {{ (scope.row.student.student as Student).teacherName }}
              </el-text>
              <br />
              <el-text>
                {{ (scope.row.student.student as Student).projectTitle }}
              </el-text>
            </template>
          </el-table-column>
          <!-- <el-table-column label="附件">
            <template #defult="scope">
              <template v-for="(attach, index) of currentProcessAttach" :key="index">
                <el-button
                  :icon="attach.number == 1 ? Box : Brush"
                  :color="attach.number == 1 ? '#409EFF' : '#626aef'"
                  style="margin-bottom: 5px"
                  @click="
                    clickAttachF((scope.row as StudentProcessScore).student?.id!, attach.number!)
                  "
                  v-if="
                    processFileC((scope.row as StudentProcessScore).student?.id!, attach.number!)
                  ">
                  {{ attach.name }}
                </el-button>
                <br />
              </template>
            </template>
          </el-table-column> -->
          <el-table-column label="评分/平均分">
            <template #defult="scope">
              {{ scope.row.currentTeacherScore }} / {{ scope.row.averageScore }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
