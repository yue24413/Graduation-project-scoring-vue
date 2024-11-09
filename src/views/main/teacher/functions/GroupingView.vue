<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: number
  text: string
  done: boolean
}

const initialTasks = ref<Task[]>([
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false }
])

const inputTask = ref<{ id: number; text: string; done: boolean }>({
  id: -1,
  text: '',
  done: false
})
// 正在编辑的任务id的集合
const editingTasks = ref<Set<number>>(new Set())
const findMaxId = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return -1
  }
  return tasks.reduce((maxId, currentTask) => {
    return currentTask.id > maxId ? currentTask.id : maxId
  }, tasks[0].id)
}
const addTaskF = () => {
  const newId = initialTasks.value.length > 0 ? findMaxId(initialTasks.value) + 1 : 0
  initialTasks.value.push({ ...inputTask.value, id: newId, done: false })
  inputTask.value = { id: -1, text: '', done: false }
  console.log(initialTasks.value)
}

const editTaskF = (task: Task) => {
  editingTasks.value.add(task.id)
}
const saveTaskF = (task: Task) => {
  const existingTask = initialTasks.value.find((t) => t.id === task.id)
  if (existingTask) {
    existingTask.text = task.text
    editingTasks.value.delete(task.id)
    if (editingTasks.value.size === 0) {
      inputTask.value = { id: -1, text: '', done: false }
    }
  }
}

const delTaskF = (index: number) => {
  initialTasks.value = initialTasks.value.splice(index, 1)
  console.log(initialTasks.value)
}
</script>

<template>
  <div>
    <h1>Day off in Kyoto</h1>
    <el-row>
      <el-col>
        <input placeholder="Add task" v-model="inputTask.text" />
        <el-button @click="addTaskF">Add</el-button>
        <br />
        <template v-for="(task, index) of initialTasks" :key="index">
          <div v-if="editingTasks.has(task.id)">
            <input type="checkbox" v-model="task.done" />
            <input v-model="task.text" />
            <el-button @click="saveTaskF(task)">Save</el-button>
            <el-button @click="delTaskF(index)">Delete</el-button>
          </div>
          <div v-else>
            <input type="checkbox" v-model="task.done" />
            {{ task.text }}
            <el-button @click="editTaskF(task)">Edit</el-button>
            <el-button @click="delTaskF(index)">Delete</el-button>
          </div>
          <br />
        </template>
      </el-col>
    </el-row>
  </div>
</template>
