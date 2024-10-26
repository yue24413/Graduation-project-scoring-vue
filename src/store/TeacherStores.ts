import type { ProcessResult, ProcessScore, ResultVO, User } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

const ListGroupStudentsStore = createGlobalState(() => {
  const studentsS = ref<ResultVO<User[]>>()
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

// const ListProcessesProcessScoresStore = createGlobalState(() => {
//   const ProcessesProcessScores = ref<ResultVO<ProcessScore>[]>([])
//   console.log('ListProcessesProcessScoresStore')
//   return { ProcessesProcessScores }
// })()

const ListProcessesProcessScoresStore = createGlobalState(() => {
  const processesResultVO = ref<ProcessResult<ProcessScore[]>[]>([])

  // 添加新数据
  const addProcessResult = (newProcessResult: ProcessResult<ProcessScore[]>) => {
    processesResultVO.value.push(newProcessResult)
  }
  const getProcessResult = (processId: string): ResultVO<ProcessScore[]> | undefined => {
    const processResult = processesResultVO.value.find((p) => p.processId === processId)
    console.log('store :getProcessResult')
    return processResult ? processResult.result : undefined
  }

  return {
    processesResultVO,
    addProcessResult,
    getProcessResult
  }
})()
export const teacherStores = {
  ListGroupStudentsStore,
  ListTutorStudentsStore,
  AddPorcessScoreStore,
  ListProcessesProcessScoresStore
}
