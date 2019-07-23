<template>
  <div class="navbar">
    <div class="van-hairline--top-bottom van-tabbar van-tabbar--fixed" style="z-index: 100;">
      <div class="van-tabbar-item" v-for="(item, index) in tabBar"
            :class="[{'van-tabbar-item--active': item.to.path === $route.path }]"
            :key="index" @click="changeBar(item.to)">
          <div class="van-tabbar-item__icon">
              <i :class="[item.icon ?'van-icon van-icon-'+item.icon : 'van-icon van-icon-orders-o']"></i>
          </div>
          <div class="van-tabbar-item__text">
              {{item.title}}
          </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isSalesman: false,
      tabBar: [
        {
          title: '我的订单',
          value: 'order',
          icon: 'orders-o',
          to: { path: '/',index: '0' }
        },
        {
          title: '我的要货',
          value: 'goods',
          icon: 'shopping-cart-o',
          to: { path: '/goods', index: '1' }
        },
        {
          title: '我的库存',
          value: 'stock',
          icon: 'shop-o',
          to: { path: '/stock', index: '2' }
        }
      ]
    }
  },
  methods: {
    // Cookies.set('userOA',"wangyalin")
    changeBar(to) {
      this.$router.push({
        path: to.path
      })
    },
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.navbar {
  .van-tabbar {
    height: 96px;
    box-shadow: 1px 0 1px #d2d2d2;
  }
}
</style>
