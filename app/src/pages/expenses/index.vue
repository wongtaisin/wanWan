<template>
  <view class="content">
    <van-grid>
      <van-grid-item text="吃">
        <template #icon>
          <van-icon name="food" />
        </template>
      </van-grid-item>
      <van-grid-item text="喝">
        <template #icon>
          <van-icon name="drink" />
        </template>
      </van-grid-item>
      <van-grid-item text="玩">
        <template #icon>
          <van-icon name="play-circle-o" />
        </template>
      </van-grid-item>
      <van-grid-item text="乐">
        <template #icon>
          <van-icon name="smile-o" />
        </template>
      </van-grid-item>
      <van-grid-item text="过路费">
        <template #icon>
          <van-icon name="road" />
        </template>
      </van-grid-item>
      <van-grid-item text="车油">
        <template #icon>
          <van-icon name="gas" />
        </template>
      </van-grid-item>
      <van-grid-item text="停车">
        <template #icon>
          <van-icon name="parking" />
        </template>
      </van-grid-item>
      <van-grid-item text="交通">
        <template #icon>
          <van-icon name="transport" />
        </template>
      </van-grid-item>
      <van-grid-item text="超市">
        <template #icon>
          <van-icon name="shop-o" />
        </template>
      </van-grid-item>
      <van-grid-item text="网购">
        <template #icon>
          <van-icon name="shopping-cart-o" />
        </template>
      </van-grid-item>
      <van-grid-item text="话费">
        <template #icon>
          <van-icon name="phone-o" />
        </template>
      </van-grid-item>
      <van-grid-item text="红包">
        <template #icon>
          <van-icon name="gift-o" />
        </template>
      </van-grid-item>
    </van-grid>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Hello world')
</script>

<style lang="scss">
.content {
  width: 100%;
  height: 100vh;
  background: #f0f2f5;
}

.van-icon {
  font-size: 28px;
  margin-bottom: 5px;
}
</style>
