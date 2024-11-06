<script setup lang="ts">
import type { Process } from '@/types'
import { DeleteFilled } from '@element-plus/icons-vue'
import { createEditProcessDialog } from '.'
const prop = defineProps<{ process: Process }>()
</script>
<template>
  <div>
    <el-button type="primary" @click="createEditProcessDialog(prop.process)">
      <el-icon><EditPen /></el-icon>
    </el-button>
    <el-button type="danger">
      <el-icon :icon="DeleteFilled"></el-icon>
    </el-button>
  </div>
</template>
