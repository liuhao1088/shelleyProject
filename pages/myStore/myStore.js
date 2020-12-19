// pages/myStore/myStore.js
var userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toStoreInformation(event) {
    let data=JSON.stringify(wx.getStorageSync('userInfo'))
    console.log(data)
    wx.navigateTo({
      url: '/pages/storeInformation/storeInformation?data='+data,
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
    var that = this;
    if (!wx.getStorageSync('userInfo').shop) {
      userInfo = wx.getStorageSync('userInfo')
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
            from: 'message',
            localField: '_openid',
            foreignField: '_openid',
            as: 'message',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 1
        }
      }).then(res => {
        console.log(res)
        let data = res.result.list[0];
        wx.setStorageSync('userInfo', data)
        userInfo=data;
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