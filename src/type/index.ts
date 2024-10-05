export interface User {
  id?: string
  role?: string
  account?: string
  password?: string
  name?: string
  address?: string
  insertTime?: string
}
export interface ResultVO<T> {
  code: number
  message?: string
  data: T
}
