<template>
  <div>
    <van-cell-group>
      <!-- <van-field
        v-model="formItem.settleAccount.customerName"
        label="结算客户"
        placeholder="请选择结算客户"
        @click="show.showSettle = true"
      /> -->
        <div @click="show.showSettle = true">
          <van-cell title="结算客户：" is-link :value="formItem.settleAccount.customerName" />
        </div>
        <div @click="show.showDanju = true">
          <van-cell title="单据类型：" is-link :value="formItem.danju.name" />
        </div>
        <div @click="show.showpeiSong = true">
          <van-cell title="配送方式：" is-link :value="formItem.peiSong.label" />
        </div>
    </van-cell-group>
    <van-tabs type="card" sticky v-show="columnsProductLine.length" v-model="activeProductLineIndex">
      <van-tab v-for="(item,index) in columnsProductLine" :title="item.productLineName.replace('TCL_','').replace('产品线','')" :key="index">
          <van-row type="flex" class="van-cell">
            <van-col span="24">账期余额：￥{{item.deliveryQuota||0}}</van-col>
          </van-row>
          <van-row type="flex" class="van-cell">
            <van-col span="12">资金：{{item.fundQuota?'￥':''}}{{item.fundQuota}}</van-col>
            <van-col span="12" class="text-end">信用: {{item.creditQuota}}</van-col>
          </van-row>
          <van-row type="flex" class="van-cell">
            <van-col span="12">补差：￥{{item.adjustmentQuota||0}}</van-col>
            <van-col span="12" class="text-end">        
              <van-field
                v-model="item.useAdjust"
                class="no-padding"
                label="使用补差："
                type="number"
                placeholder=""
              />
            </van-col>
          </van-row>
          <van-row type="flex" class="van-cell">
            <van-col span="12">实际账期：{{item.actualAccountPeriod}}</van-col>
            <!-- <van-col span="12" class="text-end">
              <van-field
                v-model="item.fare"
                class="no-padding"
                label="运费"
                type="number"
                placeholder=""
              />
            </van-col> -->
          </van-row>
          <van-button size="large" @click="goSelectGoods()"
            >添加商品</van-button
          >
          <div  class="" >
            <van-cell v-for="(initem,index) in item.wareGoods" :key="index" >
              <van-row type="flex" class="my-cell">
                <van-col span="2"
                  ><van-checkbox v-model="initem.checked"></van-checkbox
                ></van-col>
                <van-col span="13" >
                  <div>{{initem.skuName}}</div>
                  <div>{{initem.name}}</div>
                </van-col>
                <van-col span="9" v-show="initem.checked">
                  <div>价格：￥{{initem.price}}</div>
                  <div>数量：X {{initem.quatity}}</div>
                  <div>扣率：{{initem.taxRate}}%</div>
                </van-col>
              </van-row>
            </van-cell>
          </div>
      </van-tab>
    </van-tabs>

    <div class="van-submit-bar" :disabled="canSubmit"  @click="onSubmit" style="z-index:201;">
      <van-button size="large" type="danger" style="width:100%;">确认下单</van-button>
    </div>
    </van-submit-bar>
    <van-popup v-model="show.showSettle" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="结算客户"
        value-key="customerName"
        :default-index="0"
        :columns="columnsSettle"
        @cancel="show.showSettle = false"
        @change="onChangeSettle"
        @confirm="onConfirmSettle"
      />
    </van-popup>
    <van-popup v-model="show.showProductLine" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="产品线"
        value-key="productLineName"
        :default-index="0"
        :columns="columnsProductLine"
        @cancel="show.showProductLine = false"
        @confirm="onConfirmProductLine"
      />
    </van-popup>
    <van-popup v-model="show.showpeiSong" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="配送方式"
        value-key="label"
        :default-index="0"
        :columns="peiSongList"
        @cancel="show.showpeiSong = false"
        @confirm="onConfirmpeiSong"
      />
    </van-popup>
    <van-popup v-model="show.showDanju" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="单据类型"
        value-key="name"
        :default-index="0"
        :columns="columnsDanju"
        @cancel="show.showDanju = false"
        @confirm="onConfirmDanju"
      />
    </van-popup>
  </div>
</template>

