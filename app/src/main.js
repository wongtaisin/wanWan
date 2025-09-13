/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-11 16:36:48
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-11 17:13:10
 * @FilePath: \app\src\main.ts
 * @Description: 这个配置要研究一下
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'

const app = createApp(App)

app.use(pinia)

// #ifdef H5
// 在H5环境下使用 Vant，app和小程序会在 pages.json 配置 @vant/weapp，用法一样
import Vant from 'vant'
import 'vant/lib/index.css'
app.use(Vant)
// #endif

// #ifdef H5
// 在H5环境下使用RouterMount
import { router, RouterMount } from './router'
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
// 在非H5环境下直接挂载
app.mount('#app')
// #endif
