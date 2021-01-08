var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    userInfo:{type:'driver',nickName:'用户名',avatarUrl:''}
  },
  toMyCoupon(){
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
  },
  toAddStoreInformation(){
    wx.navigateTo({
      url: '/pages/addStoreInformation/addStoreInformation',
    })
  },
  toCarAppointment(){
    wx.navigateTo({
      url: '/pages/carAppointment/carAppointment',
    })
  },
  toMyStore(){
    wx.navigateTo({
      url: '/pages/myStore/myStore',
    })
  },
  toAllstore(){
    wx.navigateTo({
      url: '/pages/allstore/allstore',
    })
  },
  toHelpAndFeedback(){
    wx.navigateTo({
      url: '/pages/helpAndFeedback/helpAndFeedback',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    if(wx.getStorageSync('userInfo')){
      let userInfo =  wx.getStorageSync('userInfo');
      this.setData({
        userInfo
      })
      console.log(userInfo)
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.from)
      return {
        title: "雪莱特智能LED车灯", //分享标题
        imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
        path: 'pages/index/index'
      }
    } else {
      return {
        title: "雪莱特智能LED车灯", //标题
        imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
        path: '/page/index/index'
      }
    }
  }
})