// pages/commonProblem/commonProblem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shelleyUrl: 'https://img11.360buyimg.com/ddimg/jfs/t1/158874/9/2534/303570/5ff948c8E7cfd438d/0ea0437e538abc3b.jpg',
    userUrl: 'https://img14.360buyimg.com/ddimg/jfs/t1/159966/22/2435/167692/5ff94b2dE74de1dd6/ed58a587a59eed21.png',
    flag: true,
    hidden:false

  },
  toHelpAndFeedback() {
    wx.navigateTo({
      url: '/pages/helpAndFeedback/helpAndFeedback',
    })
  },
  toActivityRules() {
    wx.navigateTo({
      url: '/pages/activityRule/activityRule',
    })
  },
  showtype(e) {
    this.setData({
      flag: false,
      hidden:true
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
      title: "雪莱特智能LED车灯", //标题
      imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
      path: '/pages/home/home'
    }
   }
})