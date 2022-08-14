// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()
const _ = db.command
// 云函数入口函数
//传递的参数可通过event.xxx得到

exports.main = async (event, context) => {
  console.log('event.id',event.id)
  try {
    return await db.collection('wxGoodsPost').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        status: event.status,
        isStatus: event.isStatus,
        GoodsNum: _.inc(event.Num) //库存数量减1

     }
    })
  } catch (e) {
    console.error(e)
  }
}
