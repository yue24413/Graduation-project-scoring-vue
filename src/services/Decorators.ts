import { createElLoading } from '@/components/loading/index'
import type { Ref } from 'vue'
import { ref } from 'vue'
/**
 *基本装饰器无法满足，用高阶装饰器，返回装饰器函数的函数

Object.prototype.toString不是用于元素拼接等功能，它是专门用于从更高层次上描述对象的类型，不受对象自身可能重定义的toString方法的影响。

 typeof []返回object，不能很好地区分数组和普通对象，而Object.prototype.toString.call可以准确地分辨出数组和普通对象

 如果直接调用val.toString()，若val是一个自定义对象，它可能已经重定义了自己的toString方法，就无法得到用于判断对象类型的字符串。
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
/**
 *
 * @param dataR 封装Map类型的响应式对象
 * @param indexs 用于拼接Map键的方法参数索引位置。默认按方法参数顺序拼接键
 * @returns Map中proxy类型元素
 */
export function StoreMapCache(dataR: Ref<Map<any, any>>, indexs?: number[]) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      const val = dataR.value
      //修饰方法的参数或者部分参数的index，作为键
      let mapKey = args.join('-')
      if (indexs) {
        const temp = []
        for (const index of indexs) {
          //参数值重新压入新数组
          temp.push(args[index])
        }
        mapKey = temp.join('-')
      }
      const mapValue = val.get(mapKey)
      if (Object.prototype.toString.call(val) === '[object Map]' && mapValue) {
        // console.log('map-descriptor-store-get')
        return Promise.resolve(mapValue)
      }
      // console.log('map-descriptor-useGet-get')
      const r = await originalMethod.apply(descriptor, args)
      const refR = ref(r) // 将结果转换为 Ref
      val.set(mapKey, refR)
      return val.get(mapKey)
    }
    return descriptor
  }
}

export function StoreClear(...clears: Function[]) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = (...args: any[]) => {
      for (const clear of clears) {
        clear()
      }
      return originalMethod.apply(descriptor, args)
    }
    return descriptor
  }
}

export function ELLoading() {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      let r
      const loading = createElLoading()
      try {
        r = await originalMethod.apply(descriptor, args)
      } finally {
        loading.close()
      }
      return r
    }
    return descriptor
  }
}
