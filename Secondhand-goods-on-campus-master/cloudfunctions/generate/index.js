const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.urllink.generate({
        "path": '/pages/shouye/shouye',
        "query": '',
        "isExpire": false,
        "expireType": 1,
        "expireInterval": 1,
        "envVersion": 'release',
       /*  "cloudBase": {
          "env": 'xywh-tzsc-0gmucdg8683774aa',
          "domain": '',
          "path": '/shouye.html',
          "query": ''
        } */
      })
    return result
  } catch (err) {
    return err
  }
}