import axios from 'axios'
import http from '@/plugins/http'
axios.defaults.baseURL = 'http://127.0.0.1:10080'

/**
 * 模拟数据
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export const requseLogin = params => {
  return axios.post('/user/login', params)
}

//获取主单列表
export const getList = (self,{ oper,state, pageNum, pageSize})=> {
  //return axios.post('/order/list', params)
    let params = {
        url: '/api/sales2b/order-main',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
            oper: oper,
            state: state,
            pageNum: pageNum,
            pageSize: pageSize||10,
            orderSource: 2,
            orderBy: 'create_time DESC'
        }
    };
    return http.post(self, params)
}

//获取异常订单列表
export const getErrorList = (self, { oper, state, pageNum, pageSize }) => {
    //return axios.post('/order/list', params)
    let params = {
        url: '/api/sales2b/order-exception',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
            oper: oper,
            isRedOrder: 0,
            states: state||['040', '070', '090', '110', '101'],
            pageNum: pageNum,
            pageSize: pageSize || 10,
            orderSource: 2,
            orderBy: 'create_time DESC'
        }
    };
    return http.post(self, params)
}

//获取冲红订单列表
export const getRedList = (self, { oper, state, pageNum, pageSize }) => {
    //return axios.post('/order/list', params)
    let params = {
        url: '/api/sales2b/order-returned-order-list',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
            oper: oper,
            isRedOrder: 1,
            states: state || ['170', '172', '174', '176', '178', '180'],
            pageNum: pageNum,
            pageSize: pageSize || 10,
            orderSource: 2,
            orderBy: 'create_time DESC'
        }
    };
    return http.post(self, params)
}

//获取主单详情
export const getMainDetail = (self, { uuid, orderId }) => {
    //return axios.post('/order/list', params)
    let params = {
        url: '/api/sales2b/order-main-detail',
        data: {
            orderId: orderId,
            uuid: uuid,
        }
    };
    return http.get(self, params)
}

//获取子单详情
export const getSubsDetail = (self, { uuid, orderId }) => {
    //return axios.post('/order/list', params)
    let params = {
        url: '/api/sales2b/order-subs-detail',
        data: {
            orderId: orderId,
            uuid: uuid,
        }
    };
    return http.get(self, params)
}

//订单重发
export const retryOrder = (self, orderId ) => {
    //return axios.post('/order/list', params)
    let params = {
        url: '/api/sales2b/order-retry-create',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
            orderId: orderId,
        } 
    };
    return http.post(self, params)
}

//订单作废
export const cancelOrder = (self, orderId) => {
    //return axios.post('/order/list', params)
    let params = {
        url: '/api/sales2b/order-cancel',
        data: {
            orderId: orderId,
        }
    };
    return http.get(self, params)
}

//库存分页列表
export const inventory = (self, { data, current, size}) => {
    //return axios.post('/order/list', params)
    let params = {
        url: '/api/inventory/inventory/mobile/page?current=' + current + '&size=' + size,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: data
    };
    return http.post(self, params)
}

export const getList1 = self => {
  const params = {
    url: '/app/test01',
    data: {
      id: 123
    }
  }
  return new Promise((resolve, reject) => {
    http
      .get(self, params)
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(response)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * 真实数据
 * @param self是this字段，必传，在页面或者store里传，实例在store里
 * @param info
 * @returns {*}
 */
export const setData = (self, info) => {
  return http.post(self, info)
}

export const getOA = (self, token) => {
    let params = {
        url: '/api/system/auth',
        headers:{
            'userToken' : token,
        }
    };
    return http.get(self, params)
}

