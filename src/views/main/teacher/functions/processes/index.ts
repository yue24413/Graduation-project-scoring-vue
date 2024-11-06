import type { Process } from '@/types'
import { defineAsyncComponent, h, render } from 'vue'
export const createEditProcessDialog = (process: Process) => {
  const node = h(
    defineAsyncComponent(() => import('./EditProcessVue.vue')),
    { process }
  )
  render(node, document.body)
}
