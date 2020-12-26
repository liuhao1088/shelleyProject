// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return [
    {"image":"https://iknow-pic.cdn.bcebos.com/aa18972bd40735faec8cb65b95510fb30e2408d7","name":"海阔天空",surplus:4}
    ,
    {"image":"https://iknow-pic.cdn.bcebos.com/962bd40735fae6cd709e538304b30f2442a70f2d","name":"天道酬勤",surplus:5}
    ,
    {"image":"https://iknow-pic.cdn.bcebos.com/4afbfbedab64034f65b13ae4a4c379310b551dd7","name":"厚德载物",surplus:3}
    ,
    {"image":"https://iknow-pic.cdn.bcebos.com/6609c93d70cf3bc7770c350eda00baa1cc112ac0","name":"笑看红尘",surplus:6}
    ,
    {"image":"https://iknow-pic.cdn.bcebos.com/6609c93d70cf3bc7770c350eda00baa1cc112ac0","name":"人生如戯",surplus:2}
    ,
    {"image":"https://pic4.zhimg.com/v2-95f93c69472e742404c4ba5101fa6444_r.jpg?source=1940ef5c","name":"租房加我",surplus:1}
    ,
    {"image":"http://img.duoziwang.com/2017/09/1606174261304.jpg","name":"空谷幽兰",surplus:7}
    ,
    {"image":"http://img.duoziwang.com/2016/08/09/2121257797.jpg","name":"A@顺其自然",surplus:5}
    ,
    {"image":"https://pic4.zhimg.com/80/v2-59ba32cfb70b2fa6fa174bd57d0db7f7_720w.jpg?source=1940ef5c","name":"知足就是幸福",surplus:4}
    ,
    {"image":"https://pic1.zhimg.com/80/v2-0c0c552fd58e2cc0a60013724da4d3dd_720w.jpg?source=1940ef5c","name":"久伴别酒伴",surplus:8}
    ,
    {"image":"https://pic4.zhimg.com/80/v2-b60a9643d50f7d294ec22d861e2e028d_720w.jpg?source=1940ef5c","name":"雪后寻梅",surplus:6}
    ,
    {"image":"https://pic1.zhimg.com/80/v2-2548f52616dae33defbd1a47b0975f81_720w.jpg?source=1940ef5c","name":"豪杰（伟强）13564865236",surplus:3}
    ,
    {"image":"https://pic2.zhimg.com/80/v2-8f7b0ec96f3f61254e5fa6a312f2a285_720w.jpg?source=1940ef5c","name":"云淡风清",surplus:3}
    ,
    {"image":"https://pic2.zhimg.com/80/v2-3f651cb5cba1eec553f909f008159a9d_720w.jpg?source=1940ef5c","name":"^^品酒大师",surplus:2}
    ,
    {"image":"https://pic1.zhimg.com/80/v2-3e1e0cd972177ce2f28f5b0bc949b28c_720w.jpg?source=1940ef5c","name":"知足是福",surplus:1}
    ,
    {"image":"https://pic1.zhimg.com/80/v2-6725e0be98ff374c33b8d1a6ac3d6451_720w.jpg?source=1940ef5c","name":"张永辉",surplus:9}
    ,
    {"image":"https://pic2.zhimg.com/80/v2-8bc8e2cd5aff9daa201025ed30ce353f_720w.jpg?source=1940ef5c","name":"笑看人生",surplus:5}
    ,
    {"image":"https://pic1.zhimg.com/80/v2-6f98dd2cf9fdd242a717f3651acd2f1b_720w.jpg?source=1940ef5c","name":"赵兴国",surplus:4}
    ,
    {"image":"https://pic4.zhimg.com/80/v2-ed648f233dcb0cc85ea6d63248d9e87a_720w.jpg?source=1940ef5c","name":"宁静致远",surplus:4}
    ,
    {"image":"https://pic2.zhimg.com/80/v2-fecce7e3b05626fa4362d6182e78d688_720w.jpg?source=1940ef5c","name":"王盛",surplus:3}
    ,
    {"image":"https://pic1.zhimg.com/80/v2-cf3af6620b7bd35b6f426985e55a1830_720w.jpg?source=1940ef5c","name":"一米阳光",surplus:7}
    ,
    {"image":"https://pic2.zhimg.com/80/v2-e084152d3b448736831f676906193ebc_720w.jpg?source=1940ef5c","name":"梁强15623654896",surplus:8}
    ,
    {"image":"https://pic4.zhimg.com/80/v2-12dc50a9562deb175bae12b2c986b706_720w.jpg?source=1940ef5c","name":"清风徐来，岁月静好",surplus:4}
    ,
    {"image":"https://pic4.zhimg.com/80/v2-129d8fdf65c9762a3a4b9330c0c0ca85_720w.jpg?source=1940ef5c","name":"龙胜才",surplus:5}
    ,
    {"image":"https://pic4.zhimg.com/80/v2-7964c1224be37b39f9a9fde850e44726_720w.jpg?source=1940ef5c","name":"漫步云端",surplus:3}
    ,
    {"image":"https://pic4.zhimg.com/80/v2-6562964fe60956ec775ba955c98622c7_720w.jpg?source=1940ef5c","name":"张长松",surplus:2}
    ,
    {"image":"https://pic1.zhimg.com/80/v2-a00a147ac270369d4153d7616420a08a_720w.jpg?source=1940ef5c","name":"轻舞飞扬",surplus:1}
    ,
    {"image":"https://pic2.zhimg.com/80/v2-240b68e4fad8da9c68c096fc2583302e_720w.jpg?source=1940ef5c","name":"上善若水",surplus:6}
    ,
    {"image":"https://pic2.zhimg.com/80/v2-716156e80812b63fc9b50c051cf8b87c_720w.jpg?source=1940ef5c","name":"坐看云起时",surplus:4}
    ,
    {"image":"https://pic1.zhimg.com/80/v2-9697e3442398018ad226fb1634d96799_720w.jpg?source=1940ef5c","name":"郑长松",surplus:4}
    ,
    {"image":"https://pic2.zhimg.com/80/v2-1660c7c7f9ba6e5272b928fd35b15764_720w.jpg?source=1940ef5c","name":"平凡可贵",surplus:7}
  ]
}