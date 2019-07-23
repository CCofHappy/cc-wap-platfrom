<template>
  <div>
    <div class="select-header">
      <h2 class="van-doc-demo-block__title">当前产品线：<van-tag plain type="danger"  size="medium">{{productLine.productLineName ? productLine.productLineName.replace('TCL_','').replace('产品线',''):''}}</van-tag></h2>
      <van-search
        v-model="formItem.keyword"
        placeholder="请输入商品名称"
        show-action
        shape="round"
        @search="goodsLike"
      >
        <div slot="action" @click="goodsLike">
          搜索
        </div>
      </van-search>
    </div>

    <div class="select-list">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.skuName"
          @click="selectGoods(item)"
        />
      </van-cell-group>
      <div v-show="!list.length&&showProduct" class=" van-list__finished-text">找不到商品信息</div>
    </div>

    <div  class="" v-show="wareList.length">
      <van-cell v-for="(item,index) in wareList" :key="index" >
        <van-row type="flex" class="my-cell">
          <van-col span="2">
            <van-checkbox v-model="item.checked"></van-checkbox>
          </van-col>
          <van-col span="13" >
            <div>{{item.skuName}}</div>
            <div>{{item.name}}</div>
            <div>库存数: {{item.useableQuantity}}</div>
          </van-col>
          <van-col span="9" v-show="item.checked">
            <div>价格：￥{{item.price}}</div>
            <van-field
              v-model="item.taxRate"
              type="number"
              class="no-padding"
              label="扣率"
              placeholder=""
            />
            <van-field
              v-model="item.quatity"
              class="no-padding"
              type="number"
              label="要货数量"
              placeholder=""
            />
          </van-col>

        </van-row>
        <van-row v-show="item.checked">
            <van-col span='15'><span>&nbsp;</span></van-col>
            <van-col span='9'>
              <div @click="curShuiIndex=index;showShui = true">
                <van-cell title="税率：" is-link :value="item.shuiLv.name" />
              </div>
            </van-col>
        </van-row>
      </van-cell>
    </div>
    <div  v-show="!wareList.length&&!showProduct" class="select-list van-list__finished-text">此商品暂无库存</div>
    <van-popup v-model="showShui" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="收货客户"
        value-key="name"
        :default-index="1"
        :columns="columnsTax"
        @cancel="showShui = false"
        @confirm="confirmTax"
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
          <span class="u-price">￥<label>10000</label></span>
        </p>
        <p class="u-volume">体积：1000m<sup>3</sup></p>
      </div>
    </van-submit-bar>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { mapMutations } from 'vuex'
