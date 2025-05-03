import { createElLoading } from '@/components/loading/index'
import type { Ref } from 'vue'
import { ref } from 'vue'
/**
 *基本装饰器无法满足，用高阶装饰器，返回装饰器函数的函数
装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。
  1. 应用于类构造函数 参数：类的构造函数
  2. 应用于方法描述符 参数：类原型、方法名、属性描述符

  参数装饰器 → 方法/访问器/属性装饰器 → 类装饰器
  同类装饰器从下到上执行
  同方法装饰器从上到下执行

  装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。
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
