import type { ProcessScore, User } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

const ListGroupStudentsStore = createGlobalState(() => {
  const studentsS = ref<User[]>()
  console.log('ListGroupStudentsStore')
  return { studentsS }
})()

const ListTutorStudentsStore = createGlobalState(() => {
  const studentsS = ref<User[]>()
  return { studentsS }
})()
const ListProcessesProcessScoresStore = createGlobalState(() => {
  const processScoresMap = ref<Map<string, ProcessScore[]>>(new Map())
  return { processScoresMap }
})()
export const teacherStores = {
  ListGroupStudentsStore,
  ListTutorStudentsStore,
  ListProcessesProcessScoresStore
}