import { goodsLike,warehoseInfo,warehoseUsableSales,productPrice } from '@/api/buy'
export default {
  // layout: 'default',
  head() {
    return {
      title: '我的要货'
    }
  },
  data() {
    return {
      productLine: {},//当前产品线
      showProduct: true,//展示商品
      showShui: false,//展示税率选择
      curShuiIndex: 0,//当前税率下标
      columnsTax: [{
        name: '6%',
        value: '6'
      },{
        name: '13%',
        value: '13'
      },{
        name: '16%',
        value: '16'
      },{
        name: '17%',
        value: '17'
      }],
      formItem: {
        checked: false,
        keyword: '',
        size: 10
      },
      list: [],//产品列表
      wareList: [],//某个产品的库存列表
      finished: false
    }
  },
  activated () {
    this.productLine = this.$store.getters.getOrder.currentProductLine;
  },
  methods: {
    ...mapMutations([
      'SET_ORDER'
    ]),
    confirmTax (value, index) {
      this.showShui = false
      this.wareList[this.curShuiIndex].shuiLv = value
    },
    onSubmit() {//选择仓库产品,然后跳到上一个页面
      let order = this.$store.getters.getOrder
      let index = order.activeProductLineIndex;//当前产品线的下标
      
      order.columnsProductLine[index].wareGoods = order.columnsProductLine[index].wareGoods.filter(v=>v.checked)
      let checkList =  this.wareList.filter((v)=>{
        if (v.checked) {
          return v
        }
      })
      let skuCodes = order.columnsProductLine[index].wareGoods.map(v=>v.skuCode+v.warehouseCode)
      checkList.map((v)=>{
        if (skuCodes.includes(v.skuCode+v.warehouseCode)) {
          order.columnsProductLine[index].wareGoods[skuCodes.indexOf(v.skuCode+v.warehouseCode)] = v
        }else{
          order.columnsProductLine[index].wareGoods.push(v)
        }
      })
      this.SET_ORDER(order)
      // this.wareList.map(v=>v.useableQuantity=v.useableQuantity - v.quatity)
      this.$router.push({path:`/goods/next`,query:{crmCode: order.org.customerCode}})
    },
    selectGoods (item) {//选择产品
      if (this.$store.getters.getOrder.formItem.danju.code == 'SALES_DELAY_ORDER') {//延期单
        return false;
      }
      this.formItem.keyword = item.skuName
      if (this.$store.getters.getOrder.formItem.danju.code == 'ELECTRONIC_SALES_ORDER') {//电商销售单（异地发货单）
        this.warehoseUsableSales(item)
      }
      this.warehoseInfo(item)
      this.list = [];
      
    },
    goodsLike(){
        this.showProduct = true;
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        this.loading=true;
        goodsLike(this,this.formItem).then(res=>{
            if(res.code==0){
              this.list = res.data
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },
    productPrice(item){//接口中心-查询产品单价
        let params = {
          customerCode: this.$store.getters.getOrder.org.crmOrgCode,
          productSku: item.skuCode
        }
        productPrice(this,params).then(res=>{
            if(res.code=='0000'){
              item.taxRate = res.data.taxRate;
              item.price = res.data.price;
            }else{
              this.$toast(res.message)
            }
        })
    },
    warehoseUsableSales(item){//库存中心-查询指定仓库下产品的可用库存(电商销售单)
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        let params = {
          skuCode: item.skuCode,
          warehouseCode : '',
          productFamilyId : item.productFamily.productFamilyCode
        }
        warehoseUsableSales(this,params).then(res=>{
            this.showProduct = false;
            if(res.code=='0000'){
              if (res.data) {
                res.data.map(v=>{
                  v.checked=false;
                  v.quatity = 1;
                  v.taxRate = 100;
                  v.packageLength = item.packageLength;//长
                  v.packageWidth = item.packageWidth;//宽
                  v.packageHeight = item.packageHeight;//高
                  v.shuiLv = {
                    value: '13',
                    name: '13%'
                  };
                })
                // let order = this.$store.getters.getOrder
                // for (let index = 0; index < order.wareGoods.length; index++) {//如果skuCode和之前已经选的一样
                //   const element = order.wareGoods[index]
                //   res.data.map((v)=>{
                //     if (v.skuCode == element.skuCode) {
                //       v.useableQuantity =  v.useableQuantity - element.useableQuantity
                //     }
                //   })
                // }
                this.wareList = res.data
                for (let index = 0; index < this.wareList.length; index++) {
                  this.productPrice(this.wareList[index])
                }
              }
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },
    warehoseInfo(item){//库存中心-查询产品库存信息，除了异地发货单和延期单调的库存查询接口
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        let params = {
          partyId: this.$store.getters.getOrder.org.crmOrgCode,
          sales: Cookies.get('userOA'),
          skuCode: item.skuCode,
          warehouseCode : '',
          productFamilyId : item.productFamily.productFamilyCode
        }
        warehoseInfo(this,params).then(res=>{
            this.showProduct = false;
            if(res.code=='0000'){
              if (res.data) {
                res.data.map(v=>{
                  v.checked=false;
                  v.quatity = 1;
                  v.taxRate = 100;
                  v.packageLength = item.packageLength;//长
                  v.packageWidth = item.packageWidth;//宽
                  v.packageHeight = item.packageHeight;//高
                  v.shuiLv = {
                    value: '13',
                    name: '13%'
                  };
                })

                // //可用库存减去已选的库存
                // res.data.map(v=>v.checked=false)
                // let order = this.$store.getters.getOrder
                // for (let index = 0; index < order.wareGoods.length; index++) {//如果skuCode和之前已经选的一样
                //   const element = order.wareGoods[index]
                //   res.data.map((v)=>{
                //     if (v.skuCode == element.skuCode) {
                //       v.useableQuantity -=  element.useableQuantity
                //     }
                //   })
                // }

                this.wareList = res.data
                for (let index = 0; index < this.wareList.length; index++) {
                  this.productPrice(this.wareList[index])
                }
              }

            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },


    onClickEdit() {},
    // onLoad() {
    //   const self = this
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       self.list.push(self.list.length + 1)
    //     }
    //     // 加载状态结束
    //     self.loading = false

    //     // 数据全部加载完成
    //     if (self.list.length >= 40) {
    //       self.finished = true
    //     }
    //   }, 500)
    // }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
/deep/ .van-cell {
  padding: 6px 10px;
}
/deep/ .no-padding {
  padding: 10px 0;
}
/deep/ .no-padding .van-field__control {
  border: 1px solid #eee;
  background: #eee;
  padding: 4px;
}
.cart__main__total {
  font-size: 0.28rem;
  padding: 0.2rem;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  color: #919191;
  margin-right: 0.2rem;
}
.select-header {
  top: 0;
  left: 0;
  width: 100%;
  position: fixed;
  z-index: 100;
}
.select-list {
  padding-top: 1.78rem;
}
.van-doc-demo-block__title{
     margin: 0;
    font-weight: 400;
    font-size: 28px;
    color: rgba(69,90,100,.6);
    padding: 35px 15px 15px;
    padding-top: 20px;
    background: #f2f3f5;
    text-align: center;
}
</style>
