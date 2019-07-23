<template>
    <div class="orderDetail subs">
        <van-loading class="init_center" v-if="loading"/>
        <!-- <van-nav-bar
            title="订单详情"
            left-arrow
            @click-left="onClickLeft"
            /> -->
        <div class="main_detail" v-if="orderDetail">
            <van-row type="flex">
                <van-col span="12">单号：{{orderDetail.orderId}}</van-col>
                <van-col span="12">单据状态：{{statusList[orderDetail.state]||'无'}}</van-col>
            </van-row>
            <van-row type="flex" v-if="orderDetail.orderMain">
                <van-col span="24">要货客户：{{orderDetail.orderMain.customerName}}</van-col>
            </van-row>
            <van-row type="flex"> 
                <van-col span="24">配送地址：{{orderDetail.storageAddr}}</van-col>
            </van-row>
            <van-row type="flex">
                <van-col span="24">结算客户：{{orderDetail.settleCustomerName||'无'}}</van-col>
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
            <van-row type="flex">
                <van-col span="24">发货仓库：{{orderDetail.storageName}}</van-col>
            </van-row>
        </div>
        <div>
            <div class="open_detail_box" v-for="(item,index) in orderDetail.orderDetails" :key="index">
                <van-row type="flex">
                    <van-col span="18">{{item.skuName}}</van-col>
                    <van-col span="6" class="text-end">价格:{{item.finalPrice}}</van-col>
                </van-row>
                <van-row type="flex">
                    <van-col span="12">{{orderDetail.storageName}}</van-col>
                    <van-col span="12" class="text-end">数量: x{{item.quantity}}</van-col>
                </van-row>
                <van-row type="flex">
                    <van-col span="24" class="text-end">扣率:{{item.discount}}%</van-col>
                </van-row>
            </div>
        </div>
        <div class="button_box" v-if="orderDetail.state=='040'||orderDetail.state=='070'||orderDetail.state=='090'
        ||orderDetail.state=='110'||orderDetail.state=='101'">
            <van-row type="flex">
                <van-col span="12">
                    <van-button type="danger" size="normal" @click="retry">订单重发</van-button>
                </van-col>
                <van-col span="12">
                    <van-button plain type="danger" size="normal" @click="cancel">订单作废</van-button>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
import { getSubsDetail, cancelOrder, retryOrder } from '@/api'
import { statusList, shipList, productList } from '~/utils/dataList'
import { Toast, Dialog } from 'vant'
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
            getSubsDetail(this,params).then(res=>{
                if(res.code=="0"){
                    let data = res.data.data;
                    this.orderDetail = data;
                }
                this.loading=false;
            })
        },
        openDetail(){
            this.open=!this.open;
        },
        retry(){
            Dialog.confirm({
                message: '确定要订单重发？'
            }).then(() => {
                retryOrder(this,this.orderDetail.orderId).then(res=>{
                    if(res.code=="0"){
                        if(res.data.code=='0000'){
                            Toast({
                                type:'success',
                                message: res.data.data,
                            })
                        }else{
                            Toast({
                                type:'fail',
                                message: res.data.data||res.data.message,
                            })  
                        }
                        this.initDetail()
                    }
                })
            }).catch(() => {});
        },
        cancel(){
            Dialog.confirm({
                message: '确定要作废订单？'
            }).then(() => {
                cancelOrder(this,this.orderDetail.orderId).then(res=>{
                    if(res.code=="0"){
                        if(res.data.code=='0000'){
                            Toast({
                                type:'success',
                                message: res.data.data,
                            })
                        }else{
                            Toast({
                                type:'fail',
                                message: res.data.data||res.data.message,
                            })  
                        }
                        this.initDetail()
                    }
                })
            }).catch(() => {});
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
.orderDetail.subs {
    font-size: 0.24rem;
    .van-row {
        line-height: 0.6rem;
    }
    .text-end {
        text-align: end;
    }
    .main_detail{
        padding: .2rem;
        border-bottom: 0.15rem solid #eee;
    }
    .open_detail_box {
        padding: .2rem;
        border-top: 0.01rem solid #eee;
        &:last-child {
            border-bottom: 0.01rem solid #eee;
        }
    }
    .button_box{
        .van-button{
            padding: 0 .8rem !important;
        }
        margin-top: .5rem;
        text-align: center;
    }
}
</style>
