<script setup lang="ts">
const menus = [
  {
    name: '导师',
    path: '/student'
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
