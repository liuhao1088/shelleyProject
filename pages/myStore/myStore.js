// pages/myStore/myStore.js
var userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toStoreInformation(event) {
    let data = JSON.stringify(wx.getStorageSync('userInfo'))
    wx.navigateTo({
      url: '/pages/storeInformation/storeInformation?data=' + data,
    })
  },
  toActivityDetails(event) {
    wx.navigateTo({
      url: '/pages/activityDetails/activityDetails',
    })   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userInfo')
    let code=userInfo.shop[userInfo.shop.length-1].shop_code;
    switch(JSON.stringify(code).length){
      case 1:
        code='00'+JSON.stringify(code)
        break;
      case 2:
        code='0'+JSON.stringify(code)
        break;
    }
    wx.setNavigationBarTitle({
      title: "我的门店码："+code
    })

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