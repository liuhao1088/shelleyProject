// pages/activitySelect/activitySelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parse:''
  },
  toReservationActivity(event){
    switch(this.data.parse){
      case '':
        wx.navigateTo({
          url: '/pages/reservationActivity/reservationActivity',
        })
        break;
      default:
        wx.navigateTo({
          url: '/pages/reservationActivity/reservationActivity?parse='+'parse',
        })
    }
  },
  toGroupActivities(event){
    switch(this.data.parse){
      case '':
        wx.navigateTo({
          url: '/pages/groupActivities/groupActivities',
        })
        break;
      default:
        wx.navigateTo({
          url: '/pages/groupActivities/groupActivities?parse='+'parse',
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.data){
      this.setData({parse:'pr'})
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
  // onShareAppMessage: function () {

  // }
})