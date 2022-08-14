// 云函数入口文件
const cloud = require('../SearchGoodsNum/node_modules/wx-server-sdk')
var request = require('request')


// 云函数入口函数
exports.main = async (event, context) => {
  //qz
  return new Promise((resolve, reject) => {
    request({
      url: event.url,
      method: "POST",//GET
      json: true,
      headers: {
        "content-type": "application/json",
        "token": event.token
      },
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        try {
          resolve(body)
        } catch (e) {
          reject()
        }
      }
    })
  })
}