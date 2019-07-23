import axios from 'axios'
import http from '@/plugins/http'
axios.defaults.baseURL = 'http://127.0.0.1:10080'

import Cookies from 'js-cookie';
Cookies.set('userOA', "wangyalin")

//判断是否业务员
export const isSalesman = (self, dataObject) => {
    let params = {
        url: '/api/sales2b/is-salesman',
        data: dataObject
    };
    return http.get(self, params)
}
//通过业务员OA账号查询要货客户信息列表
export const custInfoList = (self, dataObject) => {
    let params = {
        url: '/api/sales2b/cust-info-list',
        data: dataObject
    };
    return http.get(self, params)
}
//查询机构
export const orgInfo = (self, dataObject) => {
    let params = {
        url: '/api/sales2b/org-info',
        data: dataObject
    };
    return http.get(self, params)
}
//查询要货客户
export const custRequire = (self, dataObject) => {
    let params = {
        url: '/api/sales2b/cust-require',
        data: dataObject
    };
    return http.get(self, params)
}


//查询结算客户和要货客户
export const custDelivery = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/cust-delivery`,
        data: dataObject
    };
    return http.get(self, params)
}

//查询结算客户资金信息
export const fundInfo = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/fund-info`,
        data: dataObject
    };
    return http.get(self, params)
}

//订单中心-订单类型
export const orderType = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/order-type`,
        data: {}
    };
    return http.get(self, params)
}

//产品中心-产品信息模糊搜索
export const goodsLike = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/goods-like`,
        data: dataObject
    };
    return http.get(self, params)
}

//库存中心-查询产品库存信息
export const warehoseInfo = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/warehouse-info`,
        data: dataObject
    };
    return http.get(self, params)
}

//库存中心-查询指定仓库下产品的可用库存(电商销售单)
export const warehoseUsableSales = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/warehouse-usable-sales`,
        data: dataObject
    };
    return http.get(self, params)
}

//接口中心-查询产品单价
export const productPrice = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/product-price`,
        data: dataObject
    };
    return http.get(self, params)
}


//客户中心-查询是否空调合伙人
export const cusAirpartner = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/cust-airpartner`,
        data: dataObject
    };
    return http.get(self, params)
}

//接口中心-查询空调对应的仓库
export const receivingWarehouse = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/receiving-warehouse`,
        data: dataObject
    };
    return http.get(self, params)
}

//客户中心-查询配送地址
export const cusAddress = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/cust-address`,
        data: dataObject
    };
    return http.get(self, params)
}

//订单中心-提交代客下单
export const orderCreate = (self, dataObject) => {
    let params = {
        url: `/api/sales2b/order-create`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: dataObject
    };
    return http.post(self, params)
}