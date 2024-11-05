<script lang="ts" setup>
import router from '@/router'
import { CommonService } from '@/services'
import { ADMIN, STUDENT, TEACHER } from '@/services/Const'
import { useUserStore } from '@/stores/UserStore'
import { defineAsyncComponent, type Component } from 'vue'
const userS = useUserStore().userS.value
const role = CommonService.getRole()

let nemuComponent: Component
if (role == TEACHER) {
  nemuComponent = defineAsyncComponent(() => import('@/views/main/header/teacher/IndexView.vue'))
} else if (role == STUDENT) {
  nemuComponent = defineAsyncComponent(() => import('@/views/main/header/student/IndexView.vue'))
} else if (role == ADMIN) {
  nemuComponent = defineAsyncComponent(() => import('@/views/main/header/admin/IndexView.vue'))
}

const logoutF = () => {
  sessionStorage.clear()
  router.push('/login')
}
</script>
<template>
  <el-row class="my-row" style="padding: 3px" align="middle">
    <el-col :span="4"></el-col>

    <!-- 基于权限加载上功能栏 -->
    <el-col :span="14">
      <component :is="nemuComponent" />
    </el-col>
    <el-col :span="2"></el-col>
    <el-col :span="2">
      <el-icon id="logout" :size="30" color="blue" @click="logoutF">
        <el-icon><SwitchButton /></el-icon>
      </el-icon>
    </el-col>
    <el-col :span="2"></el-col>
  </el-row>
</template>
<style scoped>
#logout :hover {
  cursor: pointer;
}
</style>
