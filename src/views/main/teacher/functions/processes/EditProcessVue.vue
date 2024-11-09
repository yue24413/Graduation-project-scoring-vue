<script setup lang="ts">
import { createNoticeBoard } from '@/components/Notice'
import { processAuths } from '@/services/Const'
import { TeacherService } from '@/services/TeacherService'
import type { Process, ProcessItem, StudentAttach } from '@/types'
import { Check, Minus, Plus } from '@element-plus/icons-vue'
import { ElButton, ElCol, ElDialog, ElInput, ElOption, ElRow, ElSelect } from 'element-plus'
import { computed, ref } from 'vue'
const prop = defineProps<{ process: Process; totalScore: number }>()
const processR = ref<Process>(JSON.parse(JSON.stringify(prop.process)))
console.log(prop.totalScore)

const processItemR = ref<ProcessItem>({})
const processItemsR = ref<ProcessItem[]>(processR.value.items ?? [])
const dialogTableVisible = ref(true)
//
const Score = computed(() => prop.totalScore - prop.process.point! + (processR.value.point || 0))
const delItiemF = (item: ProcessItem) => {
  //浅拷贝 通过indexOf找
  const index = processItemsR.value.indexOf(item)
  processItemsR.value.splice(index, 1)
}
const addItemF = () => {
  if (!processItemR.value.name || !processItemR.value.point) return
  processItemR.value.number = processItemsR.value.length
  processItemsR.value.push(processItemR.value)
  processItemR.value = {}
  processR.value.items = processItemsR.value
  console.log(processR.value.items)
}
const processAttachR = ref<StudentAttach>({})
const processAttachsR = ref<StudentAttach[]>(processR.value.studentAttach ?? [])
const delAttachF = (Attach: StudentAttach) => {
  const index = processAttachsR.value.indexOf(Attach)
  processAttachsR.value.splice(index, 1)
}
const addAttachF = () => {
  if (!processAttachR.value.name || !processAttachR.value.ext) return
  processAttachR.value.number = processAttachsR.value.length
  processAttachsR.value.push(processAttachR.value)
  processAttachR.value = {}
  processR.value.studentAttach = processAttachsR.value
}
/********* */
const pointC = computed(() => {
  let allPoint = 0
  processItemsR.value.forEach((i) => i.point && (allPoint += i.point))
  return allPoint == 100
})
const updateProcessF = async () => {
  await TeacherService.updateProcessService(processR.value)
  createNoticeBoard('过程更新成功', '')
  dialogTableVisible.value = false
  processR.value = {}
}
</script>
<template>
  <el-dialog v-model="dialogTableVisible" title="Message" width="800">
    <div>
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input v-model="processR.name" placeholder="名称"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model.number="processR.point" placeholder="比例" type="number"></el-input>
        </el-col>
        <el-col :span="6">
          <el-select>
            <el-option
              v-for="(pa, index) in processAuths"
              :key="index"
              :label="pa.name"
              :value="pa.v"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row
        :gutter="10"
        style="margin-bottom: 10px"
        v-for="(i, index) of processR.items"
        :key="index">
        <el-col :span="6">{{ i.name }}</el-col>
        <el-col :span="6">{{ i.point }}</el-col>
        <el-col :span="6">
          <el-button
            circle
            size="small"
            :icon="Minus"
            @click="delItiemF(i)"
            type="danger"></el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input v-model="processItemR.name" placeholder="项名称"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model.number="processItemR.point" placeholder="比例" type="number"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button circle size="small" :icon="Plus" @click="addItemF" type="primary"></el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-bottom: 10px">
        <template v-for="(a, index) of process.studentAttach" :key="index">
          <el-col :span="6">{{ a.name }}</el-col>
          <el-col :span="6">{{ a.ext }}</el-col>
          <el-col :span="6">
            <el-button
              circle
              size="small"
              :icon="Minus"
              type="danger"
              @click="delAttachF(a)"></el-button>
          </el-col>
        </template>
      </el-row>
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input v-model.number="processAttachR.name" placeholder="学生附件名"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="processAttachR.ext" placeholder="文件扩展名  .ppt, .pptx"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            circle
            size="small"
            :icon="Plus"
            @click="addAttachF"
            type="primary"></el-button>
        </el-col>
      </el-row>
      {{ processR }}
      <br />
      <el-button
        type="success"
        :icon="Check"
        @click="updateProcessF"
        :disabled="!pointC || Score > 100">
        <span v-if="!pointC || Score > 100" style="color: red">
          子项分数之和应为100分 且过程总和小于等于100分
        </span>
      </el-button>
      {{ Score }}
    </div>
  </el-dialog>
</template>
