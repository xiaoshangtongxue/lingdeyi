// 云函数代码
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xywh-tzsc-0gmucdg8683774aa'
})

exports.main = async (event, context) => {
  // const res = await cloud.cloudPay.unifiedOrder({
  //   "body" : "小秋TIT店-超市",
  //   "outTradeNo" : "121775" + new Date().getTime(),
  //   "spbillCreateIp" : "127.0.0.1",
  //   "subMchId" : "1604476079",
  //   "totalFee" : 1,
  //   "envId": "qxjd-9g3orvu425647bfb",
  //   "functionName": "pay_cb",
  // })

  const res = await cloud.cloudPay.unifiedOrder({
    "body" : event.desc,
    "outTradeNo" : event.orderCode,
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1616038781",
    "totalFee" : event.price*100,
    // "totalFee" : 1,
    "envId": "xywh-tzsc-0gmucdg8683774aa",
    // 'detail': event.detail,
    "functionName": "pay_cb",//支付成功回调
  })
  return res
}