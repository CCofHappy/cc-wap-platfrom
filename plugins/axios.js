import { Toast } from 'vant'

let lock = false
const checkStatus = function(res) {
  if (res.status === 200 || res.status === 304 || res.status === 400) {
    if (res.data && res.data.code === '-9999') {
      Toast(res.data.message)
    }
    return res
  }
  return {
    code: 9999,
    message: res.statusText,
    data: res.statusText
  }
}
export default function({ $axios, route, store, redirect }) {
  $axios.defaults.withCredentials = true
  $axios.defaults.timeout = 300000
  $axios.onRequest(config => {
    if (process.browser) {
      // 判断是否为客户端（必须）
      return config
    } else {
      // eslint-disable-next-line no-console
      console.log('this is server...')
    }
  })
  $axios.onResponse(response => {
    if (process.browser) {
      // 判断是否为客户端（必须）
      checkStatus(response)
    } else {
      // eslint-disable-next-line no-console
      console.log('this is server...')
    }
  })
  $axios.onError(error => {
    if (error.response) {
      switch (error.response.status) {
        case -500:
        case 500:
          if (lock) {
            return false
          }
          lock = true
          // 清空所有提示
          // eslint-disable-next-line no-console
          console.log(route)
          break
        case 403:
          return error.response
      }
    }
    return Promise.resolve(error.res)
  })
}
