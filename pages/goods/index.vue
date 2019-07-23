<template>
  <div class="goods">
    <div v-if="isSalesman">
      <van-cell-group v-if="showOrgCus">
        <van-loading class="init_center" v-if="loading"/>
        <van-cell
          v-for="(item, index) in customerlist"
          :key="index"
          :title="item.customerName"
          @click="goNext(item)"
        />
      </van-cell-group>
    </div>
    <div v-if="!isSalesman">
      <div v-if="!showOrgCus">
        <van-search
          v-model="orgName"
          placeholder="请输入机构名字"
          show-action
          shape="round"
          label="机构名字"
          @search="orgInfo"
        >
          <div slot="action" @click="orgInfo()">
            搜索
          </div>
        </van-search>

          <van-cell-group>
            <van-cell
              v-for="(item, index) in orgList"
              :key="index"
              :title="item.crmOrgName"
              @click="selectOrg(item)"
            />
          </van-cell-group>
      </div>

      <van-cell-group v-if="showOrgCus">
          <van-search
            v-model="formItem.paramName"
            placeholder="请输入公司名字"
            show-action
            shape="round"
            label="公司名称"
            @search="custRequire"
          >
            <div slot="action" @click="formItem.page=1;custRequire()">
              搜索
            </div>
          </van-search>
        <van-cell
          v-for="(item, index) in customerlist"
          :key="index"
          :title="item.customerName"
          @click="goNext(item)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { mapMutations } from 'vuex'
import { custRequire,isSalesman,custInfoList,orgInfo } from '@/api/buy'

export default {
  head() {
    return {
      title: '我的要货'
    }
  },
  data() {
    return {
      isSalesman: false,
      showOrgCus: false,
      loading: false,
      formItem: {
        branchCode: '104040500',
        paramName: '',
        page: 1,
        size: 10
      },
      customerlist: [],//要货客户列表
      // 非业务员所需的变量
      orgName: '',//机构名称
      orgList: [],//机构列表

    }
  },
  mounted() {
      this.getData();
  },
  methods: {
    ...mapMutations([
      'SET_ORDER'
    ]),
    goNext (item) {
      let order = this.$store.getters.getOrder
      order.customer = item;
      this.SET_ORDER(order)
      this.$router.push({path:`/goods/next`,query:{crmCode: item.customerCode}})
    },
    selectOrg (item) {//选择一个机构
      this.showOrgCus=true;
      this.formItem.branchCode=item.crmOrgCode;
      let order = this.$store.getters.getOrder
      order.org = item;
      this.SET_ORDER(order)
      this.custRequire();
    },
    getData(){//是否是业务员
        isSalesman(this, {oaAccount:Cookies.get('userOA')}).then(res=>{
            if(res.code==0){
              this.isSalesman = (res.data=='true');
              if (this.isSalesman) {
                this.custInfoList()
                return false
              }
              // this.orgInfo();
            }else{
              this.$toast(res.message)
            }
        })
    },
    custInfoList(){//通过业务员OA账号查询要货客户信息列表
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        custInfoList(this, {salesManId: Cookies.get('userOA')}).then(res=>{
            if(res.code==0){
              this.customerlist = res.data;
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },
    orgInfo(){//通过业务员OA账号查询要货客户信息列表
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        orgInfo(this,{oaAccount: Cookies.get('userOA'),orgName:this.orgName||'%%%'}).then(res=>{
            if(res.code==0){
              this.orgList = res.data.crmOrgVoList;
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },
    custRequire(){//查询要货客户
        this.$toast.loading({
          duration: 0,
          message: '加载中...'
        });
        custRequire(this,this.formItem).then(res=>{
            if(res.code==0){
              this.customerlist = res.data
            }else{
              this.$toast(res.message)
            }
            this.$toast.clear()
        })
    },

    onSearch() {
      this.$toast(this.formItem.paramName)
    },
    onCancel() {},

    
  }
}
</script>

<style lang="less" rel="stylesheet/less"></style>
