 // 云函数入口文件
 const cloud = require('wx-server-sdk')
 const QcloudSms = require("qcloudsms_js")
 const appid = 1400434008 // 替换成您申请的云短信 AppID 以及 AppKey
 const appkey = "dbb499ba5de91fbfc3af8cae2225b380"
 const templateId = 742176 // 替换成您所申请模板 ID
 const smsSign = "hs" // 替换成您所申请的签名

 cloud.init()
 // 云函数入口函数
 exports.main = async (event, context) => new Promise((resolve, reject) => {    
   /*单发短信示例为完整示例，更多功能请直接替换以下代码*/
   var qcloudsms = QcloudSms(appid, appkey);
   var ssender = qcloudsms.SmsSingleSender();
   var params=[""] ;
   //生成6位数随机验证码
    for (var i = 0; i < 6; i++) {
      params[0] += Math.floor(Math.random() * 10);
    }
   // 获取发送短信的手机号码
   var mobile = event.mobile
   // 获取手机号国家/地区码
   var nationcode = event.nationcode
   ssender.sendWithParam(nationcode, mobile, templateId, params, smsSign, "", "", (err, res, resData) => {
       /*设置请求回调处理, 这里只是演示，您需要自定义相应处理逻辑*/
       if (err) {
         console.log("err: ", err);
         reject({ err })
       } else {
         resolve({ res: res.req, resData })
       }
     }
   );

 })