// pages/groupSpecial/groupSpecial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[
      {
        img:'',
        name:'微信头像1',
        time:'00:09:25'
      },
      {
        img:'',
        name:'微信头像2',
        time:'00:40:25'
      },
      {
        img:'',
        name:'微信头像3',
        time:'00:32:25'
      }
    ]
  },
  toActivityRule(event){
    wx.navigateTo({
      url: '/pages/activityRule/activityRule',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onShareAppMessage: function () {

  }
})