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
    return await db.collection('wxGoodsPost').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        GoodsStatus: event.GoodsStatus,
        givetime:event.givetime,
        account:event.account,
        Buyopenid:event.Buyopenid
     }
    })
  } catch (e) {
    console.error(e)
  }
}
