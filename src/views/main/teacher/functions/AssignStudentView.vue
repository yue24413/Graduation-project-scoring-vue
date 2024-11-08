<script setup lang="ts">
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types/index'
import { Check } from '@element-plus/icons-vue'
import { ref } from 'vue'
interface TeacherTemp {
  id?: string
  name?: string
  total?: number
  A?: number
  B?: number
  C?: number
  levelA?: User[]
  levelB?: User[]
  levelC?: User[]
}
const teachersR = ref<TeacherTemp[]>([])
const results = await Promise.all([
  TeacherService.listTeachersService(),
  TeacherService.listStudentsService()
])
const allTeachersR = results[0]
const allStudentsR = results[1]
let totalA = 0
let totalC = 0

allTeachersR.value.forEach((ts) => {
  totalA += ts.teacher?.A || 0
  totalC += ts.teacher?.C || 0
  const teacher: TeacherTemp = {
    id: ts.id,
    name: ts.name,
    total: ts.teacher?.total,
    A: ts.teacher?.A,
    B: ts.teacher?.total! - (ts.teacher?.A || 0) - (ts.teacher?.C || 0),
    C: ts.teacher?.C,
    levelA: [],
    levelB: [],
    levelC: []
  }
  teachersR.value.push(teacher)
})
console.log(allStudentsR.value.slice(0, totalA))
</script>
<template>
  <div>
    <el-row class="my-row">
      <el-col class="my-col" :span="2"><el-button type="primary">随机分配</el-button></el-col>
      <el-col class="my-col" :span="2"><el-button type="success" :icon="Check"></el-button></el-col>
      <el-col class="my-col" :span="2"><el-button type="primary">导出分配表格</el-button></el-col>
    </el-row>
    <el-row class="my-row">
      <el-col class="my-col">
        <template v-for="(t, index) of teachersR" :key="index">
          {{ t.name }} / {{ t.total }}:
          <br />
        </template>
      </el-col>
    </el-row>
  </div>
</template>
