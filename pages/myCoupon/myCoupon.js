// pages/myCoupon/myCoupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
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
    return {
      title: "【仅剩1个名额】我领了100元拼团券，快来助我成团激活~", //分享标题
      imageUrl: 'https://img13.360buyimg.com/ddimg/jfs/t1/121210/17/18389/166336/5faca14cE7949307a/1da2d6b96122e01d.jpg', //图片路径
      path: '/page/groupSpecial/groupSpecial'
    }
  }
})