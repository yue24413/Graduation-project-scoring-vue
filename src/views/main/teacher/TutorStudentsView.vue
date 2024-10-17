<script setup lang="ts">
import { TeacherService } from '@/services/TeacherService'
import type { Student } from '@/type'
const studentsR = await TeacherService.listTutorStudentsService()
// 直接访问scope.row.student.queueNumber和scope.row.student.projectTitle会导致错误，因为这些属性并不存在于字符串上
</script>
<template>
  <el-row class="my-row" style="margin: 0px 50px">
    <el-col style="margin-bottom: 10px">
      <el-table :data="studentsR">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column property="name" min-width="50" />
        <el-table-column min-width="50">
          <template #default="scope">
            {{ scope.row.groupNumber }}组；{{ (scope.row.student as Student).queueNumber }}号
          </template>
        </el-table-column>
        <el-table-column min-width="150">
          <template #default="scope">
            {{ (scope.row.student as Student).projectTitle }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
