import { createMessageDialog } from '@/components/message/index'
import type { ResultVO } from '@/types'
import { createFetch } from '@vueuse/core'

// 用于存储每个请求的缓存信息
const cacheInfo = new Map<string, { etag: string | null; lastModified: string | null }>()
// 递归实现反序列化为JS对象
const parseObject = (data: any) => {
  let newValue = data

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Array) {
      value.forEach((d) => {
        parseObject(d)
      })
    }
    if (typeof value == 'object') {
      parseObject(value)
    }

    if (typeof value == 'string' && (value.includes('{"') || value.includes('['))) {
      try {
        newValue = JSON.parse(value)
        if (typeof newValue == 'object') {
          data[key] = parseObject(newValue)
        }
      } catch (error) {
        //
      }
    }
  }
  return newValue
}
export const useFetch = createFetch({
  baseUrl: '/api',
  options: {
    beforeFetch: ({ options }) => {
      //从sessionStorage中取值
      const token = sessionStorage.getItem('token')
      if (token) {
        options.headers = {
          ...options.headers,
          token: token,
          'Content-Type': 'application/json'
        }
      }
      return { options }
    },
    afterFetch: (ctx) => {
      //如果是blob类型的数据，直接返回，因为下载文件不需要处理（后端是MediaType.APPLICATION_OCTET_STREAM）
      if (ctx.response.headers.get('Content-Type')?.includes('application/octet-stream')) {
        console.log('blob data')
        return ctx
      }
      const data: ResultVO<{}> = ctx.data
      if (data.code != 200) {
        return Promise.reject(data.message)
      }
      // 调用 parseObject 函数对数据进行处理
      parseObject(data)
      return ctx
    },
    onFetchError: (ctx) => {
      console.log('error:{}', ctx)
      createMessageDialog(ctx.error)
      return Promise.reject(ctx.error)
    }
  }
})

// 默认execute()函数通过throwOnFailed属性阻止抛出异常
// 欲支持全局异常处理，必须结合immediate/throwOnFailed
export const useGet = async <T>(url: string) => {
  const resp = useFetch(url, { immediate: false }).get().json<ResultVO<T>>()
  await resp.execute(true)
  return resp.data.value?.data
}
//`immediate: false` 表示不立即执行请求
export const usePost = async <T>(url: string, data: unknown) => {
  const resp = useFetch(url, { immediate: false }).post(data).json<ResultVO<T>>()
  await resp.execute(true)
  return resp
}

export const usePut = async <T>(url: string) => {
  const resp = useFetch(url, { immediate: false }).put().json<ResultVO<T>>()
  await resp.execute(true)
  return resp.data.value?.data
}
export const usePatch = async <T>(url: string, data: unknown) => {
  const resp = useFetch(url, { immediate: false }).patch(data).json<ResultVO<T>>()
  await resp.execute(true)
  return resp.data.value?.data
}
export const useDelete = async <T>(url: string) => {
  const resp = useFetch(url, { immediate: false }).delete().json<ResultVO<T>>()
  await resp.execute(true)
  return resp.data.value?.data
}
