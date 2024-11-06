<script setup lang="ts">
import { createMessageDialog } from '@/components/message'
import { processAuths } from '@/services/Const'
import { TeacherService } from '@/services/TeacherService'
import type { Process, ProcessItem, StudentAttach } from '@/types'
import { Check, Minus, Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

const dialogVisible = ref(false)
const processR = ref<Process>({})
const processItemR = ref<ProcessItem>({})
const processItemsR = ref<ProcessItem[]>(processR.value.items ?? [])
const processAttachR = ref<StudentAttach>({})
const processAttachsR = ref<StudentAttach[]>(processR.value.studentAttach ?? [])
//
const addItemF = () => {
  if (!processItemR.value.name || !processItemR.value.point) return
  processItemR.value.number = processItemsR.value.length
  processItemsR.value.push(processItemR.value)
  processItemR.value = {}
  processR.value.items = processItemsR.value
}
const addAttachF = () => {
  if (!processAttachR.value.name || !processAttachR.value.ext) return
  processAttachR.value.number = processAttachsR.value.length
  processAttachsR.value.push(processAttachR.value)
  processAttachR.value = {}
  processR.value.studentAttach = processAttachsR.value
}
//
const delItemF = (item: ProcessItem) => {
  const index = processItemsR.value.indexOf(item)
  processItemsR.value.splice(index, 1)
}
const delAttachF = (att: StudentAttach) => {
  const index = processAttachsR.value.indexOf(att)
  processAttachsR.value.splice(index, 1)
}
//
const addProcessF = async () => {
  await TeacherService.addProcessService(processR.value)
  createMessageDialog('过程添加成功')
  dialogVisible.value = false
  processR.value = {}
}
const pointC = computed(() => {
  let points = 0
  processItemsR.value.forEach((i) => i.point && (points = i.point + points))
  return points == 100
})
console.log(processItemsR)

//
</script>
<template>
  <el-button type="primary" @click="dialogVisible = true">
    <el-icon><Plus /></el-icon>
  </el-button>
  <el-dialog v-model="dialogVisible" title="Message">
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input placeholder="名称" v-model="processR.name"></el-input>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="占总比例" v-model.number="processR.point" type="number"></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="processR.auth">
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
      v-for="(item, index) of processItemsR"
      :key="index"
      style="margin-bottom: 10px">
      <el-col :span="6">
        {{ item.name }}
      </el-col>
      <el-col :span="6">
        {{ item.point }}
      </el-col>
      <el-col :span="6">
        <el-button type="danger" circle :icon="Minus" @click="delItemF(item)"></el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input v-model="processItemR.name" placeholder="项名称" />
      </el-col>
      <el-col :span="6">
        <el-input v-model.number="processItemR.point" placeholder="占过程比例" type="number" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" :icon="Plus" circle @click="addItemF"></el-button>
      </el-col>
    </el-row>
    <el-row
      :gutter="10"
      v-for="(item, index) of processAttachsR"
      :key="index"
      style="margin-bottom: 10px">
      <el-col :span="6">
        {{ item.name }}
      </el-col>
      <el-col :span="6">
        {{ item.ext }}
      </el-col>
      <el-col :span="6">
        <el-button type="danger" circle :icon="Minus" @click="delAttachF(item)"></el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input placeholder="学生附件名称" v-model="processAttachR.name"></el-input>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="文件拓展名" v-model="processAttachR.ext"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" circle :icon="Plus" @click="addAttachF"></el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="success" :icon="Check" @click="addProcessF" :disabled="!pointC">
        <span v-if="!pointC" style="color: red">子项分数之和应为100分</span>
      </el-button>
    </el-row>
  </el-dialog>
</template>
