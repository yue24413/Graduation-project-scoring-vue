<script setup lang="ts">
import { readStudentForSelectionFile } from '@/services/ExcelUtils'
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types'
import { ref } from 'vue'

const allStudentsR = ref<User[]>([])
/**
 * input.files属性返回一个FileList对象。FileList中的每个元素（即每个被选中的文件）实际上是一个File对象。
 *
 */
const filesChange = (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readStudentForSelectionFile(element.files![0]).then((students) => {
    allStudentsR.value = students
  })

  element.value = ''
}
const submitF = async () => {
  await TeacherService.addStudentsService(allStudentsR.value)
}
</script>

<template>
  <div>
    <el-row>
      <el-col>
        读取学生表格：
        <br />
        <input type="file" @change="filesChange" />
        <br />
        <br />
        <el-button type="success" @click="submitF" v-if="allStudentsR">导入</el-button>
      </el-col>
    </el-row>
  </div>
</template>
