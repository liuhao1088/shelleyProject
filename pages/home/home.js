// pages/wode/wode.js
var app = getApp();
var util=require('../../utils/util.js')
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
    tabbar: {},
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    let model = app.globalData.systemInfo.model;
    let isIphoneX = model.search('iPhone X') != -1 ? true : false;
    let isIphone11 = model.search('iPhone 11') != -1 ? true : false;
    let isIphone12 = model.search('iPhone 12') != -1 ? true : false;
    console.log(model);
    this.selectComponent("#getJudgment").getJudgment(isIphoneX,isIphone11,isIphone12);
    if(isIphoneX === true || isIphone11 === true || isIphone12 === true){
      this.setData({
        bottom:'220rpx'
      })
    }else{
      this.setData({
        bottom:'150rpx'
      })
    }
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
        wx.setStorageSync('userInfo', user)
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function () {
    return {
      title: "雪莱特智能LED车灯", //标题
      imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
      path: '/pages/home/home'
    }
   }
})