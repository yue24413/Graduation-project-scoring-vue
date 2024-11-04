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

const AddPorcessScoreStore = createGlobalState(() => {
  const PorcessScoreS = ref<ProcessScore[]>()
  return { PorcessScoreS }
})()

const ListProcessesProcessScoresStore = createGlobalState(() => {
  const processScoresMap = ref(new Map<string, ProcessScore[]>())
  // 添加或更新数据
  const setProcessResult = (pid: string, scores: ProcessScore[]) => {
    processScoresMap.value.set(pid, scores)
  }

  // 获取数据
  const getProcessResult = (pid: string): ProcessScore[] | undefined => {
    return processScoresMap.value.get(pid)
  }

  return {
    processScoresMap,
    setProcessResult,
    getProcessResult
  }
})()
export const teacherStores = {
  ListGroupStudentsStore,
  ListTutorStudentsStore,
  AddPorcessScoreStore,
  ListProcessesProcessScoresStore
}
