const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": event.openid,
        "page": 'pages/my/myPost/myPost?goCurrtab='+Number(1),
        "lang": 'zh_CN',
        "data": {
          "name4": {
            "value": event.sendName,
          },
          "phone_number10": {
            "value": event.sendPhone,
          },
          "thing9": {
            "value": event.ptjobPlace,
          },
          "phrase21": {
            "value": event.sendStatus
          }
        },
        "templateId": '566eDzNUCCJr6Tb6ioOAtTYhI1Qz-Jo6lTx_Y3Z4Sg4',
       // "miniprogramState": 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}