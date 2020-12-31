// pages/storeInformation/storeInformation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop:''
  },
  toAddStoreInformation(event){
    wx.navigateTo({
      url: '/pages/addStoreInformation/addStoreInformation?data='+JSON.stringify(this.data.shop),
    })
  },
  previewImg:function(e){
    var ind=e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.shop.shop_img[ind], // 当前显示图片的http链接
      urls:this.data.shop.shop_img
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
    let userInfo=wx.getStorageSync('userInfo')
    let shop=userInfo.shop[userInfo.shop.length-1]
    console.log(shop)
    this.setData({shop:shop})
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