function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatTimes(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function nextYear(date) {
  var year = date.getFullYear()+1
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function nowTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-');
}

function year(date) {
  var year = date.getFullYear()
  return year;
}

function month(date) {
  var month = date.getMonth() + 1
  return month;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function uploadimg(i, parse, content, arr) { 
  if (parse.length == 0) return; 
  return new Promise((resolve, reject) => { 
    let code = getRandomCode(); 
    let numberCode = ""; 
    for (let e = 0; e < 6; e++) { 
      numberCode += Math.floor(Math.random() * 10) 
    } 
    let path = parse[i] 
    let indx = path.lastIndexOf('.') 
    let postfix = path.substring(indx) 
    wx.cloud.uploadFile({ 
      cloudPath: content + '/' + content + '-' + code + "-" + numberCode + postfix, 
      filePath: parse[i], 
      success(res) { 
        arr.push(res.fileID) 
        resolve(arr); 
      } 
    }) 
  }) 
} 
 
function getRandomCode() { 
  let code = ""; 
  const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 
    'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 
    'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' 
  ]; 
 
  for (let i = 0; i < 6; i++) { 
    let id = Math.round(Math.random() * 61); 
    code += array[id]; 
  } 
  return code; 
}

function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = s.toFixed(1)  //千米保留两位小数
  return s
}

function Rad(d) { 
  //根据经纬度判断距离
  return d * Math.PI / 180.0;
}

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return  value1- value2;
  }
}

function nearby(){
  wx.getLocation({
    success(res) {
      console.log(res)
      const lat = res.latitude
      const lon = res.longitude
      wx.cloud.callFunction({
        name: 'nearby',
        data: {
          collection: 'activity',
          match: {
            type: 'team'
          },
          minlat: lat - 3,
          minlon: lon - 3,
          maxlat: lat + 3,
          maxlon: lon + 3,
          or: [{}],
          and: [{}],
          lookup: {
            from: 'shop',
            localField: 'shop_code',
            foreignField: 'shop_code',
            as: 'shop',
          },
          lookup2: {
            from: 'user',
            localField: '_openid',
            foreignField: '_openid',
            as: 'user',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 100
        }
      }).then(res => {
        //console.log(res)
        let data=res.result.list;
        for(let i in data){
          data[i].distance=getDistance(lat,lon,data[i].lat,data[i].lon)
          if(i==data.length-1){
            data.sort(compare("distance"));
            wx.setStorageSync('nearby', data[0])
          }
        }
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatTimes: formatTimes,
  nowTime: nowTime,
  year: year,
  nextYear:nextYear,
  month:month,
  uploadimg:uploadimg,
  getDistance:getDistance,
  compare:compare,
  nearby:nearby
}