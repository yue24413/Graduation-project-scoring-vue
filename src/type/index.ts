export interface User {
  id?: string
  name?: string
  number?: string
  password?: string
  student?: string
  teacher?: string
  description?: string
  departmentId?: string
  role?: string
  groupNumber?: string
  insertTime?: string
  updateTime?: string
}
export interface ResultVO<T> {
  code: number
  message?: string
  data: T
}
