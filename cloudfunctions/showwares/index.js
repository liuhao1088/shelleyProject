// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return [{name:'如影系列-R1',original_price:'699',voltage:'12V',power:'35W',introduce:'35W稳定功率|独家3.0光型|极速导热',link:'cloud://cnlight-1gn7d20g2cef1b76.636e-cnlight-1gn7d20g2cef1b76-1304521683/shopping/R1.png',page:'rOne'},{name:'如影系列-R2',original_price:'899',voltage:'12V',power:'45W',introduce:'45W超高功率|独家3.0光型|智能温控',link:'cloud://cnlight-1gn7d20g2cef1b76.636e-cnlight-1gn7d20g2cef1b76-1304521683/shopping/R2.png',page:'rTwo'},{name:'斑马系列-B2',original_price:'',voltage:'12V',power:'28W',introduce:'强力散热|独家3.0光型|专车专用卡盘',link:'cloud://cnlight-1gn7d20g2cef1b76.636e-cnlight-1gn7d20g2cef1b76-1304521683/shopping/B2.png',not_joining:true,page:'bTwo'},{name:'斑马系列-B3',original_price:'',voltage:'12V',power:'35W',introduce:'智能高亮|独家3.0光型|高效导热散热',link:'cloud://cnlight-1gn7d20g2cef1b76.636e-cnlight-1gn7d20g2cef1b76-1304521683/shopping/B3.png',not_joining:true,page:'bThree'},{name:'双色系列-S3',original_price:'',voltage:'12V',power:'35W',introduce:'双色灯珠|独家3.0光型|散热强劲',link:'cloud://cnlight-1gn7d20g2cef1b76.636e-cnlight-1gn7d20g2cef1b76-1304521683/shopping/S3.png',not_joining:true,page:'sThree'},{name:'犀牛系列-T3',original_price:'',voltage:'24V',power:'35W',introduce:'35W高功率|独家3.0光型|货车专用',link:'cloud://cnlight-1gn7d20g2cef1b76.636e-cnlight-1gn7d20g2cef1b76-1304521683/shopping/T3.png',not_joining:true,page:'tThree'}]
  
}