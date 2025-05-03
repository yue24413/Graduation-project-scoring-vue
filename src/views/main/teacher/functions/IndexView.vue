<script setup lang="ts">
import { computed, defineAsyncComponent, ref, type Component } from 'vue'

const components: { name: string; component: Component }[] = [
  {
    name: '过程管理',
    component: defineAsyncComponent(() => import('./ProcessView.vue'))
  },
  {
    name: '导入学生',
    component: defineAsyncComponent(() => import('./ImportStudentView.vue'))
  },
  {
    name: '分配导师',
    component: defineAsyncComponent(() => import('./AssignStudentView.vue'))
  },
  {
    name: '导入题目',
    component: defineAsyncComponent(() => import('./ImportStudentsInfoView.vue'))
  },
  {
    name: '分组乱序',
    component: defineAsyncComponent(() => import('./GroupingView.vue'))
  },
  {
    name: '重置密码',
    component: defineAsyncComponent(() => import('./ResetPasswordView.vue'))
  },
  {
    name: '更新用户信息',
    component: defineAsyncComponent(() => import('./EditUserView.vue'))
  },
  {
    name: '导出详细成绩表格',
    component: defineAsyncComponent(() => import('./ExportScoresView.vue'))
  }
]

const currentComponentR = ref()
const currentComponentC = computed(
  () => components.find((com) => com.name == currentComponentR.value)?.component
)
const typeC = computed(
  () => (name: string) => (name == currentComponentR.value ? 'danger' : 'primary')
)
</script>
<template>
  <el-row class="my-row">
    <el-col :span="1"></el-col>
    <el-col :span="1">
      <el-tag
        class="my-tag"
        v-for="(com, index) of components"
        :key="index"
        :type="typeC(com.name)"
        @click="currentComponentR = com.name"
        style="cursor: pointer; margin-right: 10px"
        size="large">
        {{ com.name }}
      </el-tag>
    </el-col>
    <el-col :span="2"></el-col>
    <el-col :span="19">
      <template v-if="currentComponentR">
        <component :is="currentComponentC" />
      </template>
    </el-col>
  </el-row>
</template>
<style scoped>
.my-tag {
  --el-tag-bg-color: none;
  margin-bottom: 10px;
}
</style>
