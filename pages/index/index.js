// pages/wode/wode.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: [
      'https://img12.360buyimg.com/ddimg/jfs/t1/148705/14/15342/31361/5fbb2538E10f5782c/01b82dfee5771477.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/149801/9/15214/84373/5fb77f5fE6703b3e3/cfc63e812c95bd6a.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/131154/14/16544/101703/5fb77f7bEf9dae1d6/a2e338acd1913cb2.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/122546/28/19388/99801/5fb77f8aE5bcec9c5/dd12a83a33c44745.png',
      'https://img10.360buyimg.com/ddimg/jfs/t1/153564/6/6918/31485/5fbb2566Ef69e10fb/37895c04bd3f96b7.png',
      'https://img12.360buyimg.com/ddimg/jfs/t1/121051/8/19558/32587/5fbb2550Ea70b561f/ed4f4616ae1b543b.png'
    ],
    checkbox: [{
      id: 0,
      name: '行车记录仪',
      checked: false,
    }, {
      id: 1,
      name: '专车专用记录仪',
      checked: false,
    }, {
      id: 2,
      name: '智能车机',
      checked: false,
    }, {
      id: 3,
      name: '隐形车衣',
      checked: false,
    }],
    modalName: 0,
    top: '',
  },
  toVideo() {
    wx.navigateTo({
      url: '/pages/video/video',
    })
  },
  toSubnav(event) {
    let id = event.currentTarget.id;
    if (id === '0') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/rOne/rOne',
      })
    } else if (id === '1') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/rTwo/rTwo',
      })
    } else if (id === '2') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/bTwo/bTwo',
      })
    } else if (id === '3') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/bThree/bThree',
      })
    } else if (id === '4') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/tThree/tThree',
      })
    } else {
      console.log(id);
      wx.navigateTo({
        url: '/pages/sThree/sThree',
      })
    }

  },

  toMyCoupon(event) {
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
  },

  toReserveStore(event) {
    wx.navigateTo({
      url: '/pages/reserveStore/reserveStore',
    })
  },

  toMyStore(event) {
    wx.navigateTo({
      url: '/pages/myStore/myStore',
    })
  },

  toCarAppointment(event) {
    wx.navigateTo({
      url: '/pages/carAppointment/carAppointment',
    })

  },

  toAllStore(event) {
    wx.navigateTo({
      url: '/pages/allStore/allStore',
    })
  },

  toActivityDetails(event) {
    wx.navigateTo({
      url: '/pages/activityDetails/activityDetails',
    })
  },

  toGroupSpecial(event) {
    wx.navigateTo({
      url: '/pages/groupSpecial/groupSpecial',
    })
  },

  hideModal(e) {
    this.setData({
      modalName: 1
    })
  },

  // 多选
  ChooseCheckbox(e) {
    console.log(e)
    let items = this.data.checkbox;
    let id = e.currentTarget.id;
    console.log(id)
    for (let i = 0; i < items.length; ++i) {
      if (items[i].id == id) {
        console.log(items[i].id)
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕高度
    // var windowHeight = wx.getSystemInfoSync().windowHeight;
    // console.log(windowHeight)
    // if(windowHeight < 800){
    //   that.setData({
    //     top : '168'
    //   })
    //   console.log(this.data.top)
    // }else if(windowHeight === 812){
    //   that.setData({
    //     top : '148'
    //   })
    // }else{
    //   that.setData({
    //     top : '142'
    //   })
    // }

  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
          if(wx.getStorageSync('userInfo')){

          }else{
            this.selectComponent("#authorize").showModal();
          }
        } else {
          //打开授权登录页
          this.selectComponent("#authorize").showModal();
        }
      }
    })
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
          console.log(res)
          let data=res.result.list;
          for(let i in data){
            data[i].distance=that.getDistance(lat,lon,data[i].lat,data[i].lon)
            if(i==data.length-1){
              data.sort(that.compare("distance"));
              wx.setStorageSync('nearby', data[0])
            }
          }
        })
      }
    })
  },
  toManage: function () {
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal();
    } else {
      let openid = wx.getStorageSync('userInfo')._openid;
      wx.cloud.database().collection('user').where({
        _openid: openid
      }).get().then(res => {
        if (res.data[0].authority == 'admin') {
          wx.navigateTo({
            url: '/pages/manage/manage',
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo')
      wx.cloud.callFunction({
        name: 'multQuery',
        data: {
          collection: 'user',
          match: {
            _openid: userInfo._openid
          },
          or: [{}],
          and: [{}],
          lookup: {
            from: 'shop',
            localField: '_openid',
            foreignField: '_openid',
            as: 'shop',
          },
          lookup2: {
            from: 'coupon',
            localField: '_openid',
            foreignField: '_openid',
            as: 'coupon',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 1
        }
      }).then(res => {
        let user = res.result.list[0];
        console.log(user)
        wx.setStorageSync('userInfo', user)
      })
    }

  },
  getDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(1)  //千米保留两位小数
    return s
  },
  Rad(d) { 
    //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return  value1- value2;
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})