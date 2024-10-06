<script setup lang="ts">
const menus = [
  {
    name: '导航1',
    path: '/nav1'
  },
  {
    name: '导航2',
    path: '/nav2'
  },
  {
    name: '导航3',
    path: '/nav3'
  },
  {
    name: '导航4',
    path: '/nav4'
  },
  {
    name: '导航5',
    path: '/nav5'
  }
]
</script>
<template>
  <template v-for="(menu, index) in menus" :key="index">
    <el-menu-item :index="menu.path">{{ menu.name }}</el-menu-item>
  </template>
</template>
