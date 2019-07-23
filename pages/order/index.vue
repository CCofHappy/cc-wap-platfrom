<template>
    <div class="orderDetail">
        <van-loading class="init_center" v-if="loading"/>
        <!-- <van-nav-bar
            title="订单详情"
            left-arrow
            @click-left="onClickLeft"
            /> -->
        <div class="main_detail" v-if="orderDetail">
            <van-row type="flex">
                <van-col span="12">主单号：{{orderDetail.orderId}}</van-col>
                <van-col span="12">单据状态：{{statusList[orderDetail.state]||'无'}}</van-col>
            </van-row>
            <van-row type="flex">
                <van-col span="24">要货客户：{{orderDetail.customerName}}</van-col>
            </van-row>
            <van-row type="flex"> 
                <van-col span="24">配送地址：{{orderDetail.deliveryAddress}}</van-col>
            </van-row>
            <van-row type="flex">
                <van-col span="24">结算客户：{{orderDetail.settleCustomerName}}</van-col>
            </van-row>
            <van-row type="flex">
                <van-col span="12">配送方式：{{shipList[orderDetail.shipType]||'无'}}</van-col>
                <van-col span="12">开单日期：{{orderDetail.orderTime}}</van-col>
            </van-row>
            <van-row type="flex">
                <van-col span="8">总数量：{{orderDetail.commodityQuantity}}</van-col>
                <van-col span="8">体积：{{orderDetail.totalVolume||0}}</van-col>
                <van-col span="8">金额：{{orderDetail.payMoney}}</van-col>
            </van-row>
        </div>
        <div class="c_detail" @click="openDetail" v-for="(item, index) in orderDetail.orderSubs" :key="index">
            <van-row type="flex">
                <van-col span="12">子单号:{{item.orderId}}</van-col>
                <van-col span="12" class="text-end">产品线: {{productList[item.productFamilyId]||'未知'}}</van-col>
            </van-row>
            <van-row type="flex">
                <van-col span="12">数量: {{item.commodityQuantity}}</van-col>
                <van-col span="12" class="text-end">金额: {{item.payMoney}}</van-col>
            </van-row>
            <van-row type="flex">
                <van-col span="12">发货仓库 : {{item.storageName}}</van-col>
                <van-col span="12" class="text-end">订单状态 : {{statusList[item.state]}}</van-col>
            </van-row>
            <div class="down_box"><van-icon name="arrow-down" /></div>
            <div class="open_detail" v-show="open">
                <div class="open_detail_box" v-for="(item2,index2) in item.orderDetails" :key="index2">
                    <van-row type="flex">
                        <van-col span="18">{{item2.skuName}}</van-col>
                        <van-col span="6" class="text-end">价格:{{item2.finalPrice}}</van-col>
                    </van-row>
                    <van-row type="flex">
                        <van-col span="12">{{item.storageName}}</van-col>
                        <van-col span="12" class="text-end">数量: x{{item2.quantity}}</van-col>
                    </van-row>
                    <van-row type="flex">
                        <van-col span="24" class="text-end">扣率:{{item2.discount}}%</van-col>
                    </van-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getMainDetail } from '@/api'
import { statusList, shipList, productList } from '~/utils/dataList'
export default {
    data() {
        return {
            open:false,
            orderDetail:{},
            loading:false,
            statusList:statusList,
            shipList:shipList,
            productList:productList,
        }
    },
    validate({ params }) {
        // Must be a number
        return /^[A-Za-z\d]+$/.test(params.id)
    },
    computed:{
        orderId(){
            return this.$route.query.orderId
        },
        uuid(){
            return this.$route.query.uuid
        }
    },
    mounted() {
        // eslint-disable-next-line no-console
        this.initDetail()
    },
    methods: {
        // onClickLeft(){
        //     this.$router.back(-1)   
        // }
        initDetail(){
            this.loading=true;
            let params={
                uuid: this.uuid,
                orderId: this.orderId
            }
            getMainDetail(this,params).then(res=>{
                if(res.code=="0"){
                    let data = res.data.data;
                    data.deliveryAddress =  data.orderAddress.province+
                                            data.orderAddress.city+
                                            data.orderAddress.region+
                                            data.orderAddress.address;
                    this.orderDetail = data;
                }
                this.loading=false;
            })
        },
        openDetail(){
            this.open=!this.open;
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
.orderDetail {
  font-size: 0.24rem;
  .van-row {
    line-height: 0.6rem;
  }
  .text-end {
    text-align: end;
  }
  .main_detail,
  .c_detail {
    padding: .2rem;
    border-bottom: 0.15rem solid #eee;
  }
  .down_box {
    text-align: center;
  }
  .open_detail_box {
    border-top: 0.01rem solid #eee;
    &:last-child {
      border-bottom: 0.01rem solid #eee;
    }
  }
}
</style>
