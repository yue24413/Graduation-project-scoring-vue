import type { User } from '@/type'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const ListGroupStudentsStore = createGlobalState(() => {
  const studentsS = ref<User[]>([])
  return { studentsS }
})
