<template>
  <div class="goods">
    <van-search
        v-model="address"
        placeholder="请输入明细地址"
        show-action
        shape="round"
        label="明细地址"
        @search="cusAddress"
    >
        <div slot="action" @click="cusAddress()">
        搜索
        </div>
    </van-search>

    <van-cell-group>
      <van-cell
          v-for="(item, index) in addressList"
          :key="index"
          :title="item.provinceName+item.cityName+item.districtName+item.detailAddress"
          is-link
          @click="goCheckout(item)"
      />
      <van-cell>
        <van-button size="large" type="danger" @click="$router.go(-1)" v-if="addressList.length">回到上一页</van-button>
      </van-cell>

    </van-cell-group>

    

  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { mapMutations } from 'vuex'
import { cusAddress} from '@/api/buy'

export default {
  head() {
    return {
      title: '我的要货'
    }
  },
  data() {
    return {
      addressList: [],//地址列表
      address: '',//明细地址输入框
    }
  },
  mounted() {
      this.cusAddress()
  },
  methods: {
    ...mapMutations([
      'SET_ORDER'
    ]),
    goCheckout (item) {
      let order = this.$store.getters.getOrder
      
      order.address = item;
      this.SET_ORDER(order)
      this.$router.push({path:`/goods/checkout`})
    },
    cusAddress(){//客户中心-查询配送地址
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        ;
        let params = {
          address: this.address,
          id: this.$route.query.id,
          current: 1,
          size: 10,
        }
        cusAddress(this,params).then(res=>{
            if(res.code==0){
              this.addressList = res.data.records;
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },

    
  }
}
</script>

<style lang="less" rel="stylesheet/less"></style>
