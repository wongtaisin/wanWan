/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-11 16:49:01
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-11 17:16:24
 * @FilePath: \wanWan\app\src\store\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export default store
