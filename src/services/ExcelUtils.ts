import type { User } from '@/types'
import * as XLSX from 'xlsx'
// 读取带成绩排名的学生表格
export function readStudentForSelectionFile(file: Blob) {
  return new Promise<User[]>((resolve) => {
    const reader = new FileReader()
    const students: User[] = []
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result
      const wb = XLSX.read(data, { type: 'binary' })
      console.log(wb.Sheets)
      const sheet = wb.Sheets[wb.SheetNames[0]]
      console.log(sheet)

      XLSX.utils.sheet_to_json(sheet).forEach((r: any) => {
        students.push({ name: r['姓名'], number: r['账号'].toString() })
      })
    }
    reader.onloadend = () => {
      resolve(students)
    }
    reader.readAsArrayBuffer(file)
  })
}
