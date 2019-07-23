<template>
  <div>
    <div>
        <van-cell-group>
            <div @click="show.showConvey = true">
              <van-cell title="收货客户：" is-link :value="formItem.convey.customerName" />
            </div>
            <van-cell title="收货地址：" :value="formItem.address.detailAddress" is-link :to="{path:'/goods/selectAddress',query:{id:formItem.convey.crmInfoId}}"/>
            <van-field
              v-model="formItem.address.contactsPhone"
              label="电话号码："
              placeholder="请输入电话号码"
              right-icon="arrow"
            />
            <van-field
              v-model="formItem.address.contacts"
              label="联系人："
              placeholder="请输入联系人"
              right-icon="arrow"
            />
            <van-field
              v-model="formItem.address.identityCard"
              label="身份证号码："
              placeholder="请输入身份证号码"
              right-icon="arrow"
            />
            <van-field
              v-model="formItem.note"
              label="备注："
              placeholder="请输入备注"
              right-icon="arrow"
            />
            <div @click="show.showCreateTime=true">
              <van-cell title="订单日期" is-link :value="formItem.createTime" />
            </div>
            <van-cell title="使用补差："  :value="'￥'+formItem.allAdjust" />
            <!-- <van-cell title="运费："  :value="'￥'+$store.getters.getOrder.formItem.productLine.fare||0" /> -->
        </van-cell-group>

        <div class="van-cell-wrapper" @click="showGoods = !showGoods">
          <van-row type="flex" class="van-cell">
            <van-col span="12">要货客户：惠州电器商行</van-col>
            <van-col span="9" class="text-end">产品线: TV</van-col>
            <van-col span="3"><van-icon name="arrow-down"/></van-col>
          </van-row>
          <van-row type="flex" class="van-cell">
            <van-col span="12">数量：10</van-col>
            <van-col span="12" class="text-end">金额: 6847.3</van-col>
          </van-row>
        </div>
        <van-row v-if="showGoods" type="flex" class="van-cell">
          <van-col span="12">L55E5800A</van-col>
          <van-col span="12" class="text-end">价格: 2589.0</van-col>
          <van-col span="12">H兰州 RDC</van-col>
          <van-col span="12" class="text-end">数量： X1</van-col>
          <van-col span="12">H兰州 RDC</van-col>
          <van-col span="12" class="text-end">数量： X1</van-col>
        </van-row>
    </div>
    <van-popup v-model="show.showCreateTime" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="createTime"
        @confirm="confirmCreateTime"
        @cancel="show.showCreateTime = false"
        type="date"
      />
    </van-popup>
    <van-popup v-model="show.showConvey" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="收货客户"
        value-key="customerName"
        :default-index="0"
        :columns="columnsConvey"
        @cancel="show.showConvey = false"
        @confirm="confirmConvey"
      />
    </van-popup>

    <van-submit-bar
      button-text="确定"
      :loading="false"
      style="z-index:2000"
      @submit="onSubmit"
    >
      <div class="cart__main__total">
        <p class="total">
          <i>合计：</i>
          <span class="u-price">￥<label>{{formItem.productMoney}}</label></span>
        </p>
        <p class="u-volume">
          <span>数量：{{formItem.commodityQuantity}}</span> 
          <span>体积：{{formItem.totalVolume}}m<sup>3</sup></span> 
        </p>
      </div>
    </van-submit-bar>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { mapMutations } from 'vuex'
