import type { Ref } from 'vue'
/**
 *基本装饰器无法满足，用高阶装饰器，返回装饰器函数的函数
 */
export function StoreCache(dataR: Ref<any>, replace = false) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      const val = dataR.value
      if (
        !replace &&
        (Object.prototype.toString.call(val) === '[object Array]' ||
          Object.prototype.toString.call(val) === '[object Object]')
      ) {
        return Promise.resolve(dataR)
      }
      const r = await originalMethod.apply(descriptor, args)
      return (dataR.value = r) && dataR
    }
    return descriptor
  }
}
