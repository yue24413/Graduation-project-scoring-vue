import { createMessageDialog } from '@/components/message/index'
import { createApp } from 'vue' /*从Vue库中导入了createApp */
import App from './App.vue' /* ./ 当前位置*/ /*导入了名为App.vue的组件文件，这是Vue应用的根组件 */
import router from './router'
//import.meta.env.DEV && (await import('@/mock/index'))
//import('@/mock/index')
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App) /*初始化 */
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
app.use(ElementPlus)
app.use(router) /**将前面导入的路由实例注入到Vue应用中 */
app.mount('#app') /**挂载之后，Vue应用就开始控制这个DOM元素， */

// 全局未捕获异常处理
// 统一弹出错误信息模态框
app.config.errorHandler = (err) => {
  console.log(err)
  const message = err as string

  createMessageDialog(message)
}
