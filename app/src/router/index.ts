import { createRouter } from 'uni-simple-router'
import routes from './routes'

const router = createRouter({
  platform: 'h5', // 平台手动控制，保证兼容
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('跳转前：', to, from)
  if (to.name === 'detail' && !uni.getStorageSync('token')) {
    next({ name: 'index' })
  } else {
    next()
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  console.log('跳转后：', to, from)
})

export default router
