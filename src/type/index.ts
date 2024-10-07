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

export interface Process {
  id?: string
  name?: string
  auth?: string
  point?: number
  items?: ProcessItem[]
  departmentId?: string
}
export interface ProcessItem {
  number?: number
  name?: string
  point?: number
  description?: string
}
export interface ResultVO<T> {
  code: number
  message?: string
  data: T
}
