<template>
  <!-- <el-button plain @click="open">Notification with offset</el-button> -->
  <div></div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
const props = defineProps<{ msg1: string; msg2: string }>()
// const open = () => {
ElNotification.success({
  title: props.msg1,
  message: props.msg2,
  offset: 100
})
// }
</script>
