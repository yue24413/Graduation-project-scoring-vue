import type { ProcessScore, ResultVO, User } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

const ListGroupStudentsStore = createGlobalState(() => {
  const studentsS = ref<ResultVO<User[]>>()
  console.log('ListGroupStudentsStore')
  return { studentsS }
})()

const ListTutorStudentsStore = createGlobalState(() => {
  const studentsS = ref<ResultVO<User[]>>()
  return { studentsS }
})()

const AddPorcessScoreStore = createGlobalState(() => {
  const PorcessScoreS = ref<ResultVO<ProcessScore[]>>()
  return { PorcessScoreS }
})()

const ListProcessesProcessScoresStore = createGlobalState(() => {
  const processScoresMap = ref(new Map<string, ResultVO<ProcessScore[]>>())
  // 添加或更新数据
  const setProcessResult = (pid: string, scores: ResultVO<ProcessScore[]>) => {
    processScoresMap.value.set(pid, scores)
  }

  // 获取数据
  const getProcessResult = (pid: string): ResultVO<ProcessScore[]> | undefined => {
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
