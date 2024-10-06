<script setup lang="ts">
const menus = [
  {
    name: '功能',
    path: '/admin'
  }
]
</script>
<template>
  <template v-for="(menu, index) in menus" :key="index">
    <el-menu-item :index="menu.path">{{ menu.name }}</el-menu-item>
  </template>
</template>
