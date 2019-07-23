<template>
  <div class="error">
    <img src="@/assets/image/404.png" alt="" />
    <h1 v-if="error.statusCode === 404">页面不存在</h1>
    <h1 v-else>应用发生错误异常</h1>
    <p class="error__code">
      错误码{{ error.statusCode }},{{ error.message||'请稍后刷新重试,若仍有问题,请退出重试'}}
    </p>
    <nuxt-link to="/">
      <van-button type="info" size="small">刷新</van-button>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line
  props: ['error'],
  layout: 'empty'
}
</script>
<style lang="less">
.error {
  padding-top: 300px;
  text-align: center;
  img {
    width: 320px;
    height: 320px;
  }
  h1 {
    font-size: 35px;
  }
  p {
    font-size: 25px;
    color: gray;
  }
  .error__code {
    padding: 35px 200px;
  }
}
</style>
