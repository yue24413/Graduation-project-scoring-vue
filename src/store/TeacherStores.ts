import type { ProcessScore, User } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { shallowRef } from 'vue'

const ListGroupStudentsStore = createGlobalState(() => {
  const studentsS = shallowRef<User[]>()
  console.log(studentsS)
  return { studentsS }
})()

const ListTutorStudentsStore = createGlobalState(() => {
  const studentsS = shallowRef<User[]>()
  console.log(studentsS)
  return { studentsS }
})()
const ListProcessesProcessScoresStore = createGlobalState(() => {
  const processScoresMap = shallowRef<Map<string, ProcessScore[]>>(new Map())
  // console.log(processScoresMap)

  return { processScoresMap }
})()
export const teacherStores = {
  ListGroupStudentsStore,
  ListTutorStudentsStore,
  ListProcessesProcessScoresStore
}
