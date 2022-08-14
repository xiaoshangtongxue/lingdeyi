const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //要推送给那个用户
      //touser: "orFAc42-Naj3-q0VUmxEqs_3CzhY",
      page: 'pages/my/myIncomeDetail/myIncomeDetail?orderFormId='+event.orderFormId, //要跳转到那个小程序页面
      data: {
        thing3: {
          value: event.GoodsName,
        },
        character_string4: {
          value: event.orderNo,
        },
        phrase14: {
          value: event.GoodsStatus,
        },
        time5: {
          value: event.givetime,
        },
        thing15: {
          value:event.remark,
        },
        
      }, 
      templateId: 'SldzZqnw3SHSEM3zADp0h_Fc6SO09qFFGaCSqJ15_Ms' //模板id
    })
    // console.log(result)
    return result
  } catch (err) {
    // console.log(err)
    return err
  }
}
  