const statusList = {
    '010': "待付款",
    '020': "已支付",
    '030': "已回款",
    '040': "待本部CRM开单",
    '050': "CRM开单中",
    '060': "本部CRM开单成功",
    '070': "本部CRM开单失败",
    '080': "本部CRM审核通过",
    '090': "本部CRM审核失败",
    '100': "事业部系统开单成功",
    '110': "事业部系统开单失败",
    '120': "待发货",
    '130': "已发货",
    '140': "物流已签收",
    '150': "用户已签收",
    '160': "已完成",
    '170': "冲红中",
    '180': "冲红成功",
    '190': "已作废",
    '051': "转发CRM失败",
    '101': "CRM订单生效失败",
    '172': "事业部冲红成功",
    '174': "事业部冲红失败",
    '176': "CRM冲红成功",
    '178': "CRM冲红失败",
};

const shipList = {
    '1': "配送",
    '2': "自提",
    '3': "配送",
    '4': "快递",
    '5': "配送",
    '6': "配送",
    '7': "配送",
};

const productList = {
    '01': "TCL_TV产品线",
    '02': "东芝_TV产品线",
    '03': "乐华_TV产品线",
    '04': "TCL_健康电器",
    '05': "雷鸟_TV产品线",
    '07': "TCL_手机产品线",
    '08': "TCL_空调产品线",
    '09': "TCL_白电产品线",
    'ZZ': "自营品",
}

export { statusList, shipList, productList }