import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:10080'

/**
 * 模拟数据
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export const requseLogin = params => {
  return axios.post('/user/login', params)
}
export const getList = params => {
  return axios.post('/order/list', params)
}
