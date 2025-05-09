//import { ElNotification } from 'element-plus'
import { defineAsyncComponent, h, render } from 'vue'
// 创建函数式组件
export const createMessageDialog = (msg: string, close: Function = () => {}) => {
  const node = h(
    defineAsyncComponent(() => import('./ConfirmMessage.vue')),
    { message: msg, close }
  )
  render(node, document.body)
}
