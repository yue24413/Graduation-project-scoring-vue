<script setup lang="ts">
const menus = [
  {
    name: '学生',
    path: '/teacher'
  }
]
</script>
<template>
  <el-menu mode="horizontal" router>
    <template v-for="(menu, index) in menus" :key="index">
      <el-menu-item :index="menu.path">{{ menu.name }}</el-menu-item>
    </template>
  </el-menu>
</template>
