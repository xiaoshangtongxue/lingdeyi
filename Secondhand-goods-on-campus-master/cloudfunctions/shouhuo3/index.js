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
    return await db.collection('FoodOrderInfo').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        status:event.status,
        isstatus:event.isstatus,
        Takefood:event.Takefood
     }
    })
  } catch (e) {
    console.error(e)
  }
}

