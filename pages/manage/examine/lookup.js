// pages/manage/examine/lookup.js
var editData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    editData = wx.getStorageSync('editData')
    if(editData.creation_date==undefined) editData.creation_date='无'
    this.setData({
      data:editData
    })
  },
  openLocation:function(){
    wx.openLocation({
      latitude: editData.lat,
      longitude: editData.lon,
    })
  },
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: editData.phone,
    })
  },
  previewImg:function(e){
    var ind=e.currentTarget.dataset.index;
    console.log(this.data.data.shop_img[ind])
    wx.previewImage({
      current: this.data.data.shop_img[ind], // 当前显示图片的http链接
      urls:this.data.data.shop_img
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