<script>
import { custDelivery,fundInfo,orderType } from '@/api/buy'
import { mapMutations } from 'vuex'
export default {
  // layout: 'empty',
  validate({ params }) {
    // Must be a number
    return /^[A-Za-z\d]+$/.test(params.id)
  },
  data() {
    let self = this;
    return {
      canSubmit: false,//可以下单
      activeProductLineIndex: 0,//当前产品线的下标
      show: {
        showSettle: false,
        showProductLine: false,
        showpeiSong: false,
        showDanju: false
      },
      formItem: {
        settleAccount: {
          customerName:''
        },
        productLine: {
          productLineName: '',
          deliveryQuota:'',//发货额度，使用额差
          fundQuota:'',//资金
          creditQuota:'',//信用
          adjustmentQuota: '',//补差
          useAdjust: 0,
          fare: 0,
          actualAccountPeriod: '',//实际账期
        },
        peiSong:  {
          value: '5',
          label: '配送'
        },
        danju: {
          name: '',
          code: ''
        },
        fare: '',
        margin: ''
      },
      columnsSettle: [],//结算客户
      columnsProductLine: this.$store.getters.getOrder.columnsProductLine || [],
      peiSongList: [
        {
          value: '5',
          label: '配送'
        },
        {
          value: '2',
          label: '自提'
        },
        {
          value: '4',
          label: '快递'
        }
      ],
      columnsDanju: []//单据类型
    }
  },
  created () {
    this.getCustDelivery()
  },
  watch: {
    columnsProductLine : {     
      handler (newData, oldData) {
        console.log('改变了')
        newData.map(v=>{
          
          if (v.wareGoods.filter(v=>v.checked).length) {
            this.canSubmit = true;
            return;
          }
        })
        this.canSubmit 
      },
      immediate: true,
      deep: true,
    }
  },
  activated () {
    this.columnsProductLine = [];
    this.columnsProductLine = this.$store.getters.getOrder.columnsProductLine || [];
  },
  methods: {
    ...mapMutations([
      'SET_ORDER'
    ]),
    onSubmit () {//确认开单
      this.$router.push({path:'/goods/checkout'})
    },
    goSelectGoods () {//去添加商品
      let order = this.$store.getters.getOrder
      order.columnsSettle = this.columnsSettle;
      order.columnsProductLine = this.columnsProductLine;//产品线
      order.formItem = this.formItem;
      order.activeProductLineIndex = this.activeProductLineIndex;//当前产品线的下标
      order.currentProductLine = this.columnsProductLine[this.activeProductLineIndex]
      this.SET_ORDER(order)
      this.$router.push('/goods/selectgoods')
    },
    getCustDelivery(){//结算客户
        let self = this
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        custDelivery(this,{crmCode:this.$route.query.crmCode}).then(res=>{
            if(res.code==0){
              this.columnsSettle = res.data.cargo
              this.formItem.settleAccount = res.data.cargo[0] || []
              if (this.formItem.settleAccount.customerCode) {
                this.fundInfo()
              }
              let order = this.$store.getters.getOrder
              order.convey = res.data.convey
              this.SET_ORDER(order)
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },
    fundInfo(){//查询结算客户资金信息，也就是产品线
        fundInfo(this,{customerCode :this.formItem.settleAccount.customerCode}).then(res=>{
            if(res.code==0){
              this.columnsProductLine = res.data.fundInfoVOList
              this.columnsProductLine.map(v=>{
                v.wareGoods = [];
                v.useAdjust = 0;
              });
              this.formItem.productLine = res.data.fundInfoVOList[0] || {}
              this.orderType()
            }else{
              this.$toast(res.message)
            }
        })
    },
    orderType(){//订单中心-订单类型
        orderType(this).then(res=>{
            if(res.code==0){
              this.columnsDanju = res.data
              this.formItem.danju = res.data[0] || {}
            }else{
              this.$toast(res.message)
            }
        })
    },
    onChangeSettle(value, index) {
      this.formItem.settleAccount = value
      this.fundInfo();
    },
    onConfirmSettle(value, index) {
      this.show.showSettle = false
      this.formItem.settleAccount = value
      this.fundInfo();
    },
    onConfirmProductLine(value, index) {
      this.show.showProductLine = false
      this.formItem.productLine = value
    },
    
    onConfirmDanju(value, index) {
      this.show.showDanju = false
      this.formItem.danju = value
    },
    onConfirmpeiSong(value, index) {
      this.show.showpeiSong = false
      this.formItem.peiSong = value
    },
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.no-padding {
  padding: 0;
}
/deep/ .no-padding .van-field__control {
  border: 1px solid #eee;
  background: #eee;
}
</style>
