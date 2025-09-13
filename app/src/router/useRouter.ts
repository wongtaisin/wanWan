import type { Router } from 'uni-simple-router'
import { getCurrentInstance } from 'vue'

export function useRouter(): Router {
  const internalInstance = getCurrentInstance()
  if (!internalInstance) {
    throw new Error('必须在设置中调用 useRouter。')
  }
  return internalInstance.appContext.config.globalProperties.$Router as Router
}
