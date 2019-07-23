import Qs from 'qs'
import { Toast } from 'vant'
const Prefix = '/api/call'
const checkCode = function(res) {
  // eslint-disable-next-line no-console
  //console.log(res)
  if (!res) {
    // eslint-disable-next-line no-console
    console.log('路由切换,中断之前路由')
    return false
  }
  if (res.code && parseInt(res.code) === 9999) {
    Toast(res.message)
  }
  return res.data
}
/**
 * 用法：http.type(this), this必传，代表调用this.$axios
 * @type {{patch: (function(*=, *=): *), xhr: (function(*, *=, *=): *), post: (function(*=, *=): *), get: (function(*=, *=): *), delete: (function(*=, *=): *), put: (function(*=, *=): *)}}
 */
const http = {
  xhr: (self, params = { headers: {} }, method) => {
    // eslint-disable-next-line no-console
    //console.log(params)
    const headers =
      method === 'POST' || method === 'PUT' || method === 'PATCH'
        ? { 'Content-Type': 'application/x-www-form-urlencoded' }
        : {}
    const objectHeaders = Object.assign(headers, params.headers)
    const options = {
      method: method,
      url: params.url || Prefix,
      headers: objectHeaders
    }
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      if (
        params.headers &&
        // eslint-disable-next-line eqeqeq
        objectHeaders['Content-Type'] != 'application/json;charset=UTF-8'
      ) {
        options.data = Qs.stringify(params.data)
      } else {
        options.data = params.data
      }
    } else {
      options.params = params.data
      options.paramsSerializer = function(params) {
        return Qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    // eslint-disable-next-line no-console
    //console.log(options)
    return self.$axios(options).then(checkCode)
  },
  post: (self, params) => {
    return http.xhr(self, params, 'POST')
  },
  get: (self, params) => {
    return http.xhr(self, params, 'GET')
  },
  delete: (self, params) => {
    return http.xhr(self, params, 'DELETE')
  },
  put: (self, params) => {
    return http.xhr(self, params, 'PUT')
  },
  patch: (self, params) => {
    return http.xhr(self, params, 'PATCH')
  }
}

export default http
