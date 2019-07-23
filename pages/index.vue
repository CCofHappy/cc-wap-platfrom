<template>
    <div class="order">
        <van-tabs v-model="active" title-active-color="red" animated>
            <van-tab v-for="(item, index) in tabs" :key="index" :title="item.title">
                <order-list :value="item.value"/>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
// import { getList } from '@/api'
import { getOA } from '@/api'
import OrderList from '@/components/OrderList'
import Cookie from 'js-cookie';
import { Toast } from 'vant'
export default {
    head() {
        return {
        title: '我的订单'
        }
    },
    middleware: 'anonymous',
    components: {
        OrderList
    },
    data() {
        return {
        active: 0,
        tabs: [
            { value: 'all', title: '全部' },
            { value: 'toSendGoods', title: '待发货' },
            { value: 'done', title: '已完成' },
            { value: 'abnormal', title: '异常单' },
            { value: 'redList', title: '冲红单' }
        ]
        }
    },
    methods:{
        getUserOA(){
            Cookie.set('userOA',"")
            // let token = Cookie.get('token');
            // // Cookie.set('userOA',"")
            // getOA(this,token).then(res=>{
            //     if(res.code=='0'){
            //         Cookie.set('userOA',res.data)
            //     }else{
            //         Toast({
            //             type: 'fail',
            //             message: res.message,
            //         })
            //     }
            // })
        },
    },
    mounted() {
        // eslint-disable-next-line no-console
        this.getUserOA()
    }
}
</script>

<style></style>
