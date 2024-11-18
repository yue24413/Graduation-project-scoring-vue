<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'

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
    name: '分配',
    component: defineAsyncComponent(() => import('./AssignStudentView.vue'))
  },
  {
    name: '分组',
    component: defineAsyncComponent(() => import('./GroupingView.vue'))
  },
  {
    name: 'test1',
    component: defineAsyncComponent(() => import('./test1.vue'))
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
