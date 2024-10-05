import { defineAsyncComponent, h, render } from 'vue'

// 基于函数动态创建组件，并挂载到节点
// 可声明close回调函数为可选参数，或默认值
export const createNoticeBoard = (msg1: string, msg2: string) => {
  const notice = defineAsyncComponent(() => import('./OKNoticeBoard.vue'))
  const vnode = h(notice, { msg1, msg2 })
  render(vnode, document.body)
}
