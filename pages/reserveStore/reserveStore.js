// pages/reserveStore/reserveStore.js
var bmap = require('../../utils/bmap-wx.min.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:''
  },

  toAddStoreInformation(event){
    wx.navigateTo({
      url: '/pages/addStoreInformation/addStoreInformation',
    })
  },
  toStoreAppointment(event){
    wx.navigateTo({
      url: '/pages/storeAppointment/storeAppointment',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var BMap = new bmap.BMapWX({
      ak: 'yLnHh2rGyFiou5kZGVMtP0LLKWrXfr0i'
    });
    wx.getLocation({
      success (res) {
        console.log(res)
        const lat = res.latitude
        const lon = res.longitude
        BMap.regeocoding({
          location:lat + ',' + lon,
          success: function (res) { 
            console.log(res)
            that.setData({address:res.originalData.result.business})
          },
          fail: function (r) {
            console.log(r)
            wx.showToast({
              title: '请检查位置服务是否开启',
            })
           },
        });

      }
    })
  },
  chooseLocation: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          address: res.name,
        })
      },
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
  onShareAppMessage: function () {

  }
})