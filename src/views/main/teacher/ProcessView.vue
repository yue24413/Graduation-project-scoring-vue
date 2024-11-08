<script setup lang="ts">
import { CommonService } from '@/services'
import { collectService } from '@/services/collectService'
import { PA_REVIEW } from '@/services/Const'
import { TeacherService } from '@/services/TeacherService'
import { useUserStore } from '@/stores/UserStore'
import type { ProcessScore, Student, StudentProcessScore, User } from '@/types/index'

import { defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const userS = userStore.userS
const params = useRoute().params as { pid: string; auth: string }

const result = await Promise.all([
  params.auth == PA_REVIEW
    ? TeacherService.listGroupStudentsService()
    : TeacherService.listTutorStudentsService(),
  TeacherService.listProcessScoresService(params.pid, params.auth),
  TeacherService.listPorcessFilesService(params.pid, params.auth),
  CommonService.listProcessesService()
])

const studentsS = result[0]
const processesS = result[3]

let collectS = collectService(result[1].value, studentsS)
let cPsS = collectS.currentPStudentsR
let levelValue = collectS.levelCount
/********************* */
//评分
const gradingDialog = defineAsyncComponent(() => import('./GradingDialog.vue'))
const gradingDialogVisable = ref(false)
const currentStudentR = ref<StudentProcessScore>()
const gradeF = (s: StudentProcessScore) => {
  gradingDialogVisable.value = true
  currentStudentR.value = s
}
const addProcessScoreF = async (ps: ProcessScore) => {
  const result = await TeacherService.addPorcessScoreService(params.pid, params.auth, ps)
  //新分数重新计算
  // collectPS(result.value)
  collectS = collectService(result.value, studentsS)
  cPsS = collectS.currentPStudentsR
  levelValue = collectS.levelCount
}

const closeF = () => (gradingDialogVisable.value = false)
</script>
<template>
  <div>
    <el-row style="margin: 0px 50px">
      <el-col>
        <div>
          优秀
          <el-tag :type="levelValue.score_90 > 0 ? 'success' : 'primary'">
            {{ levelValue.score_90 }}
          </el-tag>
          ；良好
          <el-tag :type="levelValue.score_80 > 0 ? 'info' : 'primary'">
            {{ levelValue.score_80 }}
          </el-tag>
          ；中等
          <el-tag :type="levelValue.score_70 > 0 ? 'warning' : 'primary'">
            {{ levelValue.score_70 }}
          </el-tag>
          ；及格
          <el-tag :type="levelValue.score_60 > 0 ? 'primary' : 'primary'">
            {{ levelValue.score_60 }}
          </el-tag>
          ；不及格
          <el-tag :type="levelValue.score_last > 0 ? 'danger' : 'primary'">
            {{ levelValue.score_last }}
          </el-tag>
          ；共
          <el-tag>{{ levelValue.len }}</el-tag>
        </div>
        <el-table :data="cPsS">
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
          <el-table-column label="附件">
            <template #defult="scope">
              <!-- <template v-for="(attach, index) of currentProcessAttach" :key="index">
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
              </template> -->
            </template>
          </el-table-column>
          <el-table-column label="评分/平均分">
            <template #default="scope">
              {{ scope.row.currentTeacherScore }} /
              <el-text type="primary" size="large">
                {{ scope.row.averageScore }}
              </el-text>
              <br />
              <span v-for="(t, index) of scope.row.psTeachers" :key="index">
                {{ t.teacherName }};
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" @click="gradeF(scope.row as StudentProcessScore)">
                评分
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
  <gradingDialog
    v-if="gradingDialogVisable"
    :student="currentStudentR!"
    :close="closeF"
    :add-process-score="addProcessScoreF"
    :processId="params.pid" />
</template>
