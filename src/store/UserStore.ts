import type { User } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useUserStore = createGlobalState(() => {
  const userS = ref<User>({})
  return { userS }
})
