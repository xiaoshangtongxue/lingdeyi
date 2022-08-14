const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //要推送给那个用户
      //touser: "orFAc42-Naj3-q0VUmxEqs_3CzhY",
      page: 'pages/my/myIncomeDetail/myIncomeDetail?orderFormId='+event.orderFormId, //要跳转到那个小程序页面
      data: {
        thing11: {
          value: event.GoodsName,
        },
        thing15: {
          value: event.nickName,
        },
        thing20: {
          value: event.GoodsWay,
        },
        thing8: {
          value: event.address,
        },
        thing7: {
          value:event.remark,
        },
        
      }, 
      templateId: 'OgmNzl3p7y3sWo7_9ONL_pXSNG6ZoVhRmKaUTskSwcs' //模板id
    })
    // console.log(result)
    return result
  } catch (err) {
    // console.log(err)
    return err
  }
}
  
