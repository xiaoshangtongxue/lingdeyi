// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event)
  switch (event.action) {
    case 'requestSubscribeMessage': {
      return requestSubscribeMessage(event)
    }
    case 'sendSubscribeMessage': {
      return sendSubscribeMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    case 'getcellphone':{
      return getCellphone(event);
    }
    default: {
      return 
    }
  }
}

/* async function requestSubscribeMessage(event) {
  // 此处为模板 ID，开发者需要到小程序管理后台 - 订阅消息 - 公共模板库中添加模板，
  // 然后在我的模板中找到对应模板的 ID，填入此处
  //return '请到管理后台申请模板 ID 然后在此替换' // 如 'N_J6F05_bjhqd6zh2h1LHJ9TAv9IpkCiAJEpSw0PrmQ'
  return 'uvw0h3n-cyhSLWbJXzJTLQKzXI95O9NlxmTs0sJ3KZY'
} */

/* async function sendSubscribeMessage(event) {
  const { OPENID } = cloud.getWXContext()

  const { templateId } = event
 console.log('event.openid',event.openid)
  const sendResult = await cloud.openapi.subscribeMessage.send({
    //touser: OPENID,
    touser: event.openid,
    templateId,
    miniprogram_state: 'developer',
    page: 'pages/openapi/openapi',
    // 此处字段应修改为所申请模板所要求的字段
    data: {
      character_string3: {
        value: '032456',
      },
      thing2: {
        value: '千喜东方酒店',
      },
      thing6: {
        value: '豪华大床房',
      },
      time7: {
        value: '2019-11-28 20:17:49',
      },
      amount4: {
        value: '300元',
      },
      
    }
  })

  return sendResult
} */

/* async function getWXACode(event) {

  // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用

  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }
  return uploadResult.fileID
} */

async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  })
}

async function getCellphone(event){
  // console.log(event.id.data.phoneNumber);
  return event.id.data.phoneNumber;
}
  