// pages/activityDetails/activityDetails.js
var util=require('../../utils/util.js')
var skip=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],stamp:Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
  },
  toActivitySelect(event){
    wx.navigateTo({
      url: '/pages/activitySelect/activitySelect',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          widheight: res.windowHeight,
          scrollHev: res.windowHeight - (res.windowWidth/750)*100,
          stamp:Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000
        });
      }
    });
    that.loadData();
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
  loadData:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    let userInfo=wx.getStorageSync('userInfo')
    var _=wx.cloud.database().command;
    wx.cloud.database().collection('activity').where({shop_code:userInfo.shop[userInfo.shop.length-1].shop_code}).orderBy('creation_date','desc').skip(skip).limit(10).get().then(res=>{
      let data=that.data.list.concat(res.data)
      if(res.data.length==0){
        wx.showToast({
          title: '暂无更多数据',
          icon:'none',
          duration:2000
        })
      }
      that.setData({list:data})
      wx.hideLoading()
      wx.hideNavigationBarLoading()
    })
  },
  async bindDownLoad() {
    wx.showNavigationBarLoading() 
    skip = skip + 10;
    await this.loadData()
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