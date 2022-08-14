// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()
// 云函数入口函数
//传递的参数可通过event.xxx得到

exports.main = async (event, context) => {
  console.log('event.id',event.id)
  try {
    return await db.collection('ptjoborder').where({
      ptjobId:event.id
    }).update({
      // data 传入需要局部更新的数据
      data: {
        sendStatus:event.sendStatus,
        oderIsstatus:event.oderIsstatus,
        orderinfo:event.orderinfo,
  
     }
    })
  } catch (e) {
    console.error(e)
  }
}
