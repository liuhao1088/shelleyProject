// 云函数入口文件 
const cloud = require('wx-server-sdk') 
cloud.init() 
const db = cloud.database() 
let arr=[];
let skip;
let length;
let id;
async function re_query() { 
  if(length<100){ return } 
  await db.collection('reservation').where({live_id:id}).orderBy('creation_date','desc').skip(skip).get().then(async res=>{
    arr=arr.concat(res.data)
    length=res.data.length;
    console.log(arr,length)
    skip=skip+100;
    await re_query(arr,skip,length,id)
  })
}
exports.main = async (event, context) => { 
  const _ = db.command 
  const wxContext = cloud.getWXContext() 
  
  try { 
    return await db.collection('live') 
    .where({status:'waiting'}).orderBy('creation_date','desc').skip(0).get() 
    .then(async res => { 
      var date=new Date(); 
      let now= [date.getFullYear(),date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes()].join(':') 
      let stamp=Date.parse(now.replace(/-/g, '/')) / 1000; 
      console.log(res,now) 
      let data=res.data; 
      let indx=0;
      async function send(){
        let item=data[indx]
        if(item.timestamp-stamp<=7200){ 
          id=item._id;
          arr=[]
          length=100;
          skip=0;
          console.log(arr,id,skip,length)
          await re_query()
          console.log(arr,id,skip,length)
          await arr.forEach(async (i,ind,arr)=>{
            console.log(arr[ind]._openid)
            cloud.openapi.subscribeMessage.send({ 
              touser: arr[ind]._openid, 
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
              miniprogramState: 'developer' //formal
            }).then(res=>{ 
              console.log(res)
            })
          })  
          db.collection('live').where( 
            {_id:item._id} 
          ).update({ 
            data:  
              {status:'complete'} 
          }) 
        } 
        if(indx<data.length){
          setTimeout(()=>{
            indx=indx+1;
            send()
          },arr.length*1000);
        }else{
          return
        }
      }
      send()
      return stamp 
    }) 
    .catch(err => console.error(err)) 
  } catch (e) { 
    console.log(e) 
  } 
}