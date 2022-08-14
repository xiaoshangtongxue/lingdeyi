// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()
const _ = db.command
// 云函数入口函数
//传递的参数可通过event.xxx得到

exports.main = async (event, context) => {
  var word = 'Package_time.0.'+event.index+'.num';
  try {

    return await db.collection('paotuiDatas').doc(event.id).update({
      // data 传入需要局部更新的数据

      data: {
        [word]: _.inc(event.Num) //库存数量减1
     }
    })
  } catch (e) {
    console.error(e)
  }
}
