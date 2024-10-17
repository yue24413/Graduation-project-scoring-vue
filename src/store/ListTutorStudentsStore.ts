import type { ResultVO, User } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const ListTutorStudentsStore = createGlobalState(() => {
  const studentsS = ref<ResultVO<User[]>>()
  return { studentsS }
})
