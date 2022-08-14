const tcb = require('@cloudbase/node-sdk')
const http = require('http.js')
const { templateId } = require('key.json')

const cloud = tcb.init({
  env: tcb.SYMBOL_CURRENT_ENV
})

exports.main = async (event) => {
  const { openid,type,name,phone,phone1,address} = event
  if (openid == null) return 404
  const token = (await cloud.callFunction({
    name: 'getToken'
  })).result
  if (token.code == null) {
    const obj = {
      touser: openid,
      template_id: templateId,
      // url: 'https://acc.cloudbase.vip/scan/eks/', // 此为示例，可自行更改，以文档为准
      data: {
        first: {
          value: '你有一个新的订单',
          color: '#173177'
        },
        keyword1: {
          value: type,
          color: '#173177'
        },
        keyword2: {
          value: name,
          color: '#173177'
        },
        keyword3: {
          value: phone,
          color: '#173177'
        },
        keyword4: {
          value: phone1,
          color: '#173177'
        },
        keyword5: {
          value: address,
          color: '#173177'
        },
        remark: {
          value: '请及时进入小程序接单',
          color: '#07C160'
        }
      }
    }
    const result = await http.templateSend(token, obj)
    console.log(result)
    return null
  } else {
    return {
      code: -1,
      msg: token.code
    }
  }
}
