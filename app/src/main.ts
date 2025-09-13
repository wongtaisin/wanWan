/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-11 16:36:48
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-11 17:13:10
 * @FilePath: \app\src\main.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import Vant from 'vant'
import 'vant/lib/index.css'
import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './store'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia).use(Vant)

  return { app }
}