import { cusAirpartner,receivingWarehouse,cusAddress,orderCreate } from '@/api/buy'
import {format,accMul} from '@/utils'
export default {
  // layout: 'empty',
  data() {
    return {
      address: '',//明细地址输入框
      activeName: '1',
      showGoods: false,
      show: {
        showCreateTime: false,
        showConvey: false,
        showProductLine: false,
        showPeisong: false,
        showDanju: false
      },
      createTime: new Date(),
      formItem: {
        totalVolume: 0,//总体积,
        commodityQuantity: 0,//总数量
        productMoney:0,//总价
        allAdjust: 0,//总补差
        createTime: format('YYYY-MM-DD', new Date()),
        note: '',
        convey: {},
        productLine: {},
        address: {},
        peiSong: '',
        danju: '',
        fare: '',
        margin: ''
      },
      addressList: [],//地址列表
      columnsConvey: this.$store.getters.getOrder.convey || [],
      columnsProductLine: [
        { name: '杭州', code: '1' },
        { name: '宁波', code: '2' },
        { name: '惠州', code: '3' },
        { name: '北京', code: '4' }
      ],
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
      columnsDanju: [
        { name: '杭州', code: '1' },
        { name: '宁波', code: '2' },
        { name: '惠州', code: '3' },
        { name: '北京', code: '4' }
      ]
    }
  },
  activated ()  {
    this.columnsConvey = this.$store.getters.getOrder.convey || [];
    this.formItem.address = {};
    this.formItem.address = this.$store.getters.getOrder.address || {};
    this.formItem.convey = this.columnsConvey[0];
    this.formItem.allAdjust = 0;
    
    let adjustArr = this.$store.getters.getOrder.columnsProductLine.map(v=>{
      if (v.wareGoods.length) {
        return v.useAdjust
      } 
    })
    this.formItem.allAdjust =  adjustArr.reduce((total, num)=>total+num)
    this.initData()
  },
  mounted () {
    // this.columnsConvey = this.$store.getters.getOrder.convey || [];
    this.cusAirpartner();
  },
  methods: {
    ...mapMutations([
      'SET_ORDER'
    ]),
    initData () {//初始化页面数据
      let volumeArr = [];
      let commodityQuantityArr = [];//总数量数组
      let productMoneyArr = [];//每条产品线总价数组
      this.$store.getters.getOrder.columnsProductLine.map(v=>{
        let totalVolume = v.wareGoods.filter(v=>v.checked).map(v1=>{
          volumeArr.push( accMul( parseFloat((v1.packageLength*v1.packageWidth*v1.packageHeight) /Math.pow(10,15)), v1.quatity, 1) )
          commodityQuantityArr.push(parseInt(v1.quatity))
          let money = accMul( parseFloat(v1.quatity), (accMul(parseFloat(v1.price), parseFloat(v1.taxRate), 0.01)).toFixed(2), 1);
          productMoneyArr.push(money);
        })
      });
      let totalVolume = 0;
      let commodityQuantity = 0;
      let productMoney = 0;
      volumeArr.map(v=>{
        totalVolume += v;
      })
      productMoneyArr.map(v=>{
        productMoney += v;
      })
      commodityQuantityArr.map(v=>{
        commodityQuantity += v;
      })
      //计算体积，总价
      this.formItem.totalVolume = totalVolume.toFixed(6);
      this.formItem.productMoney = productMoney.toFixed(2);
      this.formItem.commodityQuantity = parseInt(commodityQuantity);
    },
    onSubmit() {
      let commodityList = [];//产品列表
      let rebateMoneyList = [];//产品线列表
      let returnMoney = 0;//若干条产品线使用调差之和
      this.$store.getters.getOrder.columnsProductLine.map(v=>{
        rebateMoneyList.push({
            "productLineCode": v.productLine,//产品线编码
            "productLineName": v.productLineName,//产品线名称
            "rebateMoney": v.useAdjust//使用调差
        })
        returnMoney += v.useAdjust;
        v.wareGoods.filter((v,rowNum)=>v.checked).map(v1=>{
          commodityList.push(            {
              "basePrice": (parseFloat(v1.price)*parseFloat(v1.taxRate)*0.01).toFixed(2),//单价*扣率
              // "commodityCode": "string",
              // "commodityName": "string",
              "discount": v1.taxRate,//扣率
              "finalPrice": accMul( parseFloat(v1.quatity), (accMul(parseFloat(v1.price), parseFloat(v1.taxRate), 0.01)).toFixed(2), 1),//单价*数量
              "freeMoney": v1.useAdjust || 0,//使用调差
              "marketPrice": v1.price,//单价
              "productline": {//产品线
                "productFamilyCode": v.productLine,
                "productFamilyName": v.productLineName
              },
              "quantity": v1.quatity,//数量
              "rowNum": v1.rowNum,//产品所在下标
              "sku": v1.skuCode,
              "skuName": v1.skuName,
              "taxRate": v1.shuiLv.value,//税率
              // "spec": "string",
              // "taxRate": 0,//税率
              "warehouseList": [//仓库列表，查库存的时候
                {
                  "warehouseAddr": v1.provinceName+v1.cityName+v1.countyName+v1.detailAddress,//provinceName+cityName+countyName+detailAddress
                  "warehouseAddrCode": v1.addressId,//addressId
                  "warehouseCode": v1.warehouseCode,
                  "warehouseDivision": v1.business,//事业部编码 business
                  "warehouseName": v1.name,
                  // "warehouseProiority": 0
                }
              ]
            })
        })
      })


      let params = {
          // "active": true,
          "address": this.$store.getters.getOrder.address,//客户收货地址对象
          "address":{
              "address": this.$store.getters.getOrder.address.detailAddress,//明细地址
              "addressCode": this.$store.getters.getOrder.address.addressCode,
              "city": this.$store.getters.getOrder.address.cityName,
              "cityCode": this.$store.getters.getOrder.address.cityCode,
              "identityCode": this.$store.getters.getOrder.address.identityCard,
              "mobile": this.$store.getters.getOrder.address.contactsPhone,
              "name": this.$store.getters.getOrder.address.contacts,
              "postCode": "",//邮编
              "province": this.$store.getters.getOrder.address.provinceName,
              "provinceCode": this.$store.getters.getOrder.address.provinceCode,
              "region": this.$store.getters.getOrder.address.districtName,
              "regionCode": this.$store.getters.getOrder.address.districtCode,
              "street": '',//街道
              "streetCode": "",//街道编码,
              "telephone": ""//固话
          },//客户收货地址对象
          "affixation": this.$store.getters.getOrder.formItem.productLine.fare || 0,//运费
          // "attachments": [
          //   {
          //     "index": 0,
          //     "note": "string",
          //     "size": "string",
          //     "title": "string",
          //     "url": "string"
          //   }
          // ],
          // "bcustomerCode": "string",
          // "capitailBackDesc": "string",//异地发货 回款备注
          // "capitailBackType": "string",//异地发货 回款方式
          "commodityList": commodityList, //产品列表,
          "commodityQuantity": this.formItem.commodityQuantity,//总数量
          "orderTime": this.formItem.createTime,//下单时间
          "customerCode": this.$store.getters.getOrder.customer.customerCode,//要货客户编码
          "customerName": this.$store.getters.getOrder.customer.customerName,//要货客户名称
          // "customerOrderNo": "string",
          // "employeeCode": "string",
          "freeMoney": 0,//优惠金额
          // "invoice": "string",//开票信息
          // "isDistribution": "string",
          "note": this.formItem.note,//订单备注
          // "opeTime": "2019-07-18T07:29:47.784Z",
          "oper": Cookies.get('userOA'),//oa登录账号
          "employeeCode":Cookies.get('userOA'),
          // "orderTime": "string",
          "orderType": this.$store.getters.getOrder.formItem.danju.code,//订单类型
          "orderSource": 2,//订单来源
          "orgCode": this.$store.getters.getOrder.org.crmOrgCode,//机构编码
          "orgName": this.$store.getters.getOrder.org.crmOrgName,//机构名称
          "payMoney": 0,//暂时不用
          // "payType": "string",
          "productMoney": this.formItem.productMoney,//支付金额
          "rebateMoneyList": rebateMoneyList,//产品线选项卡


          "receiptType": "",//收货类型，空调合伙人才有
          "receiptWarehouseCode": "",//收货仓库编码，空调合伙人才有
          "receiptWarehouseName": "",//收货仓库名称，空调合伙人才有
          "settlementCustomerMark": "string",//结算客户标识，是否是空调合伙人

          "receiverCustomerCode": this.formItem.convey.customerCode,//收货客户编码，配送客户编码
          "receiverCustomerName": this.formItem.convey.customerName,//收货客户名称，配送客户名称
          "returnMoney": returnMoney,//若干条产品线使用调差之和
          "salesManId": "string",//业务员编码
          // "salesManName": "string",//业务员编码
          "settleCustomerCode": this.$store.getters.getOrder.formItem.settleAccount.customerCode,//结算客户编码
          "settleCustomerName": this.$store.getters.getOrder.formItem.settleAccount.customerName,//结算客户名称
          "shipType": this.$store.getters.getOrder.formItem.peiSong.value,//配送方式
          "totalVolume": this.formItem.totalVolume,//总体积
        };
        console.log(JSON.stringify(params))
        orderCreate(this,params).then(res=>{
            if(res.code==0){
              // this.$router.push({path:'/goods/'})
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },
    cusAddress(){//客户中心-查询配送地址
        let params = {
          address: this.address,
          id: this.columnsConvey[0].crmInfoId,
          current: 1,
          size: 10,
        }
        cusAddress(this,params).then(res=>{
            if(res.code==0){
              let order = this.$store.getters.getOrder
              order.address = {};
              order.address = res.data.records[0];
              this.SET_ORDER(order)
              this.formItem.address = res.data.records[0];
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },


    cusAirpartner(){//客户中心-查询是否空调合伙人
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        let params = {
          crmCode: this.$store.getters.getOrder.formItem.settleAccount.customerCode
        }
        cusAirpartner(this,params).then(res=>{
            if(res.code==0){
              this.cusAddress()
              if (res.data === 'Y') {//是空调合伙人
                this.receivingWarehouse()
              }
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },
    receivingWarehouse(){//接口中心-查询空调对应的仓库
        let params = {
          crmCode: this.$store.getters.getOrder.formItem.settleAccount.customerCode
        }
        receivingWarehouse(this,params).then(res=>{
            if(res.code==0){
              
            }else{
               this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },

    confirmConvey (value, index) {
      this.show.showConvey = false
      this.formItem.convey = value
    },
    confirmCreateTime (value,index) {
      this.show.showCreateTime = false;
      this.formItem.createTime = format('YYYY-MM-DD', value)
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.no-padding {
  padding: 0;
}
// /deep/ .no-padding .van-field__control {
//   border: 1px solid #eee;
//   background: #eee;
//   padding: 4px;
// }
.van-cell-wrapper .van-cell {
  background: #eee;
}
.cart__main__total{
  padding-left: 10px;
}
</style>
