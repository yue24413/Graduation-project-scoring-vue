<script setup lang="ts">
import { TeacherService } from '@/services/TeacherService'
const groupTeacherR = await TeacherService.listGroupStudentsService()
</script>
<template>
  <div>
    <el-row>
      <el-col>
        <el-tag>第{{ groupTeacherR[0].groupNumber }}组评审</el-tag>
      </el-col>
    </el-row>
  </div>
</template>
