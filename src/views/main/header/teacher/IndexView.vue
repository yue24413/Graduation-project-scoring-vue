<script setup lang="ts">
import { CommonService } from '@/services'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const menus = ref<{ name: string; path: string }[]>([])

const processesS = await CommonService.listProcessesService()
watch(
  processesS,
  () => {
    menus.value.length = 0
    menus.value.push({
      name: '学生',
      path: '/teacher'
    })
    processesS.value.forEach((ps) => {
      menus.value.push({ name: ps.name!, path: `/teacher/processes/${ps.id}/types/${ps.auth}` })
    })
  },
  { immediate: true }
)

const route = useRoute()
const activeIndexR = ref('')
watch(
  route,
  () => {
    const p = menus.value.find((mn) => mn.path == route.path)
    activeIndexR.value = p?.path ?? ''
  },
  { immediate: true }
)
</script>
<template>
  <el-menu :default-active="activeIndexR" mode="horizontal" router class="my-menu">
    <template v-for="(menu, index) in menus" :key="index">
      <el-menu-item :index="menu.path">
        {{ menu.name }}
      </el-menu-item>
    </template>
    <el-menu-item index="/teacher/scores">小组成绩统计</el-menu-item>
    <el-menu-item index="/teacher/functions" style="color: #f99909">功能</el-menu-item>
  </el-menu>
</template>
<style scoped>
.my-menu {
  border-bottom: none;
}
</style>
