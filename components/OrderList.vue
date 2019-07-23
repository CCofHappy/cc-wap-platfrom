<template>
  <div class="orderlist">
    <van-pull-refresh v-model="isloading" @refresh="onRefresh" :disabled="list&&list.length==0">
        <van-list
            v-if="value=='all'||value=='toSendGoods'||value=='done'"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-panel
                v-for="(item, index) in list"
                :key="index"
                :title="item.orderId"
                :status="statusList[item.state]"
                @click="handleClick(item,1)">
                <van-row type="flex" class="van-cell" justify="space-between">
                <van-col span="14">{{ item.customerName }}</van-col>
                <van-col span="10">{{ item.orderTime }}</van-col>
                </van-row>
                <van-row type="flex" class="van-cell" justify="space-between">
                <van-col span="12">要货数量: {{ item.commodityQuantity }}</van-col>
                <van-col span="12">金额：{{ item.payMoney }}</van-col>
                </van-row>
                <van-row type="flex" class="van-cell" justify="space-between">
                <van-col span="12">体积：{{ item.totalVolume||0 }}</van-col>
                <van-col span="12">配送方式：{{shipList[item.shipType]||'无'}}</van-col>
                </van-row>
            </van-panel>
        </van-list>
        <van-list
            v-else-if="value=='abnormal'"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <div v-for="(item, index) in list" class="c_detail" :key="index" @click="handleClick(item,2)">
                <van-row type="flex">
                    <van-col span="24">要货客户:{{item.orderMain.customerName}}</van-col>
                </van-row>
                <van-row type="flex">
                    <van-col span="12">子单号:{{item.orderId}}</van-col>
                    <van-col span="12" class="text-end">产品线: {{productList[item.productFamilyId]||'未知'}}</van-col>
                </van-row>
                <van-row type="flex">
                    <van-col span="24">发货仓库 : {{item.storageName||'无'}}</van-col>
                </van-row>
            </div>
        </van-list>
        <van-list
            v-else
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <div v-for="(item, index) in list" class="c_detail" :key="index" @click="handleClick(item,2)">
                <van-row type="flex">
                    <van-col span="24">要货客户:{{item.orderMain.customerName}}</van-col>
                </van-row>
                <van-row type="flex">
                    <van-col span="12">子单号:{{item.orderId}}</van-col>
                    <van-col span="12" class="text-end">产品线: {{productList[item.productFamilyId]||'未知'}}</van-col>
                </van-row>
                <van-row type="flex">
                    <van-col span="8">冲红数量:{{item.commodityQuantity}}</van-col>
                    <van-col span="16" class="text-end">冲红状态:{{statusList[item.state]}}</van-col>
                </van-row>
            </div>
        </van-list>
        <div v-if="list&&list.length==0&&!loading" class="reload">
            <van-button type="danger" size="normal" @click="getOrderList">重新加载</van-button>
        </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getList,getErrorList,getRedList,getOA} from '@/api'
import Cookie from 'js-cookie'
import { Toast } from 'vant'
import {statusList, shipList, productList} from '~/utils/dataList'
export default {
  props: {
    value: {
        type: String,
        default: () => {
            return 'all'
        }
    }
  },
  data() {
    return {
        list: [],
        isloading: false,
        loading: false,
        finished: false,
        status: '',
        otherList: [],
        nowPage: 1,
        pageShow: 10,
        statusList: statusList,
        shipList: shipList,
        productList:productList,
    }
  },
    created() {
        //this.getOrderList()
        //console.log(statusList,shipList)
    },
    methods: {
        getOrderList() {
            this.loading = true;
            //this.getData();
            if(Cookie.get('token')){
                getOA(this,Cookie.get('token')).then(res=>{
                    if(res.code=='0'){
                        Cookie.set('userOA',res.data)
                        this.getData();
                    }else{
                        Toast({
                            type: 'fail',
                            message: res.message,
                        })
                    }
                })
            }else{
                Toast({
                    type: 'fail',
                    message: '请从tlink登录进入',
                })
                this.finished = true;
                this.loading = false;
                this.isloading = false;
            }
        },
        getData(){
            if(this.value=='all'||this.value=='toSendGoods'||this.value=='done'){
                let state = this.value=='toSendGoods'?'120':this.value=='done'?'170':'';
                const data = {
                    oper: Cookie.get('userOA'),
                    state: state,
                    pageNum: this.nowPage,
                    pageSize: this.pageShow,
                }
                getList(this,data).then(res => {
                    if(res.code=="0"){
                        if(res.data.data && res.data.data.length > 0){
                            this.list = [...this.list, ...res.data.data]
                            this.nowPage += 1  
                        }else{
                            this.finished = true
                        }
                    }else{
                        Toast({
                            type: 'fail',
                            message: res.message,
                        })
                        this.finished = true
                    }
                    this.loading = false;
                    this.isloading = false;
                })
            }else if(this.value=='abnormal'){
                const data = {
                    oper: Cookie.get('userOA'),
                    state: '',
                    pageNum: this.nowPage,
                    pageSize: this.pageShow,
                }
                getErrorList(this,data).then(res => {
                    if(res.code=="0"){
                        if(res.data.data && res.data.data.length > 0){
                            this.list = [...this.list, ...res.data.data]
                            this.nowPage += 1  
                        }else{
                            this.finished = true
                        }
                    }else{
                        Toast({
                            type: 'fail',
                            message: res.message,
                        })
                        this.finished = true
                    }
                    this.loading = false;
                    this.isloading = false;
                })
            }else if(this.value=='redList'){
                const data = {
                    oper: Cookie.get('userOA'),
                    state: '',
                    pageNum: this.nowPage,
                    pageSize: this.pageShow,
                }
                getRedList(this,data).then(res => {
                    if(res.code=="0"){
                        if(res.data.data && res.data.data.length > 0){
                            this.list = [...this.list, ...res.data.data]
                            this.nowPage += 1  
                        }else{
                            this.finished = true
                        }
                    }else{
                        Toast({
                            type: 'fail',
                            message: res.message,
                        })
                        this.finished = true
                    }
                    this.loading = false;
                    this.isloading = false;
                })
            }
        },
        handleClick(item,num) {
            let path = num==1?'/order':'/c-order';
            this.$router.push({
                path: path,
                query:{
                    uuid:item.uuid,
                    orderId:item.orderId
                }
            })
        },
        onLoad() {
            this.getOrderList();
        },
        onRefresh(){
            this.getOrderList();
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
.orderlist {
    background: #eee;
    .panel-box {
        margin-bottom: 20px;
        &:last-child {
        margin-bottom: 0px;
        }
    }
    .reload{
        padding: .4rem;
        text-align: center;
        background: #fff;
    }
    .c_detail {
        font-size: .28rem;
        line-height: .54rem;
        padding: 0.2rem;
        border-bottom: 0.15rem solid #eee;
        background: #fff;
    }
    .text-end {
        text-align: end;
    }
    .down_box {
        text-align: center;
    }
}
</style>
