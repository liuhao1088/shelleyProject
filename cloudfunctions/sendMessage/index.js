const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        page: 'index',
        lang: 'zh_CN',
        data: {
          number01: {
            value: '339208499'
          },
          date01: {
            value: '2015年01月05日'
          },
          site01: {
            value: 'TIT创意园'
          },
          site02: {
            value: '广州市新港中路397号'
          }
        },
        templateId: event.templateId,
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}