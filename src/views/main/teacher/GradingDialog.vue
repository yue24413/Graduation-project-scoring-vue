<script setup lang="ts">
import { CommonService } from '@/services'
import type { ProcessScore, StudentProcessScore } from '@/type'
import { ref } from 'vue'

interface Props {
  processId: string
  student: StudentProcessScore
  addProcessScore: (aps: ProcessScore) => void
}
const props = defineProps<Props>()
const dialogVisible = ref(true)
//需要得到某个过程中的所有子项，动态描述名称以及占比
const processesS = await CommonService.listProcessesService()
//得到具体的过程
const process = processesS?.find((p) => {
  p.id == props.processId
})
//过程下的具体项
const processItims = process?.items ??[]

</script>
<template>
  <div>
    <el-dialog v-model="dialogVisible" title="Grading" @close="dialogVisible = false">
      <el-row class="row">
        <el-col>
          <el-text>{{ props.student.student?.name }}</el-text>
          平均分
        </el-col>
        <el-col>
          <el-text>{{ props.student.averageScore }}</el-text>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col>自动分配评分</el-col>
        <el-col>
          <el-input></el-input>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col></el-col>
        <el-col>
          <el-input></el-input>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col></el-col>
        <el-col>
          <el-input></el-input>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col></el-col>
        <el-col>
          <el-input></el-input>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
