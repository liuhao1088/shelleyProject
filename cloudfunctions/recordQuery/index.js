// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const $ = db.command.aggregate;
const _=db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //这里的update依据是event._id
    return await db.collection(event.collection).aggregate().match(event.where)
		  .lookup({
		    from: event.from,
        let:event.let,
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(event.match)
          ])))
          .project(event.project)
          .done(),
          as: event.as,
		  }).sort(event.sort).skip(event.skip).limit(event.limit).end()
		  .then(res => {
        console.log(res)
        return res
      })
      .catch(err => console.error(err))
  } catch (e) {
    console.error(e)
  }
}