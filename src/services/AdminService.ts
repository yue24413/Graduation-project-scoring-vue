import { useDelete, useGet, usePost } from '@/fetch'
import { useDepartmentStore } from '@/stores/DepartmentStore'
import type { Department, User } from '@/types'
import type { Ref } from 'vue'
import { StoreCache } from './Decorators'

const ADMIN = 'admin'

const departmentStore = useDepartmentStore()

export class AdminService {
  static addTeachers = async (teachers: User[], depid: string) => {
    teachers.forEach((t) => {
      // @ts-ignore
      t.teacher = JSON.stringify(t.teacher)
    })
    await usePost(`${ADMIN}/teachers/${depid}`, teachers)
  }
  @StoreCache(departmentStore.departmentsS)
  static async listDepartmentsService() {
    const data = await useGet(`${ADMIN}/departments`)
    return data as unknown as Ref<Department[]>
  }

  //
  @StoreCache(departmentStore.departmentsS, true)
  static async addDepartmentService(name: string) {
    const data = await usePost<Department[]>(`${ADMIN}/departments`, {
      name
    })
    return data.data.value?.data as unknown as Ref<Department[]>
  }

  //
  @StoreCache(departmentStore.departmentsS, true)
  static async delDepartmentService(did: string) {
    const data = await useDelete<Department[]>(`${ADMIN}/departments/${did}`)
    return data as unknown as Ref<Department[]>
  }
}
