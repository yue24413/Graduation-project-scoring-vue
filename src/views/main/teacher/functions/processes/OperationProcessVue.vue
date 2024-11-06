<script setup lang="ts">
import type { Process } from '@/types'
import { createEditProcessDialog } from '.'

import { TeacherService } from '@/services/TeacherService'
import { ElMessage, ElMessageBox } from 'element-plus'
const prop = defineProps<{ process: Process }>()
const processItemR = prop.process
const delPorcessF = (pid: string) => {
  ElMessageBox.confirm(`删除${processItemR.name}将不可恢复，确定删除？`, 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await TeacherService.delProcessService(pid)
    })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
</script>
<template>
  <div>
    <el-button type="primary" @click="createEditProcessDialog(prop.process)">
      <el-icon><EditPen /></el-icon>
    </el-button>
    <el-button type="danger" @click="delPorcessF(prop.process.id ?? '')">
      <el-icon><DeleteFilled /></el-icon>
    </el-button>
  </div>
</template>
