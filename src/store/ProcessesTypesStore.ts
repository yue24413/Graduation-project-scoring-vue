import type { Process, ResultVO } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const ProcessesTypesStore = createGlobalState(() => {
  const Processes = ref<ResultVO<Process[]>>()
  return { Processes }
})
