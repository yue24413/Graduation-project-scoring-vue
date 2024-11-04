import type { Process } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'
// 直接创建全局状态实例
const ProcessesTypesStore = createGlobalState(() => {
  const Processes = ref<Process[]>()
  console.log('ProcessesTypesStore')
  return { Processes }
})

// 使用静态方法访问该实例
export const indexStores = {
  ProcessesTypesStore
}
