// 云函数入口文件 
const cloud = require('wx-server-sdk') 
cloud.init() 
const db = cloud.database() 
exports.main = async (event, context) => { 
  const _ = db.command 
  const wxContext = cloud.getWXContext() 
  try { 
    return await db.collection('live') 
    .where({status:'waiting'}).orderBy('creation_date','desc').skip(0).get() 
    .then(res => { 
      var date=new Date(); 
      let now= [date.getFullYear(),date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes()].join(':') 
      let stamp=Date.parse(now.replace(/-/g, '/')) / 1000; 
      console.log(res,now) 
      let data=res.data; 
      data.forEach((item,index,arr)=> { 
        if(item.timestamp-stamp<=7200){ 
          cloud.openapi.subscribeMessage.send({ 
            touser: 'oQQ_f4s48shRNF-_wWLKnAgCEfew', 
            page: 'pages/index/index', 
            lang: 'zh_CN', 
            data: { 
              "time1": { 
                "value": item.date 
              }, 
              "phrase2": { 
                "value": '视频直播' 
              }, 
              "thing9": { 
                "value": '直播就要开始了，复制视频号观看直播' 
              }, 
            }, 
            templateId: '-m92htbt5V0SlqRwZaMZAy9l3mv3CNseLM-yDKlRG5g', 
            miniprogramState: 'developer' 
          }).then(res=>{ 
            db.collection('live').where( 
              {_id:item._id} 
            ).update({ 
              data:  
                {status:'complete'} 
            }) 
          }) 
        } 
      }); 
      return stamp 
    }) 
    .catch(err => console.error(err)) 
  } catch (e) { 
    console.log(e) 
  } 
}