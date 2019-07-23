<template>
    <div class="stock">
        <van-row>
        <van-col span="10" class="product_line">
            <van-field
                v-model="productLine"
                right-icon="arrow-down"
                placeholder="请选择产品线"
                readonly
                @click-right-icon="show = true"
            />
        </van-col>
        <van-col span="14">
            <van-search
            v-model="value"
            placeholder="请输入搜索关键词"
            show-action
            shape="round"
            @search="onSearch"
            >
                <div slot="action" @click="onSearch">搜索</div>
            </van-search>
        </van-col>
        </van-row>
        <van-pull-refresh v-model="isloading" @refresh="onRefresh" :disabled="list&&list.length==0">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <div v-for="(item, index) in list" :key="index" class="stock__list">
                    <van-row type="flex" class="van-cell" justify="space-between">
                        <van-col span="24">{{ item.skuCode }}</van-col>
                    </van-row>
                    <van-row type="flex" class="van-cell" justify="space-between">
                        <van-col span="18">{{ item.name }}</van-col>
                        <van-col span="6" class="text-end">库存:{{ item.totalUseableQuantity }}</van-col>
                    </van-row>
                </div>
            </van-list>
            
            <div v-if="list&&list.length==0&&!loading" class="reload">
                <van-button type="danger" size="normal" @click="initData">重新加载</van-button>
            </div>
        </van-pull-refresh>
        <van-popup v-model="show" position="bottom">
            <van-picker
                show-toolbar
                title="请选择产品线"
                :columns="columns"
                @cancel="onCancel"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
import { inventory } from '@/api'
import { productList } from '~/utils/dataList'
import Cookie from 'js-cookie'
import {Toast} from 'vant'
export default {
    head() {
        return {
            title: '我的库存'
        }
    },
    data() {
        return {
            list: [],
            loading: false,
            show: false,
            columns: [],
            columnsValue: [],
            productLine: '',
            productLineValue: '',
            value: '',
            nowPage: 1,
            pageShow: 10,
            isloading: false,
            finished:false
        }
    },
    created(){
        let list = [],lastValue = [];
        for(let i in productList) {
            list.push(productList[i])
            lastValue.push(i)
        }
        this.columns = list;
        this.columnsValue = lastValue;
        this.productLine = list[0];
        this.productLineValue = lastValue[0];
    },
    methods: {
        initData(){
            this.loading = true
            const params = {
                data:{
                    "partyId": "",
                    "productLine": this.productLineValue,
                    "sales": Cookie.get('userOA'),
                    "skuCode": this.value,
                    "skuName": "",
                    "warehouseCode": "",
                    "warehouseName": ""
                },
                current: this.nowPage,
                size : this.pageShow,
            }
            inventory(this,params).then(res => {
                if(res.code=="0"){
                    if(res.data.records && res.data.records.length > 0){
                        this.list = [...this.list, ...res.data.records]
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
        },
        onConfirm(value, index) {
            this.productLine = value;
            this.productLineValue = this.columnsValue[index];
            this.show = false
            this.list = [];
            this.nowPage= 1,
            this.pageShow= 10,
            this.initData();
        },
        onCancel() {
            this.show = false
        },

        onSearch() {
            this.list = [];
            this.nowPage= 1,
            this.pageShow= 10,
            this.initData();
        },
        
        onLoad() {
            this.initData();
        },

        onRefresh(){
            this.initData();
        }
    }
}
</script>

<style lang="less">
.stock {
    &__list {
        border-bottom: 1px solid #ddd;
        &:last-child {
            border-bottom: 0px;
        }
    }
    .reload{
        padding: .4rem;
        text-align: center;
        background: #fff;
    }
    .van-row{
        .product_line{
            .van-cell{
                padding: .2rem;
            }
        }  
        .van-search{
            padding: .1rem .15rem;
        }
    }
    .text-end {
        text-align: end;
    }
}
</style>
