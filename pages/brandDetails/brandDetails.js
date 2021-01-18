var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    let model = app.globalData.systemInfo.model;
    let isIphoneX = model.search('iPhone X') != -1 ? true : false;
    let isIphone11 = model.search('iPhone 11') != -1 ? true : false;
    let isIphone12 = model.search('iPhone 12') != -1 ? true : false;
    console.log(model);
    this.selectComponent("#getJudgment").getJudgment(isIphoneX,isIphone11,isIphone12);
    if(isIphoneX === true || isIphone11 === true || isIphone12 === true){
      this.setData({
        bottom:'220rpx'
      })
    }else{
      this.setData({
        bottom:'100rpx'
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
  // onShareAppMessage: function () {

  // }
})