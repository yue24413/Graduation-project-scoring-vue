<script setup lang="ts">
import { CommonService } from '@/services/index'
const menus = [
  {
    name: '学生',
    path: '/teacher'
  }
]

const processesS = await CommonService.listProcessesService()
processesS?.forEach((ps) => {
  menus.push({ name: ps.name!, path: `teacher/processes/${ps.id}/types/${ps.auth}` })
})
</script>
<template>
  <el-menu mode="horizontal" router>
    <template v-for="(menu, index) in menus" :key="index">
      <el-menu-item :index="menu.path">{{ menu.name }}</el-menu-item>
    </template>
  </el-menu>
  <!-- <el-menu-item index="/teacher/scores">小组成绩统计</el-menu-item>
  <el-menu-item index="/teacher/functions">功能</el-menu-item> -->
</template>
