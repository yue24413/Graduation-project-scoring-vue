import type { Process, ResultVO } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

// export class indexStores {

//   static ProcessesTypesStore = createGlobalState(() => {
//     const Processes = ref<ResultVO<Process[]>>()
//     return { Processes }
//   })
// }
// 直接创建全局状态实例
const ProcessesTypesStore = createGlobalState(() => {
  const Processes = ref<ResultVO<Process[]>>()
  console.log('ProcessesTypesStore')
  return { Processes }
})

// 使用静态方法访问该实例
export const indexStores = {
  ProcessesTypesStore
}
