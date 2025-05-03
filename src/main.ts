import { createMessageDialog } from '@/components/message/index'

import { createApp } from 'vue' /*从Vue库中导入了createApp */
import App from './App.vue'
import router from './router'
//import.meta.env.DEV && (await import('@/mock/index'))
//import('@/mock/index')
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
const app = createApp(App)
// app.use(ElementPlus)
app.use(router) /**将前面导入的路由实例注入到Vue应用中 */
app.mount('#app') /**挂载之后，Vue应用就开始控制这个DOM元素， */

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
// 全局未捕获异常处理
// 统一弹出错误信息模态框
app.config.errorHandler = (err) => {
  console.log(err)
  const message = err as string
  createMessageDialog(message)
}
