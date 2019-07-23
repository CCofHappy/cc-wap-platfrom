const state = () => ({
  user: null,
  order: {
    org: {},//机构
    customer: {},//客户
    formItem: {},//下个页面的对象
    wareGoods:[],//有库存的商品
  },
})
export default state
