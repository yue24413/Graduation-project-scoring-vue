import type { Process } from '@/types'
import { defineAsyncComponent, h, render } from 'vue'
export const createEditProcessDialog = (process: Process, totalScore: number) => {
  const node = h(
    defineAsyncComponent(() => import('./EditProcessVue.vue')),
    { process, totalScore }
  )
  render(node, document.body)
}
