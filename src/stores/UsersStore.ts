import type { User } from '@/types'
import { shallowRef } from 'vue'
const allStudentsS = shallowRef<User[]>()
const allTeachersS = shallowRef<User[]>()
const clear = () => {
  allStudentsS.value = undefined
  allTeachersS.value = undefined
}
const store = { allStudentsS, allTeachersS, clear }
export const useUsersStore = () => store
