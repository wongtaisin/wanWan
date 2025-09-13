<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="btn-group">
      <van-button type="primary" @click="goToDetail">跳转到详情页</van-button>
      <van-button type="default" @click="goToDetailByRouter">通过路由跳转到详情页</van-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useRouter } from '@/router/useRouter'
import { ref } from 'vue'

const title = ref('Hello world')

const router = useRouter()

const goToDetail = () => {
  uni.navigateTo({
    url: '/pages/detail/index'
  })
}

const goToDetailByRouter = () => {
  try {
    // 检查路由是否可用
    if (router && typeof router.push === 'function') {
      router.push({ name: 'detail' })
    } else {
      throw new Error('路由不可用')
    }
  } catch (error) {
    console.error('路由跳转失败:', error)
    // 降级到原生导航
    uni.navigateTo({
      url: '/pages/detail/index'
    })
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.btn-group {
  margin-top: 50rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 80%;
}
</style>
