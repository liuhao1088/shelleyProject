const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2020-12-17 11:32',
    endTime: '2020-12-17 11:32',
    title:'',content:''
  },
  changeStartTime(e){
    this.setData({ startTime: e.detail.value})
  },
  changeEndTime(e) {
    console.log(e)
    this.setData({
      endTime: e.detail.value
    })
  },
  inputContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  inputTitle:function(e){
    this.setData({title:e.detail.value})
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
  async submit(){
    if(this.data.title!==''&&this.data.content!==''){
      this.add()
    }else{
      wx.showToast({
        title: '内容不能为空',
        icon:'none',
        duration:2000
      })
    }
  },
  add:function(){
    var that=this;
    var userInfo=wx.getStorageSync('userInfo')
    var creation_date=util.formatTime(new Date())
    wx.showLoading({
      title: '提交中',
    })
    wx.cloud.callFunction({
      name:'recordAdd',
      data:{
        collection:'activity',
        addData:{
          creation_date:creation_date,
          creation_timestamp:Date.parse(creation_date.replace(/-/g, '/')) / 1000,
          title:that.data.title,
          content:that.data.content,
          start_date:that.data.startTime,
          start_timestamp:Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          end_date:that.data.endTime,
          end_timestamp:Date.parse(that.data.endTime.replace(/-/g, '/')) / 1000,
          shop_code:userInfo.shop[userInfo.shop.length-1].shop_code,
          _openid:userInfo._openid,
          type:'reservation'
        }
      }
    }).then(res=>{
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '发布活动成功',
        icon:'success',
        duration:2000
      })
      setTimeout(res=>{
        wx.navigateBack({
          delta: 0,
        })
      },2000)
    }).catch(error => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '服务器繁忙，请稍后重试',
      })
    })
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