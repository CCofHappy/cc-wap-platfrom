import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { users } from './data/user'
import { list } from './data/list'

export default {
  init() {
    const mock = new MockAdapter(axios)

    // mock success request  模拟成功请求
    mock.onGet('/success').reply(200, {
      msg: 'success'
    })
    // mock error request  模拟失败请求
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    })
    // 我的订单数据
    /**
     * 判断当前list数据的长度
     * 分页查询：当前页到指定的页码，如果当前页数小于指定页码数，查第nowPage*pageShow开始的数量为pageshow数据
     * 如果当前页码等于指定也码数，查当前页码当最后一个数据的大小
     */
    mock.onPost('/order/list').reply(config => {
      const { nowPage, pageShow, type } = JSON.parse(config.data)
      // eslint-disable-next-line no-console
      console.log(JSON.parse(config.data))
      return new Promise((resolve, reject) => {
        const newList = []
        if (!nowPage || !pageShow || !type) {
          resolve([200, { code: 500, msg: '传值错误', newList }])
        }
        const length = list.length
        // debugger
        const listPageShow = Math.ceil(list.length / pageShow)
        if (length < 10) {
          for (let i = nowPage; i < length; i++) {
            newList.push(list[i - 1])
          }
        } else {
          if (nowPage < listPageShow) {
            for (
              let i = (nowPage - 1) * pageShow;
              i < nowPage * pageShow;
              i++
            ) {
              newList.push(list[i])
            }
          }
          if (nowPage === listPageShow) {
            for (let i = (nowPage - 1) * pageShow; i < length; i++) {
              newList.push(list[i])
            }
          }
          resolve([200, { code: 200, msg: '获取成功', newList }])
        }
      })
    })
    // login 模拟登录接口
    mock.onPost('/user/login').reply(config => {
      // 解析axios传过来的数据
      const { username, password } = JSON.parse(config.data)
      return new Promise((resolve, reject) => {
        // 先创建一个用户为空对象
        let user = null
        setTimeout(() => {
          // 判断模拟的假数据中是否有和传过来的数据匹配的
          const hasUser = users.some(person => {
            // 如果存在这样的数据
            if (person.username === username && person.password === password) {
              user = JSON.parse(JSON.stringify(person))
              user.password = undefined
              return true
            } else {
              //  如果没有这个person
              return false
            }
          })
          // 如果有那么一个人
          if (hasUser) {
            resolve([200, { code: 200, msg: '登录成功', user }])
          } else {
            // 如果没有这么一个人
            resolve([200, { code: 500, msg: '账号错误' }])
          }
        }, 500)
      })
    })
    //  模拟注册接口
  }
}
