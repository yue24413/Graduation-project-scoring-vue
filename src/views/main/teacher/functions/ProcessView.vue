<script setup lang="ts">
import { CommonService } from '@/services'
import { processAuths } from '@/services/Const'
import EditProcessVue from '@/views/main/teacher/functions/processes/OperationProcessVue.vue'
import { watch } from 'vue'
import AddProcessVue from './AddProcessVue.vue'

const processesS = await CommonService.listProcessesService()
const authC = (authVal: string) => {
  let role = ''
  processAuths.find((ps) => {
    role = ps.v == authVal ? ps.name : ''
    if (role != '') {
      return role
    }
  })
  return role
}

///
let totalScore = processesS.value.reduce((Score, current) => Score + (current.point || 0), 0)
watch(
  processesS,
  () => (totalScore = processesS.value.reduce((Score, current) => Score + (current.point || 0), 0))
)
</script>
<template>
  <el-row :gutter="10" style="margin-bottom: 10px">
    <el-col><AddProcessVue :totalScore="totalScore" /></el-col>
    <el-col>
      <el-table :data="processesS">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column width="150">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template #default="scope">
            {{ authC(scope.row.auth) }}
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template #default="scope">{{ scope.row.point }}%</template>
        </el-table-column>
        <el-table-column width="130">
          <template #default="scope">
            <template v-for="(i, index) of scope.row.items" :key="index">
              {{ i.name }}-{{ i.point }}%
            </template>
          </template>
        </el-table-column>
        <el-table-column width="80" />
        <el-table-column width="150">
          <template #default="scope">
            <template v-for="(i, index) of scope.row.studentAttach" :key="index">
              {{ i.name }} -{{ i.ext }}
            </template>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template #default="scope">
            <EditProcessVue :process="scope.row" :totalScore="totalScore" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
