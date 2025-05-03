<script setup lang="ts">
import { createNoticeBoard } from '@/components/Notice'
import { TeacherService } from '@/services/TeacherService'
import type { Process } from '@/types'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { createEditProcessDialog } from '.'

const prop = defineProps<{ process: Process }>()

const delPorcessF = (pid: string) => {
  ElMessageBox.confirm(
    `删除<span style="color: red; font-weight: bold">${prop.process.name}</span>将不可恢复，确定删除？`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  ).then(async () => {
    await TeacherService.delProcessService(pid)
    createNoticeBoard('过程已删除', '')
  })
}
</script>
<template>
  <el-button type="primary" :icon="Edit" circle @click="createEditProcessDialog(prop.process)" />
  <el-button type="danger" :icon="Delete" circle @click="delPorcessF(prop.process.id ?? '')" />
</template>
