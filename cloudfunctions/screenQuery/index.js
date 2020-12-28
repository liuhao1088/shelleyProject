// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const $ = db.command.aggregate;
const _=db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event)
    return await db.collection(event.collection)
    .aggregate().match(event.match).match(_.or(event.or).and(event.and)).match({start_timestamp:_.lte(event.stamp),end_timestamp:_.gte(event.stamp)}).match({
      lon: _.gte(event.minlon).and(_.lte(event.maxlon))}).match({lat: _.gte(event.minlat).and(_.lte(event.maxlat))
    }).lookup(event.lookup).lookup(event.lookup2).sort(event.sort).skip(event.skip).limit(event.limit)
    .end().then(res=>{
      console.log(res)
      return res
    })
  } catch (e) {
    console.error(e)
  }
}